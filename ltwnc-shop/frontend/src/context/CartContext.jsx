import { createContext, useContext, useState, useEffect, useRef } from "react";
import { message } from "antd";
import { useAuth } from "./AuthContext";
import api from "../services/api";

const CartContext = createContext(null);

// Helper: Convert server cart response to client shape
const mapServerCartToItems = (serverCart) => {
  if (!serverCart?.items) return [];
  return serverCart.items.map((ci) => ({
    id: String(ci.productId),
    name: ci.product?.name || '',
    imageUrl: ci.product?.image || '',
    price: ci.product?.price || 0,
    // size/color are not persisted on server; frontend no longer tracks them
    size: null,
    color: null,
    quantity: ci.quantity || 1,
    availableQuantity: ci.product?.stock || 0,
  }));
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  const guestKey = "cart_guest";
  const prevUserIdRef = useRef(user?.id ?? null);
  const [isLoading, setIsLoading] = useState(false);

  const [cartItems, setCartItems] = useState(() => {
    // For logged-in users we don't read/write localStorage for cart (server is authoritative)
    if (user?.id) return [];
    const savedCart = localStorage.getItem(guestKey);
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Persist cart to guest localStorage only when not logged in
  useEffect(() => {
    if (user?.id) {
      return;
    }

    try {
      localStorage.setItem(guestKey, JSON.stringify(cartItems));
    } catch (err) {
      console.warn('Error persisting guest cart to localStorage', err);
    }
  }, [cartItems, user?.id]);

  // Listen for logout event to clear cart and remove guest cache
  useEffect(() => {
    const handler = () => {
      try {
        localStorage.removeItem(guestKey);
      } catch (err) {
        console.warn('Error removing guest cart on logout', err);
      }
      setCartItems([]);
    };

    window.addEventListener('app:logout', handler);
    return () => window.removeEventListener('app:logout', handler);
  }, []);

  // Fetch and merge cart on login
  useEffect(() => {
    const prevId = prevUserIdRef.current;
    const curId = user?.id ?? null;

    // Always handle when user is logged-in: fetch server cart and merge guest
    if (curId) {
      (async () => {
        try {
          setIsLoading(true);
          // Fetch server cart
          const resp = await api.get('/cart');
          const serverCart = resp?.data || null;

          // Map server items to client shape
          const serverItems = mapServerCartToItems(serverCart);

          // Get guest cart from storage
          const guestCart = JSON.parse(localStorage.getItem(guestKey) || '[]');

          // Merge: server is authoritative, guest items add to it
          const merged = [...serverItems];
          for (const item of guestCart) {
            const idx = merged.findIndex(
              (m) => m.id === String(item.id || item.productId)
            );
            if (idx >= 0) {
              merged[idx].quantity = (merged[idx].quantity || 0) + (item.quantity || 0);
            } else {
              // normalize guest item shape
              merged.push({
                id: String(item.id || item.productId),
                name: item.name || '',
                imageUrl: item.imageUrl || '',
                price: item.price || 0,
                quantity: item.quantity || 1,
                availableQuantity: item.availableQuantity || 0,
              });
            }
          }

          // Clear guest storage
          try {
            localStorage.removeItem(guestKey);
          } catch (err) {
            console.warn('Error clearing guest cart on login', err);
          }

          setCartItems(merged);

          // Sync merged cart to server
          try {
            const itemsPayload = merged
              .map((item) => ({
                productId: Number(item.id),
                quantity: Number(item.quantity || 1),
              }))
              .filter((item) => Number.isInteger(item.productId) && item.productId > 0);
            
            const syncResp = await api.post('/cart/sync', { items: itemsPayload });
            if (syncResp?.data) {
              const updated = mapServerCartToItems(syncResp.data);
              setCartItems(updated);
            }
          } catch (err) {
            console.warn('Error syncing merged cart to server', err);
          }
        } catch (err) {
          console.warn('Error during login cart load/merge', err);
          message.error('Không thể tải giỏ hàng');
        } finally {
          setIsLoading(false);
        }
      })();
    }

    // Logged out (user -> guest): clear UI
    if (!curId) {
      try {
        localStorage.removeItem(guestKey);
      } catch (err) {
        console.warn('Error removing guest cart on logout', err);
      }
      setCartItems([]);
    }

    prevUserIdRef.current = curId;
  }, [user?.id]);

  // Add product to cart - call API immediately for logged-in users
  const addToCart = async (product) => {
    try {
      // For guest users, just update local state
      if (!user?.id) {
        setCartItems((prevItems) => {
          const existingItem = prevItems.find((item) => item.id === product.id);

          if (existingItem) {
            return prevItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + product.quantity } : item
            );
          } else {
            // normalize product shape (ensure id is string)
            return [...prevItems, { ...product, id: String(product.id) }];
          }
        });
        return;
      }

      // For logged-in users, call API immediately
      setIsLoading(true);
      const productId = Number(product.productId ?? product.id);
      
      if (!Number.isInteger(productId) || productId <= 0) {
        message.error('ID sản phẩm không hợp lệ');
        return;
      }

      const resp = await api.post('/cart/add', {
        productId,
        quantity: Number(product.quantity || 1),
      });

      // Update state from server response
      if (resp?.data) {
        const updated = mapServerCartToItems(resp.data);
        setCartItems(updated);
        message.success(resp.message || 'Sản phẩm đã được thêm vào giỏ');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMsg = error?.message || 'Lỗi khi thêm vào giỏ hàng';
      message.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // Remove product from cart - call API for logged-in users
  const removeFromCart = async (id) => {
    try {
      // For guest users, just update local state
      if (!user?.id) {
        setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
        return;
      }

      // For logged-in users, need to find cartItemId from current state
      const item = cartItems.find((i) => i.id === id);
      
      if (!item) {
        message.error('Không tìm thấy sản phẩm trong giỏ');
        return;
      }

      // Find the cartItemId from server (we need to re-fetch or store it)
      // Fetch current cart to get cartItemId
      setIsLoading(true);
      const cartResp = await api.get('/cart');
      const currentCart = cartResp?.data;
      
      if (!currentCart?.items) {
        message.error('Không thể lấy thông tin giỏ hàng');
        return;
      }

      const cartItem = currentCart.items.find((ci) => ci.productId === Number(id));

      if (!cartItem) {
        message.error('Không tìm thấy sản phẩm trong giỏ');
        return;
      }

      // Delete from server
      const deleteResp = await api.delete(`/cart/${cartItem.id}`);
      
      if (deleteResp?.data) {
        const updated = mapServerCartToItems(deleteResp.data);
        setCartItems(updated);
        message.success(deleteResp.message || 'Sản phẩm đã được xóa khỏi giỏ');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      message.error(error?.message || 'Lỗi khi xóa sản phẩm');
    } finally {
      setIsLoading(false);
    }
  };

  // Update quantity - call API for logged-in users
  const updateQuantity = async (id, quantity) => {
    try {
      if (quantity < 1) return;

      // For guest users, just update local state
      if (!user?.id) {
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
        );
        return;
      }

      // For logged-in users, call API
      setIsLoading(true);
      
      // Fetch current cart to get cartItemId
      const cartResp = await api.get('/cart');
      const currentCart = cartResp?.data;
      
      if (!currentCart?.items) {
        message.error('Không thể lấy thông tin giỏ hàng');
        return;
      }

      const cartItem = currentCart.items.find((ci) => ci.productId === Number(id));

      if (!cartItem) {
        message.error('Không tìm thấy sản phẩm trong giỏ');
        return;
      }

      // Update on server
      const updateResp = await api.put(`/cart/${cartItem.id}`, { quantity });
      
      if (updateResp?.data) {
        const updated = mapServerCartToItems(updateResp.data);
        setCartItems(updated);
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      message.error(error?.message || 'Lỗi khi cập nhật số lượng');
    } finally {
      setIsLoading(false);
    }
  };

  // Clear entire cart
  const clearCart = async () => {
    try {
      // For guest users, just clear state
      if (!user?.id) {
        setCartItems([]);
        return;
      }

      // For logged-in users, delete on server
      setIsLoading(true);
      const resp = await api.delete('/cart');

      if (resp?.message || resp?.data) {
        setCartItems([]);
        message.success(resp.message || 'Giỏ hàng đã được xóa');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      message.error(error?.message || 'Lỗi khi xóa giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal: () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0),
      getCartCount: () => cartItems.reduce((count, item) => count + item.quantity, 0),
      isLoading,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../services/api";

const ModuleContext = createContext(null);

export function ModuleProvider({ children }) {
  const [moduleStatuses, setModuleStatuses] = useState({});
  const [moduleCatalog, setModuleCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadModuleData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/modules");
      const payload = response.data || {};
      setModuleStatuses(payload.statuses || {});
      setModuleCatalog(payload.modules || []);
    } catch (error) {
      console.error("Failed to load module statuses", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadModuleData();
  }, [loadModuleData]);

  const refreshModuleStatuses = useCallback(async () => {
    await loadModuleData();
  }, [loadModuleData]);

  const isModuleEnabled = useCallback(
    (moduleName) => {
      if (loading) return true;
      if (Object.prototype.hasOwnProperty.call(moduleStatuses, moduleName)) {
        return moduleStatuses[moduleName];
      }
      return true;
    },
    [loading, moduleStatuses]
  );

  return (
    <ModuleContext.Provider
      value={{ moduleStatuses, moduleCatalog, loading, isModuleEnabled, refreshModuleStatuses }}
    >
      {children}
    </ModuleContext.Provider>
  );
}

export function useModules() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModules must be used within a ModuleProvider");
  }
  return context;
}

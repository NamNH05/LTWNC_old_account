import crypto from "crypto";

type SessionRecord = {
  sessionId: string;
  userId: number;
  tokenHash: string;
  createdAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
};

const sessions = new Map<string, SessionRecord>();

const hashToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

const parseExpiryToDate = (ttl: string) => {
  const now = Date.now();
  const match = ttl.match(/^(\d+)([smhd])$/);

  if (!match) {
    return new Date(now + 7 * 24 * 60 * 60 * 1000);
  }

  const value = Number(match[1]);
  const unit = match[2] as keyof typeof multiplier | undefined;
  const multiplier: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  if (!unit) {
    return new Date(now + 7 * 24 * 60 * 60 * 1000);
  }

  const selectedMultiplier = multiplier[unit];
  if (!selectedMultiplier) {
    return new Date(now + 7 * 24 * 60 * 60 * 1000);
  }

  return new Date(now + value * selectedMultiplier);
};

export const sessionService = {
  createSession: (userId: number, refreshToken: string, ttl: string) => {
    const sessionId = crypto.randomUUID();
    const record: SessionRecord = {
      sessionId,
      userId,
      tokenHash: hashToken(refreshToken),
      createdAt: new Date(),
      expiresAt: parseExpiryToDate(ttl),
    };

    sessions.set(sessionId, record);
    return record;
  },

  getSession: (sessionId: string) => {
    return sessions.get(sessionId);
  },

  validateRefreshToken: (sessionId: string, refreshToken: string) => {
    const session = sessions.get(sessionId);

    if (!session) return false;
    if (session.revokedAt) return false;
    if (session.expiresAt.getTime() < Date.now()) return false;

    return session.tokenHash === hashToken(refreshToken);
  },

  rotateRefreshToken: (sessionId: string, refreshToken: string, ttl: string) => {
    const session = sessions.get(sessionId);
    if (!session) return null;

    session.tokenHash = hashToken(refreshToken);
    session.expiresAt = parseExpiryToDate(ttl);
    sessions.set(sessionId, session);
    return session;
  },

  revokeSession: (sessionId: string) => {
    const session = sessions.get(sessionId);
    if (!session) return;
    session.revokedAt = new Date();
    sessions.set(sessionId, session);
  },

  revokeAllByUserId: (userId: number) => {
    for (const [key, value] of sessions.entries()) {
      if (value.userId === userId) {
        sessions.set(key, { ...value, revokedAt: new Date() });
      }
    }
  },

  listActiveByUserId: (userId: number) => {
    const now = Date.now();

    return [...sessions.values()].filter((session) => {
      return (
        session.userId === userId &&
        !session.revokedAt &&
        session.expiresAt.getTime() > now
      );
    });
  },
};

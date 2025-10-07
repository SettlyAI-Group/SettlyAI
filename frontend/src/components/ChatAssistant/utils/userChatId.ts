const USER_CHAT_ID_STORAGE_KEY = 'settly_ai_chat_user_id';
const USER_CHAT_ID_EXPIRES_KEY = 'settly_ai_chat_user_id_expires_at';
const USER_CHAT_ID_TTL_MS = 10 * 60 * 1000; // 10 minutes

const getStoredUserChatId = (): string | null => {
  if (typeof window === 'undefined') return null;

  const id = window.localStorage.getItem(USER_CHAT_ID_STORAGE_KEY);
  const expiresAtRaw = window.localStorage.getItem(USER_CHAT_ID_EXPIRES_KEY);

  if (!id || !expiresAtRaw) {
    return null;
  }

  const expiresAt = Number(expiresAtRaw);
  if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
    window.localStorage.removeItem(USER_CHAT_ID_STORAGE_KEY);
    window.localStorage.removeItem(USER_CHAT_ID_EXPIRES_KEY);
    return null;
  }

  return id;
};

const generateUserChatId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
};

const persistUserChatId = (id: string) => {
  if (typeof window === 'undefined') return;

  window.localStorage.setItem(USER_CHAT_ID_STORAGE_KEY, id);
  window.localStorage.setItem(
    USER_CHAT_ID_EXPIRES_KEY,
    String(Date.now() + USER_CHAT_ID_TTL_MS),
  );
};

export const ensureUserChatId = (): string | null => {
  const stored = getStoredUserChatId();
  if (stored) {
    persistUserChatId(stored); // refresh expiry
    return stored;
  }

  const newId = generateUserChatId();
  persistUserChatId(newId);
  return newId;
};

export const clearUserChatId = () => {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(USER_CHAT_ID_STORAGE_KEY);
  window.localStorage.removeItem(USER_CHAT_ID_EXPIRES_KEY);
};

export const getUserChatId = (): string | null => getStoredUserChatId();

export const isAdmin = (userId?: string) => {
  return Boolean(userId && userId === import.meta.env.VITE_ADMIN_USER_ID);
};

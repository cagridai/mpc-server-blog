export function getUserIdFromLocalStorage(): string | null {
  const authStorage = localStorage.getItem("auth-storage");
  if (!authStorage) return null;
  try {
    const parsed = JSON.parse(authStorage);
    return parsed?.state?.user?.id ?? null;
  } catch {
    return null;
  }
}

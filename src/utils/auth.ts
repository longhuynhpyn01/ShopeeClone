import { User } from "src/types/user.type";

// Tạo EventTarget để không phải dùng reload khi token hết hạn sẽ tự reset state trong context
export const LocalStorageEventTarget = new EventTarget();

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem("access_token", access_token);
};

export const setRefreshTokenToLS = (refresh_token: string) => {
  localStorage.setItem("refresh_token", refresh_token);
};

export const clearLS = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("profile");
  const clearLSEvent = new Event("clearLS"); // Tạo event clearLS
  LocalStorageEventTarget.dispatchEvent(clearLSEvent); // Xuất ra 1 event để bên App lắng nghe
};

export const getAccessTokenFromLS = () => localStorage.getItem("access_token") || "";

export const getRefreshTokenFromLS = () => localStorage.getItem("refresh_token") || "";

export const getProfileFromLS = () => {
  const result = localStorage.getItem("profile");
  return result ? JSON.parse(result) : null;
};

export const setProfileToLS = (profile: User) => {
  localStorage.setItem("profile", JSON.stringify(profile));
};

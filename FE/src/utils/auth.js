export const getRole = () => localStorage.getItem("role");
export const getToken = () => localStorage.getItem("token");
export const isLoggedIn = () => !!localStorage.getItem("token");
export const logout = () => {
  localStorage.clear();
  window.location.href = "/login";
};

export const baseURL: string = 
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://connectdev-be.onrender.com";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";

export default function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const [token, setToken] = useState(() =>
    localStorage.getItem("token")
  );
  const [notice, setNotice] = useState("");

  function login(newToken) {
    queryClient.clear();
    localStorage.setItem("token", newToken);
    setNotice("");
    setToken(newToken);
  }

  function logout() {
    localStorage.removeItem("token");
    queryClient.clear();
    setToken(null);
    setNotice("");
  }

  useEffect(() => {
    function handleExpiredSession() {
      localStorage.removeItem("token");
      queryClient.clear();
      setToken(null);
      setNotice("Your session has expired. Please log in again.");
    }

    function handleStorageChange(event) {
      if (event.key === "token" || event.key === null) {
        queryClient.clear();
        setToken(localStorage.getItem("token"));
        setNotice("");
      }
    }

    window.addEventListener("session-expired", handleExpiredSession);
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener(
        "session-expired",
        handleExpiredSession
      );
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [queryClient]);

  return (
    <AuthContext.Provider value={{ token, notice, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
import { useState, type ReactNode } from "react";
import { AuthContext } from "./AuthContext";

const USERNAME_KEY = "codeleap_username";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [username, setUsername] = useState<string | null>(() => {
    const stored = localStorage.getItem(USERNAME_KEY);

    return stored || null;
  });

  const login = (name: string) => {
    localStorage.setItem(USERNAME_KEY, name);
    setUsername(name);
  };

  const logout = () => {
    localStorage.removeItem(USERNAME_KEY);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

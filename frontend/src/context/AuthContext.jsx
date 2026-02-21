import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const idToken = await user.getIdToken();
        setUser(user);
        setToken(idToken);
      } else {
        setUser(null);
        setToken(null);
      }
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, token }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
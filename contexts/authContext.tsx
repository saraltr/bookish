import { auth } from "@/utils/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

// define the shape of the auth context value
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

// create the auth context with default values
const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // store the current user
  const [user, setUser] = useState<User | null>(null);
  // track whether the auth state is still being checked
  const [loading, setLoading] = useState(true);

  // listener for firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // update the user when auth state changes
      setUser(user);
      // turn off loading once checked
      setLoading(false);
    });
    // cleanup the listener when the component unmounts
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
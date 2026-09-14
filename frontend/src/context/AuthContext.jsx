import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken) {
        setToken(storedToken);
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to restore authentication state:", error);

      localStorage.removeItem("token");
      localStorage.removeItem("user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginUser = (authData) => {
    const { token: newToken, user: newUser } = authData;

    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }

    if (newUser) {
      localStorage.setItem(
        "user",
        JSON.stringify(newUser)
      );
      setUser(newUser);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  const isAuthenticated = Boolean(token && user);

  const isAdmin = user?.type === "admin";

const isSecondaryAdmin =
  user?.type === "admin" &&
  user?.role === "secondary_admin";

const isMainAdmin =
  user?.type === "admin" &&
  user?.role === "main_admin";

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    isAdmin,
    isSecondaryAdmin,
    isMainAdmin,
    loginUser,
    logoutUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
}
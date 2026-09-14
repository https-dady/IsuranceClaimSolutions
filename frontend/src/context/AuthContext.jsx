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

  /*
  =========================================================
  RESTORE AUTHENTICATION STATE
  =========================================================
  */

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
      console.error(
        "Failed to restore authentication state:",
        error
      );

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /*
  =========================================================
  LOGIN USER
  =========================================================

  Primary format:

  loginUser({
    token,
    user
  })

  Also supports the existing Login.jsx format:

  login(token, user)
  */

  const loginUser = (authData) => {
    if (!authData) {
      return;
    }

    const newToken = authData?.token;
    const newUser = authData?.user;

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

  /*
  =========================================================
  BACKWARD-COMPATIBLE LOGIN
  =========================================================

  Existing Login.jsx currently calls:

  login(token, user)

  Keep this compatibility layer so the existing login
  flow does not break.
  */

  const login = (newTokenOrAuthData, newUser) => {
    /*
    -------------------------------------------------------
    Format 1:
    login({
      token,
      user
    })
    -------------------------------------------------------
    */

    if (
      typeof newTokenOrAuthData === "object" &&
      newTokenOrAuthData !== null
    ) {
      loginUser(newTokenOrAuthData);
      return;
    }

    /*
    -------------------------------------------------------
    Format 2:
    login(token, user)
    -------------------------------------------------------
    */

    loginUser({
      token: newTokenOrAuthData,
      user: newUser,
    });
  };

  /*
  =========================================================
  LOGOUT
  =========================================================
  */

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
  };

  /*
  =========================================================
  AUTH STATE
  =========================================================
  */

  const isAuthenticated = Boolean(
    token && user
  );

  /*
  =========================================================
  ROLE CHECKS
  =========================================================
  */

  const isAdmin =
    user?.type === "admin";

  const isSecondaryAdmin =
    user?.type === "admin" &&
    user?.role === "secondary_admin";

  const isMainAdmin =
    user?.type === "admin" &&
    user?.role === "main_admin";

  /*
  =========================================================
  CONTEXT VALUE
  =========================================================
  */

  const value = {
    user,
    token,

    isLoading,

    isAuthenticated,

    isAdmin,
    isSecondaryAdmin,
    isMainAdmin,

    login,
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
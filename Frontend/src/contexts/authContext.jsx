import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);

  const isAuthenticated = !!accessToken;

  const navigate = useNavigate()
  const login = (token) => {
    setAccessToken(token);
    navigate("/home")
  };

  const logout = () => {
    setAccessToken(null);
  };

  const registered = () =>{
    navigate("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isAuthenticated,
        login,
        logout,
        registered
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

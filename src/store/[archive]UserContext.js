import { createContext } from "react";

const UserContext = createContext({
  firstName: "",
  lastName: "",
  authToken: "",
  userType: "",
  isLoggedIn: false,
  onLogin: () => {},
  onLogout: () => {},
  onChange: () => {},
});

export default UserContext;

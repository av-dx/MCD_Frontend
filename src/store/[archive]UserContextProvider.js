import UserContext from "./[archive]UserContext";
import { useReducer } from "react";

const defaultState = {
  firstName: "",
  lastName: "",
  authToken: "",
  userType: "",
  isLoggedIn: false,
};

const userReducer = (state, option) => {
  if (option.action === "LOGIN") {
    return {
      firstName: option.userInfo.firstName,
      lastName: option.userInfo.lastName,
      authToken: option.userInfo.authToken,
      userType: option.userInfo.userType,
      isLoggedIn: true,
    };
  } else if (option.action === "LOGOUT") {
    return defaultState;
  } else {
    // user first name or last name change
    let newState = { ...state };
    newState.firstName = option.firstName;
    newState.lastName = option.lastName;
    return newState;
  }
};

const UserContextProvider = (props) => {
  const [userState, userSateDispatcher] = useReducer(userReducer, defaultState);
  
  // useEffect(() => {
  //   const loginStatus = localStorage.getItem("userLoginState");
  //   if (loginStatus === "1") {
  //     setIsLoggedIn(true);
  //   }
  // }, []);

  const onUserLogin = (userInfo) => {
    console.log('at login', userInfo);
    // localStorage.setItem("userLoginState", "1");
    userSateDispatcher({ action: "LOGIN", userInfo: userInfo });
  };

  const onUserLogout = () => {
    console.log('logout !!')
    userSateDispatcher({ action: "LOGOUT" });
  };

  const onUserInfoChange = (firstName, lastName) => {
    userSateDispatcher({
      action: "USER_INFO_CHANGE",
      firstName: firstName,
      lastName: lastName,
    });
  };

  const defaultCtx = {
    firstName: userState.firstName,
    lastName: userState.lastName,
    authToken: userState.authToken,
    userType: userState.userType,
    isLoggedIn: userState.isLoggedIn,
    // firstName: "Samurai",
    // lastName: "jack",
    // authToken: "605bb2e0-ef6a-4593-b624-0077bca108ea",
    // userType: "admin",
    // isLoggedIn: true,
    onLogin: onUserLogin,
    onLogout: onUserLogout,
    onChange: onUserInfoChange,
  };
  return (
    <UserContext.Provider value={defaultCtx}>
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;


// firstName: "Johnny",
//     lastName: "Bravo",
//     authToken: "213763f7-f892-4edf-a215-aaf2b9d44594",
//     userType: "admin",
//     isLoggedIn: true,
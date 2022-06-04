import React, { useContext, useState } from "react";
import { Route, Redirect } from "react-router-dom";

// firebase
// import {auth} from "./auth/fireAuth";
import {AuthContext} from "./store/AuthProvider";

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const {userState,_} =useContext(AuthContext);
  const [userAuthToken, setUserAuthToken] =userState;
  
  return (
    <Route
      {...rest}
      render={(props) => {
  
        if(userAuthToken){
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default ProtectedRoute;
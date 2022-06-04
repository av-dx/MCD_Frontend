import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Register from "./auth/Register";
import LoginForm from "./auth/LoginForm";
import ForgotPassword from "./auth/ForgotPassword";

import NavBar from "./Nav";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./components/profileParts/Profile";

import Loading from "./components/Loading";
import CustomAlert from "./components/Alert";

import Tasks from "./components/Tasks"; 
import Sessions from "./components/Sessions";
import Questions from "./components/Questions";
import LeaderBoard from "./components/LeaderBoard";
import AddProblems from "./components/AddProblems";
// using TasksDev, to test new features without disturbing old ones
import TasksDev from "./components/taskParts/TasksDev"; 

// firebase
import { auth } from "./auth/fireAuth";
import { AuthContext } from "./store/AuthProvider";

import "./App.css";

const App = () => {
  // firebase
  const [done, setDone] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { uidState, userState, unameState, utypeState } = useContext(AuthContext);
  const [userAuthToken, setUserAuthToken] = userState;
  const [uname, setUname] = unameState;
  const [utype, setUtype] = utypeState;
  const [uid, setUid] =uidState;

  let isMounted = false;
  useEffect(() => {
    isMounted = true;
    const unsubscribe =auth.onAuthStateChanged(async (userAuth) => {
      setDone(false);
      console.log("@1App.js|authStateChanged:", userAuth);
      console.log("--isMounted:", isMounted);

      if (userAuth && isMounted) {
        const postObj = {
          method: "POST",
          cache: "no-cache",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userAuth.email,
            user_id: userAuth.uid,
          }),
        };

        // fetch details from backend
        let loginURL = `${process.env.REACT_APP_API}/user/login/`;
        const response = await fetch(loginURL, postObj);
        const data = await response.json();
        console.log("login response", data);
        setUid(data.user_id);
        setUtype(data.user_type);
        setUname(data.user_name);
        setUserAuthToken(data.auth_token);
      } else if (isMounted) {
        setUserAuthToken(null);
        setUname(null);
        setUtype(null);
        setUid(null);
      } else {
        console.log("waiting for isMounted");
      }
      setDone(true);
    });
    return () => {
      isMounted = false;
    };
  }, []); 

  document.title = "MCD";

  if (!done) {
    return (
      <div className="App">
        <Router>
          <NavBar />
          <Loading />
        </Router>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>
        <NavBar />
        {/* <div style={{height:"150px"}}> */}
        <CustomAlert
          show={showAlert}
          setShow={setShowAlert}
          alertMessage="Successfully registered."
          variant="success"
        />
        {/* </div> */}
        <div className="AppSpace">
        <Switch>
          <LoginForm exact path="/login" component={LoginForm} />
          <ForgotPassword exact path="/forgotpassword" component={ForgotPassword} />
          <Register
            exact
            path="/register"
            setShowAlert={setShowAlert}
            component={Register}
          />
          <Route exact path="/profile=:uid" component={Profile} />
          <LeaderBoard exact path="/leaderboard" component={LeaderBoard} />
          <ProtectedRoute exact path="/addProblems" component={AddProblems} />

          <Route exact path="/" component={TasksDev} />
          {/* <Route exact path="/tasksDev" component={TasksDev} /> */}
          <Route exact path="/task=:taskId" component={Sessions} />
          <ProtectedRoute exact path="/task=:taskId/:questionType/:snum.:quanta" component={Questions}/>

          <Route path="*" component={() => <h1>No such page</h1>} />
        </Switch>
        </div>
        {/* footer */}
      </Router>
    </div>
  );
};

export default App;

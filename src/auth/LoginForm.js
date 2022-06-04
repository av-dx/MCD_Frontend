import React, { useContext, useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import { useHistory } from "react-router";

import CustomAlert from "../components/Alert";
//firebase
import { auth } from "./fireAuth";
import {AuthContext} from "../store/AuthProvider";

import "./LoginForm.css";

const LoginForm = (props) => {
  // firebase
  const {userState, _} =useContext(AuthContext);
  const [userAuthToken, setUserAuthToken] =userState;
  
  const formRef = useRef();
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] =useState(null);
  const [password, setPassword] = useState("");
  const [passError, setPassError] =useState(null);

  const [showAlert, setShowAlert] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  
  if (userAuthToken) {
    try {
      history.push(props.location.state.from.pathname);
    } catch {
      history.push("/");
    }
  }

  const onEmailChange = (event) => {
    setEmailError(null);
    setEmail(event.target.value);
  };
  const onPasswordChange = (event) => {
    setPassError(null);
    setPassword(event.target.value);
  };
  const resetForm = () => {
    setEmail("");
    setPassword("");
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
            .catch(err =>{
              console.log("@fireLogin:", err.code, err.message);
              switch(err.code){
                case "auth/invalid-email":
                case "auth/user-disabled":
                case "auth/user-not-found":
                  setEmailError(err.message);
                  console.log("--wrong email");
                  break;
                case "auth/wrong-password":
                  setPassError("The password is incorrect.");
                  console.log("--wrong pass");
                  break;
                default:
                  break;
              }
            })
    .then(()=>{
            console.log("@fireLogin: Login DONE !");
            setShowAlert(false);
            // resetForm();
          });
  };

  console.log("Email:",email, emailError);
  console.log("Pass:", password, passError);
  return (
    <div className="loginMainSpace">
      <div style={{ height: "100px" }}>
        <CustomAlert
          variant="danger"
          alertMessage={errorMsg}
          setShow={setShowAlert}
          show={showAlert}
        />
      </div>
      <Form ref={formRef} onSubmit={onSubmitHandler}>
        <Form.Group
          controlId="formBasicEmail"
          className="group"
          onChange={onEmailChange}
        >
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          {emailError && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>
                {emailError}
              </span>
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group
          controlId="formBasicPassword"
          className="group"
          onChange={onPasswordChange}
        >
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
          {passError && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>
                {passError}
              </span>
            </Form.Text>
          )}
        </Form.Group>

        <div className="action_group">
          <Button className="action" variant="primary" type="submit">
            Login
          </Button>
          <p className="mb-3"><Link to="/forgotpassword" className="registerLink" style={{color:"rgb(0,123,255)"}}>Forgot Password ?</Link></p>
          {/* <p>New user ? <Link to="/Register" className="registerLink">Register</Link> </p> */}
          <p>New user ? <Button  variant="outline-primary" onClick={()=>history.push('/Register')}>Register</Button> </p>
          {/* <Button variant="primary" href="/Register">
            Register
          </Button> */}
        </div>
      </Form>
    </div>
  );
};

export default LoginForm;


import React, {  useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

import CustomAlert from "../components/Alert";
//firebase
import { auth } from "./fireAuth";

import "./LoginForm.css";

const ForgotPassword = () => {
  
  const formRef = useRef();

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] =useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showAlertError, setShowAlertError] = useState(false);

  const [successMsg, setSuccessMsg] = useState(null);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);

  const onEmailChange = (event) => {
    setEmailError(null);
    resetForm();
    setEmail(event.target.value);
  };
  const resetForm = () => {
    setEmail(null);
    setErrorMsg(null);
    setSuccessMsg(null);
    setShowAlertError(false);
    setShowAlertSuccess(false);
  };

  const handleSubmit = (event) =>{
		event.preventDefault();
		auth
			.sendPasswordResetEmail(email)
			.then(()=>{
				setSuccessMsg('Check your inbox further instructions !');
        setShowAlertSuccess(true);
        console.log('successs');
			})
			.catch(err => {
				console.log("error-",err.code, err.message);
				setEmailError(err.message);
				setErrorMsg("Failed to reset password");
        setShowAlertError(true);
			})
	};

  console.log("Email:",email, emailError);
  return (
    <div className="loginMainSpace">
      <div style={{ height: "100px" }}>
       
        <CustomAlert
          variant="danger"
          alertMessage={errorMsg}
          setShow={setShowAlertError}
          show={showAlertError}
        />
        <CustomAlert
          variant="success"
          alertMessage={successMsg}
          setShow={setShowAlertSuccess}
          show={showAlertSuccess}
        />
        
      </div>
      <Form ref={formRef} onSubmit={handleSubmit}>
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


        <div className="action_group">
          <Button className="action" variant="primary" type="submit">
            Reset Password
          </Button>
          <p><Link to="/Login" style={{color:"rgb(0,123,255)"}} className="registerLink">Login</Link></p>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;


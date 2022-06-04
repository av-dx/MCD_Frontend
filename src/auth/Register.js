import React, { useRef, useState, useContext } from "react";
import { useHistory } from "react-router";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "./Register.css";
// import CustomAlert from "../components/Alert";

//firebase
import { auth } from "./fireAuth";
import { AuthContext } from "../store/AuthProvider";

const Register = ({ setShowAlert }) => {
  // firebase
  // auth.signOut();
  const { userState, _ } = useContext(AuthContext);
  const [user, setUser] = userState;

  const [email, setEmail] = useState();
  const [pass, setPass] = useState();
  const [pass2, setPass2] = useState();
  const [firstname, setFirstname] = useState();
  const [lastname, setLastname] = useState();
  // const [showAlert, setShowAlert] = useState(false);

  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [errorPass2, setErrorPass2] = useState(false);
  const [errorFirstname, setErrorFirstname] = useState(false);
  const [errorLastname, setErrorLastname] = useState(false);

  const [duplicateEmailFlag, setDuplicateEmailFlag] = useState(false);

  const [fireErrorEmail, setFireErrorEmail] = useState(null);
  const [fireErrorPass, setFireErrorPass] = useState(null);

  const formRef = useRef(null);
  const history = useHistory();

  const handleReset = () => {
    setEmail("");
    setFirstname("");
    setPass("");
    setPass2("");
    setLastname("");
    formRef.current.reset();
  };

  const Echange = (e) => {
    setErrorEmail(false);
    setDuplicateEmailFlag(false);
    setEmail(e.target.value);
  };

  const Fchange = (e) => {
    setErrorFirstname(false);
    setFirstname(e.target.value);
  };
  const Lchange = (e) => {
    setErrorLastname(false);
    setLastname(e.target.value);
  };
  const Pchange = (e) => {
    setErrorPass(false);
    setPass(e.target.value);
  };
  const Pchange2 = (e) => {
    if (pass && pass !== e.target.value) {
      setErrorPass2(true);
    } else if (pass && pass === e.target.value) {
      setErrorPass2(false);
    }
    setPass2(e.target.value);
  };

  const formValidation = () => {
    let flag = true;
    if (!firstname) {
      setErrorFirstname(true);
      flag = false;
    }
    if (!lastname) {
      setErrorLastname(true);
      flag = false;
    }
    if (!email) {
      setErrorEmail(true);
      setFireErrorEmail(null);
      flag = false;
    }
    if (!pass) {
      setErrorPass(true);
      setFireErrorPass(null);
      flag = false;
    }
    if (!pass2 && pass !== pass2) {
      setErrorPass2(true);
      flag = false;
    }

    return flag;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formValidation()) {
      console.log("form valudation success !!!");
      const postObj = {
        method: "POST",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstname,
          last_name: lastname,
          email: email,
          // password: pass,
          // password2: pass2,
        }),
      };
      const getResponse = async () => {
        const response = await fetch(
          `${process.env.REACT_APP_API}/user`,
          postObj
        );
        const data = await response.json();
        console.log(data);
      };
      auth
        .createUserWithEmailAndPassword(email, pass)
        .catch((err) => {
          switch (err.code) {
            case "auth/email-already-in-use":
            case "auth/invalid-email":
              setFireErrorEmail(err.message);
              break;
            case "auth/weak-password":
              setFireErrorPass(err.message);
              break;
            default:
              break;
          }
        })
        .then(() => {
          getResponse();
        });
    }
  };

  console.log("@register: user=", user);
  if (user) {
    setShowAlert(true);
    history.push("/");
  }

  return (
    <div className="registerMainSpace">
      {/* <div style={{height:"150px"}}>
      <CustomAlert show={showAlert} setShow={setShowAlert} alertMessage="Successfully registered. Please login." variant="success" forLogin={true}/>
      </div> */}
      <Form
        className="registerForm"
        ref={formRef}
        // style={{ marginRight: "35%", marginLeft: "35%", marginTop: "10%" }}
        onSubmit={handleSubmit}
      >
        <Form.Group controlId="formFname">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="First Name"
            onChange={Fchange}
          />
          {errorFirstname && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>
                Please enter your first name.
              </span>
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formLname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Last Name"
            onChange={Lchange}
          />
          {errorLastname && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>Please enter your last name.</span>
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            onChange={Echange}
          />
          {errorEmail && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>
                Please enter valid email address.
              </span>
            </Form.Text>
          )}
          {fireErrorEmail && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>{fireErrorEmail}</span>
            </Form.Text>
          )}
          {duplicateEmailFlag && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>
                This email is already registered.
              </span>
            </Form.Text>
          )}
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            onChange={Pchange}
          />
          {errorPass && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>
                Please enter non-empty password.
              </span>
            </Form.Text>
          )}
          {fireErrorPass && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>{fireErrorPass}</span>
            </Form.Text>
          )}
        </Form.Group>
        <Form.Group controlId="formBasicPassword2">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-enter Password"
            onChange={Pchange2}
          />
          {errorPass2 && (
            <Form.Text className="text-muted">
              <span style={{ color: "red" }}>Passwords don't match.</span>
            </Form.Text>
          )}
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Register;

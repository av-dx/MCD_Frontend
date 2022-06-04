import React,{useState} from 'react';

import {Button, Alert, Row, Form} from "react-bootstrap";

import { auth } from '../../auth/fireAuth';
import "../css/components.css";

const ChangePassword =()=>{
	
	const [pass, setPass] =useState('');
	const [pass2, setPass2] =useState('');

	const [error, setError] =useState('');
	const [success, setSuccess] =useState(false);
	
	const [errorPass, setErrorPass] =useState('');
	const [errorPass2, setErrorPass2] =useState('');

	const [buttonActive, setButtonActive] =useState(false);

	const saveNewPassword =()=>{
		console.log('new pass:',pass, pass2);
		auth.currentUser.updatePassword(pass)
			.then(()=>{
				setSuccess(true);
			})
			.catch(error =>{
				setError(error.message);
			})
	}

	const changePass2=(e)=>{
		if (pass && pass !== e.target.value) {
      setErrorPass2(true);
    } else if (pass && pass === e.target.value) {
      setErrorPass2(false);
    }
    setPass2(e.target.value);
  };

	return (
		<Form>
			{error && <Alert onClose={()=>setError('')} variant="danger" dismissible>{error}</Alert>}
			{success && <Alert onClose={()=>setSuccess(false)} variant="success" dismissible>Password has been changed !</Alert>}

		  <Form.Group className="mb-3" controlId="password">
				<Form.Label>New Password</Form.Label>
				<Form.Control
					size="sm"
					type="password"
					value={pass}
					onChange={(e) =>{
						setPass(e.target.value);
						if(e.target.value==='')
							setErrorPass2(false);
					}}
				/>
		  </Form.Group>
	
		  <Form.Group className="mb-3" controlId="confirmPassword">
				<Form.Label>Confirm Password</Form.Label>
				<Form.Control
					size="sm"
					type="password"
					value={pass2}
					onChange={(e) => {
						changePass2(e);
					}}
				/>
				{errorPass2 && (
					<Form.Text className="text-muted">
						<span style={{ color: "red" }}>Passwords don't match.</span>
					</Form.Text>
				)}
		  </Form.Group>
	
		  <Row>
				<Button
					className="ml-auto"
					variant="primary"
					disabled={pass2==='' || pass!==pass2}
					onClick={() => {
						saveNewPassword();
					}}
				>
					Change Password
				</Button>
		  </Row>

		</Form>
	);
};

export default ChangePassword;
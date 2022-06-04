import React, { useState } from "react";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

import Button from "react-bootstrap/Button";

import "../css/components.css";

const About = ({ profileDetails, ownProfile, authToken }) => {
  console.log("ownProfile", ownProfile, profileDetails);
  if (ownProfile) {
    return <OwnDetails authToken={authToken} profileDetails={profileDetails} />;
  } else {
    return <Details profileDetails={profileDetails} />;
  }
};

export default About;

const OwnDetails = ({ profileDetails, authToken }) => {
  const [fname, setFname] = useState(profileDetails.first_name);
  const [lname, setLname] = useState(profileDetails.last_name);
  const [description, setDescription] = useState(profileDetails.description);

  const updateUserInfo = () => {
    const putObj = {
      method: "PUT",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        first_name: fname,
        last_name: lname,
        description: description,
      }),
    };
    const updateInfo = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API}/user/${profileDetails._id}?auth_token=${authToken}/`,
        putObj
      );
      const data = await response.json();
      console.log("update response", data);
    };
    updateInfo();
    window.location.reload();
  };

  return (
    <Form>
      <Row className="mb-3">
        <Form.Group as={Col} controlId="firstname">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            size="md"
            value={fname}
            onChange={(e) => {
              setFname(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="lastname">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            size="md"
            value={lname}
            onChange={(e) => {
              setLname(e.target.value);
            }}
          />
        </Form.Group>
      </Row>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          size="md"
          type="email"
          defaultValue={profileDetails.email}
          readOnly
        />
      </Form.Group>

      <Form.Group className="mb-3" controlId="email">
        <Form.Label>About</Form.Label>
        <Form.Control
          size="md"
          as="textarea"
          placeholder="Coming Soon..."
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
      </Form.Group>

      <Row>
        <Button
          size="md"
          className="ml-auto"
          variant="primary"
          onClick={() => {
            updateUserInfo();
          }}
        >
          Modify
        </Button>
      </Row>
    </Form>
  );
};

const Details = ({ profileDetails }) => (
  <Form>
    <Row className="mb-1">
      <Form.Group as={Col} controlId="firstname">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          size="sm"
          value={profileDetails.first_name}
          plaintext
          readOnly
          style={{ color: "rgb(0,123,255)", fontSize: "130%", padding: "0" }}
        />
      </Form.Group>

      <Form.Group as={Col} controlId="lastname">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          size="sm"
          value={profileDetails.last_name}
          plaintext
          readOnly
          style={{ color: "rgb(0,123,255)", fontSize: "130%", padding: "0" }}
        />
      </Form.Group>
    </Row>

    <Form.Group className="mb-3" controlId="email">
      <Form.Label>Email address</Form.Label>
      <Form.Control
        size="sm"
        type="email"
        value={profileDetails.email}
        plaintext
        readOnly
        style={{ color: "rgb(0,123,255)", fontSize: "130%" }}
      />
    </Form.Group>

    <Form.Group className="mb-3" controlId="about">
      <Form.Label>About</Form.Label>
      <Form.Control
        size="sm"
        as="textarea"
        placeholder="Coming Soon..."
        value={profileDetails.description}
        plaintext
        readOnly
        style={{ fontSize: "130%" }}
      />
    </Form.Group>
  </Form>
);

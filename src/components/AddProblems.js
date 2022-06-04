import React, { useEffect, useState, useContext, useRef } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import CustomAlert from "../components/Alert";

import CreatableSelect from "react-select/creatable";
import { AuthContext } from "../store/AuthProvider";

import "./css/components.css";

function AddProblem() {
  const { userState, _ } = useContext(AuthContext);
  const [userAuthToken, setUserAuthToken] = userState;
  const [globalInfo, setGlobalInfo] = useState({ tags: [], langs: [] });
  // const [validated, setValidated] = useState(false);

  const [taskName, setTaskName] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [taskDetails, setTaskDetails] = useState("");
  const [tags, setTags] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  const [taskAccessType, setTaskAccessType] = useState("global-view");

  const accessTypes = [
    { name: "Shared", value: "global-view" },
    { name: "Exclusive", value: "single-view" },
  ];

  const [errorTaskName, setErrorTaskName] = useState(false);
  const [errorTaskDescription, setErrorTaskDescription] = useState(false);
  const [errorSelectedFile, setErrorSelectedFile] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [msg, setMsg] = useState("");
  const [dispError, setDispError] = useState(false);

  const formRef = useRef(null);
  const creatableSelectRef = useRef(null);

  const handleReset = () => {
    formRef.current.reset();
    setTaskName("");
    setTaskDescription("");
    setTaskDetails("");
    setTags([]);
    setSelectedFile(null);
    setTaskAccessType("global-view");
  };

  useEffect(() => {
    const getTasksTagsList = async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/task/tags/`);
      const data = await response.json();
      setGlobalInfo({ tags: data.response.tags, langs: data.response.langs });
    };
    getTasksTagsList();
  }, []);

  const onNameChange = (event) => {
    setErrorTaskName(false);
    setTaskName(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setErrorTaskDescription(false);
    setTaskDescription(event.target.value);
  };

  const onDetailChange = (event) => {
    setTaskDetails(event.target.value);
  };

  const onTagsChange = (newValue, actionMeta) => {
    let tagList = [];
    for (let [key, value] of Object.entries(newValue)) {
      tagList.push(value["value"]);
    }
    setTags(tagList);
  };

  const onFileChange = (event) => {
    setErrorSelectedFile(false);
    setSelectedFile(event.target.files[0]);
  };

  const formValidation = () => {
    let flag = true;
    // return flag;
    if (!taskName) {
      setErrorTaskName(true);
      flag = false;
    }
    if (!taskDescription) {
      setErrorTaskDescription(true);
      flag = false;
    }
    console.log("file vlidation log", selectedFile);
    if (!selectedFile) {
      setErrorSelectedFile(true);
      flag = false;
    }
    return flag;
  };

  const handleSubmit = (event) => {
    console.log("checking form entries...");
    event.preventDefault();
    if (formValidation()) {
      console.log("form validated successfully !!");
      event.preventDefault();
      console.log(selectedFile);

      console.log("uploading the files....");
      const getResponse = async () => {
        const data = new FormData();
        data.append("file", selectedFile);
        data.append("name", taskName);
        data.append("short_description", taskDescription);
        data.append("details", taskDetails);
        data.append("tags", tags);
        data.append("access_type", taskAccessType);

        const fURL = `${process.env.REACT_APP_API}/task/genric?auth_token=${userAuthToken}/`;
        const response = await fetch(fURL, {
          method: "POST",
          body: data,
        });
        const responseData = await response.json();
        if (Object.keys(responseData).includes("error")) {
          setMsg(responseData["error"]);
          setShowAlert(true);
          setDispError(true);
        } else if (
          Object.keys(responseData).includes("status") &&
          responseData.status === "success"
        ) {
          const totalQuestions =
            responseData.valid_question_count +
            responseData.invalid_question_count;
          setMsg(
            `successfully created task with ${responseData.valid_question_count} valid questions out of total ${totalQuestions} questions.`
          );
          setDispError(false);
          setShowAlert(true);
          handleReset();
        }
        console.log("file upload response", responseData);
      };
      getResponse();
    }
  };

  const col1=3;
  const col2=4;

  return (
    <div className="createProblemMainSpace">
      <div style={{ height: "150px" }}>
        <CustomAlert
          show={showAlert}
          setShow={setShowAlert}
          alertMessage={msg}
          variant={dispError ? "danger" : "success"}
        />
      </div>

      <Form onSubmit={handleSubmit} ref={formRef}>

        <Form.Group as={Row} className="mb-3 d-flex justify-content-center">
          <Form.Label column sm={col1}>Name</Form.Label>
          <Col sm={col2}>
            <Form.Control
              type="text"
              placeholder="Task name"
              onChange={onNameChange}
            />
            {errorTaskName && (
              <Form.Text className="text-muted">
                <span style={{ color: "red" }}>Please enter task name.</span>
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3 d-flex justify-content-center">
          <Form.Label column sm={col1}>Description</Form.Label>
          <Col sm={col2}>
            <Form.Control
              type="text"
              placeholder="Short description"
              onChange={onDescriptionChange}
            />
            {errorTaskDescription && (
              <Form.Text className="text-muted">
                <span style={{ color: "red" }}>
                  Please enter short description.
                </span>
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3 d-flex justify-content-center">
          <Form.Label column sm={col1}>Task details</Form.Label>
          <Col sm={col2}>
            <Form.Control
              as="textarea"
              type="text"
              placeholder="Detailed description"
              onChange={onDetailChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3 d-flex justify-content-center">
          <Form.Label column sm={col1}>Question availability</Form.Label>
          <Col sm={col2}>
            <ButtonGroup>
              {accessTypes.map((access, idx) => (
                <ToggleButton
                  key={idx}
                  id={`access-${idx}`}
                  type="radio"
                  variant="outline-secondary"
                  name="radio"
                  value={access.value}
                  checked={taskAccessType === access.value}
                  onChange={(e) => setTaskAccessType(e.currentTarget.value)}
                >
                  {access.name}
                </ToggleButton>
              ))}
            </ButtonGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3 d-flex justify-content-center">
          <Form.Label column sm={col1}>Tags</Form.Label>
          <Col sm={col2}>
            <CreatableSelect
              ref={creatableSelectRef}
              isMulti
              onChange={onTagsChange}
              options={globalInfo.tags.map((singleTag) => {
                return { label: singleTag, value: singleTag };
              })}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3 d-flex justify-content-center">
          <Form.Label column sm={col1}>Question file</Form.Label>
          <Col sm={col2}>
            <Form.Control
              type="file"
              placeholder="question xls file"
              onChange={onFileChange}
            />
            {errorSelectedFile && (
              <Form.Text className="text-muted">
                <span style={{ color: "red" }}>
                  Please select a question file.
                </span>
              </Form.Text>
            )}
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3 d-flex justify-content-center">
          <Button type="submit" style={{ width: "150px" }}>
            Create Task
          </Button>
        </Form.Group>
      </Form>
    </div>
  );
}

export default AddProblem;

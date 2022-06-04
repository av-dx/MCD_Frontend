import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

import { AuthContext } from "../store/AuthProvider";

import Loading from "./Loading";

import { TaskOverview, TaskDescription } from "./SessionsUtils";
import { ExclusiveSessionsList, SessionsList } from "./SessionsListings";

import "./css/components.css";

const Sessions = (props) => {
  const { userState, _ } = useContext(AuthContext);
  const [userAuthToken, setUserAuthToken] = userState;

  const [taskDetails, setTaskDetails] = useState({});

  const [quanta, setQuanta] = useState(20);
  const taskId = props.match.params.taskId;

  // new states
  const [taskType, setTaskType]=useState('');

  useEffect(() => {
    const getSessionDetails = async () => {
      let taskUri = `${process.env.REACT_APP_API}/task/${taskId}/`;
      if (userAuthToken) {
        taskUri = `${taskUri}?auth_token=${userAuthToken}&session_length=${quanta}`;
      } else {
        taskUri = `${taskUri}?session_length=${quanta}`;
      }
      console.log(taskUri);
      const response = await fetch(taskUri);
      const data = await response.json();
      console.log("data", data);
      setTaskType(data.response.access_type);
      if(data.response.access_type==='single-view' && quanta>data.response.max_question_count){
        let num=data.response.max_question_count;
        if(data.response.single_view_stats['unassigned']<data.response.max_question_count){
          num=data.response.single_view_stats['unassigned'];
        }
        setQuanta(parseInt(num/2));
      }
      setTaskDetails(data.response);
    };
    getSessionDetails();
  }, [quanta, taskId]);

  const requestNewQuestions =async()=>{
    const postObj = {
      method: "POST",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    };
    let taskUri = `${process.env.REACT_APP_API}/task/${taskId}/request_questions?auth_token=${userAuthToken}&session_length=${quanta}/`;
    const response = await fetch(taskUri, postObj);
    const data = await response.json();
    console.log("requestNewQuestions.data", data);
    let newTaskDetails ={...taskDetails};
    newTaskDetails.session_progress=data.response.session_progress;
    newTaskDetails.single_view_stats=data.response.single_view_stats;
    setTaskDetails(newTaskDetails);
  };

  const updateQuestionStats=async()=>{
    let taskUri= `${process.env.REACT_APP_API}/task/${taskId}/single_view_stats/`;
    const response = await fetch(taskUri);
    const data = await response.json();
    console.log("updateQuestionStats.data", data);
    let newTaskDetails ={...taskDetails};
    newTaskDetails.single_view_stats=data;

    if(taskDetails.access_type==='single-view' && quanta>taskDetails.max_question_count){
      let num=taskDetails.max_question_count;
      if(data['unassigned']<taskDetails.max_question_count){
        num=data['unassigned'];
      }
      setQuanta(parseInt(num/2));
    }
    
    setTaskDetails(newTaskDetails);
  };

  if (Object.keys(taskDetails).includes("error")) {
    return <Loading message={taskDetails.error} />;
  } else if (Object.keys(taskDetails).length < 13) {
    // hack while loading the questions
    return <Loading />;
  }

  console.log("task details", taskDetails);
  return (
    <div className="mainSpace">
      <div className="breadCrumbs">
        <Link to="/">
          <span className="spChar">H</span>ome
        </Link>
        <span className="spChar spaceAround">/</span>
        <span className="spChar">{taskDetails.name.charAt(0)}</span>
        {taskDetails.name.slice(1)}
      </div>

      <Tab.Container id="left-tabs" defaultActiveKey="first">
        <Row style={{ fontSize: "110%" }}>
          <Col sm={4} className="cursorPointer">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Overview</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Description</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Start Task</Nav.Link>
              </Nav.Item>
              <Nav.Item style={{ marginTop: "2em" }}>
                <Link
                  to="#"
                  onClick={() => {
                    props.history.goBack();
                  }}
                >
                  <Nav.Link href="#/">Back</Nav.Link>
                </Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <TaskOverview taskDetails={taskDetails} />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <TaskDescription taskDetails={taskDetails} />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                {taskType==='single-view' &&
                  <ExclusiveSessionsList 
                    stats={taskDetails.single_view_stats}
                    lowerBound={taskDetails.min_question_count}
                    upperBound={taskDetails.max_question_count}
                    taskId={taskDetails._id}
                    quanta={quanta}
                    setQuanta={setQuanta}
                    questionTypeMapping={taskDetails.mapping}
                    sessionsProgress={taskDetails.session_progress}
                    requestNewQuestions={requestNewQuestions}
                    updateQuestionStats={updateQuestionStats}
                  />
                }
                {taskType==='global-view' &&
                  <SessionsList
                    taskId={taskDetails._id}
                    quanta={quanta}
                    setQuanta={setQuanta}
                    questionTypeMapping={taskDetails.mapping}
                    sessionsProgress={taskDetails.session_progress}
                  />
                }
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Sessions;

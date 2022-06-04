import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";

import Button from "react-bootstrap/Button";
import {Row, Col, Tab, Nav} from "react-bootstrap";

import { FaCheckSquare } from "react-icons/fa";

import QueAns from "./QueAns";
import Loading from "./Loading";
import QuestionRelease from "./QuestionRelease";

import { AuthContext } from "../store/AuthProvider";

import "./css/components.css";

const Questions = (props) => {
  //using user context
  const { _, userState } = useContext(AuthContext);
  const [userAuthToken, setUserAuthToken] = userState;
  // change below to make question quanta variable
  const snum = props.match.params.snum;
  const quanta = props.match.params.quanta;
  const questionType = props.match.params.questionType;
  const sessionIndex = Number(snum);
  const sessionStart = 1 + quanta * snum;
  const sessionEnd = sessionStart + (quanta - 1);

  const taskId = props.match.params.taskId;
  const sessionNum = parseInt(props.match.params.snum) + 1;

  const [questionsMap, setQuestionsMap] = useState({});
  const [questions, setQuestions] = useState([]);
  const [taskName, setTaskName] = useState("");

  const [mssg, setMssg] = useState("Loading...");

  // console.log("Q", questions, questions.length);

  // Question Release Interface modal variables
  const [showReleaseInterface, setShowReleaseInterface]=useState(false);

  // Utility functions
  const updateData = (data) => {
    if (Object.keys(data).includes("error")) {
      setMssg(data.error);
      setQuestions([]);
    }
    else if(data.status!='success'){
      setMssg(data.response);
      setQuestions([]);
    } 
    else {
      setQuestionsMap(data.response.questions);
      setQuestions(Object.values(data.response.questions));
      setTaskName(data.response.task_name);
      
      // if(data.response.questions_count){
      //   window.location.reload();
      //   console.log('data.qCount', data.response.questions_count);
      // }
    }
  };

  useEffect(() => {
    const getQDetails = async () => {
      let qURL = "";
      if (questionType === "single-view") {
        qURL = `${process.env.REACT_APP_API}/task/${props.match.params.taskId}/single_view_questions?session_index=${sessionIndex}&auth_token=${userAuthToken}/`;
      } else {
        qURL = `${process.env.REACT_APP_API}/task/${props.match.params.taskId}/questions?start_index=${sessionStart}&end_index=${sessionEnd}&auth_token=${userAuthToken}&question_type=${questionType}/`;
      }
      console.log("question url:", qURL);
      const response = await fetch(qURL);
      const data = await response.json();
      updateData(data);
    };
    getQDetails();
  }, []);

  const releaseQuestions=async (qids, setSelectedQuestions)=>{
    console.log('selected ques:',qids, typeof(qids));
    const postObj = {
      method: "POST",
      cache: "no-cache",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({'question_ids':qids})
    };
    let qURL = `${process.env.REACT_APP_API}/task/${props.match.params.taskId}/bulk_question_release?auth_token=${userAuthToken}/`;
    console.log('qURL:', qURL);
    const response =await fetch(qURL, postObj);
    console.log("response:", response);
    const data = await response.json();
    console.log('data', data);
    updateData(data);

    setSelectedQuestions([]);
    setShowReleaseInterface(false);
    // window.location.reload();
  }

  console.log('questions:', questions);
  if (questions.length === 0) {
    return <Loading message={mssg} />;
  }
  return (
    <div className="mainSpace">
      <QuestionRelease show={showReleaseInterface} 
          onHide={()=>setShowReleaseInterface(false)}
          questions={questions} releaseQuestions={releaseQuestions}
      />

      <div className="breadCrumbs">
        {console.log('Qs:',questions)}
        <Link to="/">
          <span className="spChar">H</span>ome
        </Link>
        <span className="spChar spaceAround">/</span>
        <Link to={`/task=${taskId}`}>
          <span className="spChar">{taskName.slice(0, 1)}</span>
          {taskName.slice(1)}
        </Link>
        <span className="spChar spaceAround">/</span>
        <span className="spChar">S</span>ession{" "}
        <span className="spChar">{sessionNum}</span>
      </div>

      <Tab.Container id="left-tabs" defaultActiveKey="0">
        <Row className="mainContent flexRowWrap centerContent">
          <Col sm={3} style={{minWidth:'250px'}}>
            <Nav variant="pills" className="flex-column cursorPointer enableScroll" 
                    style={{maxHeight:'50vh'}}>
              {questions.map((question, index) => (
                <QueItem
                  key={index}
                  
                  done={question.annotation_done}
                  index={index}
                />
              ))}
            </Nav>

            {questionType==='single-view'&&
              <div className="submitBtn">
              <Button variant="outline-danger" 
                          onClick={e=>{
                            e.preventDefault();
                            console.log('remove questions');
                            setShowReleaseInterface(true);
                          }}
                >
                <span className="releaseBtn">Release Questions</span> 
              </Button>
              </div>
            }
            
            <div style={{marginTop:"1em"}}>
              <Link
                to="#"
                onClick={e => {
                  e.preventDefault();
                  props.history.goBack();
                }}
              >
                Back
              </Link>
            </div>
            
            
          </Col>
          <Col sm={8}>
            <Tab.Content>
              {questions.map((question, index) => (
                <QueAns
                  key={index}
                  index={index}
                  taskId={taskId}
                  question={question}
                  questionsMap={questionsMap}
                  setQuestionsMap={setQuestionsMap}
                />
              ))}
              <QueAns
                  key={questions.length}
                  index={questions.length}
                  taskId='0'
                  question={{question_prompt: "<span font={{color:'red'}}>Question is deleted</span>"}}
                  questionsMap={questionsMap}
                  setQuestionsMap={setQuestionsMap}
                />
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

const QueItem = ({ done, index }) => (
  <Nav.Item>
    <Nav.Link eventKey={index}>
      <div className="QNum">
        Q. {parseInt(index) + 1}
        {done && <FaCheckSquare size={28} />}
      </div>
    </Nav.Link>
  </Nav.Item>
);

export default Questions;


// Archived

/* {questionType==='single-view' && !done &&
          <OverlayTrigger
            placement='top'
            overlay={
              <Tooltip id={`releaseQuestionTooltip`}>
                Release Question ?
              </Tooltip>
            }
          >
            <Button size='sm' variant='danger' style={{fontWeight:'bolder'}}
                        onClick={()=>releaseQuestion(qid)}
              >
              X
            </Button>
          </OverlayTrigger>
} */
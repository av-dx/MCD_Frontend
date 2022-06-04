import React, {useState, useContext} from "react";
import { Link } from "react-router-dom";

import Card from "react-bootstrap/Card";
import Accordion from "react-bootstrap/Accordion";
import AccordionContext from "react-bootstrap/AccordionContext";
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import ProgressBar from "react-bootstrap/ProgressBar";

import { StatsHeader, RequestModal } from "./SessionsUtils";

//Slider
import Slider from "react-input-slider";

// Icons
import {
  RiCheckboxMultipleBlankLine,
  RiCheckboxMultipleLine,
  RiCheckboxMultipleFill,
} from "react-icons/ri";

import "./css/components.css";
import { Button } from "react-bootstrap";

const CustomToggle = ({ children, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);
  const decoratedOnClick = useAccordionButton(
    eventKey,
    () => callback && callback(eventKey)
  );
  const isCurrentEventKey = currentEventKey.activeEventKey === eventKey;
  return (
    <Card.Header
      active={isCurrentEventKey}
      className="qtypeHeader"
      style={{ color: isCurrentEventKey ? "rgb(0,123,255)" : "black" }}
      onClick={decoratedOnClick}
    >
      {children}
    </Card.Header>
  );
};

const HeaderForOne = ({ sessionsProgress, qtype }) => (
  <>
    <span>{qtype}</span>
    <span>
      Completed: {sessionsProgress[qtype].filter((x) => x == 100).length} /{" "}
      {sessionsProgress[qtype].length} session
    </span>
  </>
);

const HeaderForMultiple = ({ sessionsProgress, qtype }) => (
  <>
    <span>{qtype}</span>
    <span>
      Completed: {sessionsProgress[qtype].filter((x) => x == 100).length} /{" "}
      {sessionsProgress[qtype].length} sessions
    </span>
  </>
);

const SessionsList = ({
  taskId,
  quanta,
  setQuanta,
  questionTypeMapping,
  sessionsProgress,
}) => {
  return (
    <>
      <Accordion defaultActiveKey={1}>
        {Object.keys(sessionsProgress).map((qtype, qindex) => (
          <Card key={qindex}>
            <CustomToggle as={Card.Header} eventKey={qindex + 1}>
              {sessionsProgress[qtype].length === 1 ? (
                <HeaderForOne sessionsProgress={sessionsProgress} qtype={qtype}/>
              ) : (
                <HeaderForMultiple sessionsProgress={sessionsProgress} qtype={qtype}/>
              )}
            </CustomToggle>
            <Accordion.Collapse eventKey={qindex + 1}>
              <div
                className="flexRowWrap spaceEvenly enableScroll"
                style={{ maxHeight: "45vh" }}
              >
                {sessionsProgress[qtype].map((progress, index) => (
                  <Link
                    to={`/task=${taskId}/${questionTypeMapping[qtype]}/${index}.${quanta}`}
                    key={index}
                  >
                    <div className="box session">
                      <div className="smName">
                        <span className="spChar">S</span>ession{" "}
                        <span className="spChar">{index + 1}</span>
                      </div>

                      {progress === 100 ? (
                        <RiCheckboxMultipleFill
                          className="alignCenter"
                          size={42}
                        />
                      ) : (
                        <RiCheckboxMultipleBlankLine
                          className="alignCenter"
                          size={42}
                        />
                      )}

                      <ProgressBar now={progress} label={`${progress}%`} />
                    </div>
                  </Link>
                ))}
              </div>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>

      <div
        style={{
          marginTop: "5px",
          marginRight: "auto",
          marginLeft: "auto",
          textAlign: "center",
        }}
      >
        <Slider
          axis="x"
          xstep={1}
          xmin={1}
          xmax={30}
          x={quanta}
          onChange={(e) => {
            setQuanta(e.x);
          }}
          styles={{ active: { backgroundColor: "rgb(0,123,255)" } }}
          style={{ width: "250px" }}
        />

        <p>
          {quanta === 1 ? (
            <>
              <span className="spChar">1</span> question per session.
            </>
          ) : (
            <>
              <span className="spChar">{quanta}</span> questions per session.
            </>
          )}
        </p>
      </div>
    </>
  );
};

const ExclusiveSessionsList = ({
  stats,
  lowerBound,
  upperBound,

  taskId,
  quanta,
  setQuanta,
  questionTypeMapping,
  sessionsProgress,
  requestNewQuestions,
  updateQuestionStats
}) => {

  console.log('EXsessionsProgress:', sessionsProgress);

  const [modalShow, setModalShow] = React.useState(false);

  const updateStats=()=>{
    updateQuestionStats();
    setModalShow(true);
  }

  return (
    <>
      <RequestModal
        stats={stats}
        show={modalShow}
        onHide={() => setModalShow(false)}
        requestNewQuestions={requestNewQuestions}
        lowerBound ={lowerBound}
        upperBound ={upperBound}
        quanta={quanta}
        setQuanta={setQuanta}
      />

      <StatsHeader stats={stats} />

      <Accordion defaultActiveKey={1}>
        {Object.keys(sessionsProgress).map((qtype, qindex) => (
          <Card key={qindex}>
            <CustomToggle as={Card.Header} eventKey={qindex + 1}>
              {sessionsProgress[qtype].length === 1 ? (
                <HeaderForOne sessionsProgress={sessionsProgress} qtype={qtype}/>
              ) : (
                <HeaderForMultiple sessionsProgress={sessionsProgress} qtype={qtype}/>
              )}
            </CustomToggle>
            <Accordion.Collapse eventKey={qindex + 1}>
              <div
                className="flexRowWrap spaceEvenly enableScroll"
                style={{ maxHeight: "45vh" }}
              >
                {sessionsProgress[qtype].map((progress, index) => (
                  <Link
                    to={`/task=${taskId}/${questionTypeMapping[qtype]}/${index}.${quanta}`}
                    key={index}
                  >
                    <div className="box session">
                      <div className="smName">
                        <span className="spChar">S</span>ession{" "}
                        <span className="spChar">{index + 1}</span>
                      </div>

                      {progress === 100 ? (
                        <RiCheckboxMultipleFill
                          className="alignCenter"
                          size={42}
                        />
                      ) : (
                        <RiCheckboxMultipleBlankLine
                          className="alignCenter"
                          size={42}
                        />
                      )}

                      <ProgressBar now={progress} label={`${progress}%`} />
                    </div>
                  </Link>
                ))}
              </div>
            </Accordion.Collapse>
          </Card>
        ))}
      </Accordion>


      <div className="d-flex mt-2 justify-content-end">
        <Button onClick={updateStats}>
          Request Questions
        </Button>
      </div>

    </>
  );
};


export {ExclusiveSessionsList, SessionsList};
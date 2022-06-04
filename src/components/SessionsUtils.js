import React from "react";
import { OverlayTrigger, Popover, Modal, Button } from "react-bootstrap";

//Slider
import Slider from "react-input-slider";

import "./css/components.css";

const TaskOverview = ({ taskDetails }) => {
  return (
    <div className="taskDetails">
      <h4>Short Details</h4>
      {taskDetails.short_description}
      <p />
      <h4>Languages</h4>
      {taskDetails.languages.join(", ")}
      <p />
      <h4>Tags</h4>
      <div className="flexRowWrap">
        {taskDetails.tags.map((tag, index) => (
          <div key={index} className="tag">
            {tag}
          </div>
        ))}
      </div>
    </div>
  );
};

const TaskDescription = ({ taskDetails }) => {
  return (
    <div className="taskDetails enableScroll">
      <h4>Description</h4>
      <p dangerouslySetInnerHTML={{ __html: taskDetails.details }}></p>
    </div>
  );
};


// Stats
// const popover = ({keyword, stat, r,g,b})=>{
//   let id =`popover${keyword}`;
//   console.log('popover:',keyword, stat)
  
//   return(
//     <Popover id={id}>
//       <Popover.Header as="h3">{stat} {keyword}</Popover.Header>
//       <Popover.Body>
//         Number of {keyword} questions are {stat}.
//       </Popover.Body>
//     </Popover>
//   );
// };

const StatsHeader =({stats}) =>{
  return (
    <div className='statsHeader'>

      <div className="d-flex align-items-center">
        Total Questions: {stats['assigned']+stats['unassigned']}
      </div>

      <div className="d-flex align-items-center allCounts">
        <OverlayTrigger trigger="hover" placement="top" 
          overlay={
            <Popover id='annotated'>
              <Popover.Header as="h3" style={{backgroundColor:'rgba(0, 200, 0, 0.7)', textAlign:"center"}}>
                {stats['annotated']} annotated
              </Popover.Header>
              <Popover.Body>
                Number of annotated questions are {stats['annotated']}
              </Popover.Body>
            </Popover> 
          }>
          <div className="count green">{stats['annotated']}</div> 
        </OverlayTrigger>
        / 
        <OverlayTrigger trigger="hover" placement="top" 
          overlay={
            <Popover id='assigned'>
              <Popover.Header as="h3" style={{backgroundColor:"rgba(0, 123, 255, 0.7)", textAlign:"center"}}>
                {stats['assigned']} assigned
              </Popover.Header>
              <Popover.Body>
                Number of assigned questions are {stats['assigned']}
              </Popover.Body>
            </Popover> 
          }>
          <div className="count blue">{stats['assigned']}</div>
        </OverlayTrigger>
        / 
        <OverlayTrigger trigger="hover" placement="top" 
          overlay={
            <Popover id='unassigned'>
              <Popover.Header as="h3" style={{backgroundColor: "rgba(255, 0, 0, 0.7)", textAlign:"center"}}>
                {stats['unassigned']} unassigned
              </Popover.Header>
              <Popover.Body>
                Number of unassigned questions are {stats['unassigned']}
              </Popover.Body>
            </Popover> 
          }>
          <div className="count red">{stats['unassigned']}</div>
        </OverlayTrigger>    
      </div>
    </div>
  );
};


// Modals

const RequestModal =(props)=>{
  const requestClicked=()=>{
    props.requestNewQuestions();
    props.onHide();
  }

  return (
    <Modal
      {...props}
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="requestQuestions">
          Request Questions
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            xmin={props.lowerBound}
            xmax={Math.min(props.upperBound, props.stats['unassigned'])}
            x={props.quanta}
            onChange={(e) => {
              props.setQuanta(e.x);
            }}
            styles={{ active: { backgroundColor: "rgb(0,123,255)" } }}
            style={{ width: "250px" }}
          />

          <p>
            {props.quanta === 1 ? (
              <>
                Request <span className="spChar">1</span> question in one session.
              </>
            ) : (
              <>
                Request <span className="spChar">{props.quanta}</span> questions in one session.
              </>
            )}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-danger' onClick={props.onHide}>Close</Button>
        <Button variant='outline-primary' onClick={requestClicked}>Request</Button>
      </Modal.Footer>
    </Modal>
  );
};

export {TaskOverview, TaskDescription, StatsHeader, RequestModal};
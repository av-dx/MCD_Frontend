import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
// Bootstrap
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";

// Components
import Score from "./Score";
import About from "./About";
import Activity from "./Activity";
import Progress from "./Progress";
import ChangePassword from "./ChangePassword";
import TaskReport from "./TaskReport";

import Loading from "../Loading";

// Image
import dummy from "../../static/default.jpg";
// Auth
import { AuthContext } from "../../store/AuthProvider";

import "../css/components.css";

const Profile = (props) => {
  // const profileUid=match.params.uid;
  const profileUid = props.match.params.uid;
  const { uidState, userState, _ } = useContext(AuthContext);
  const [uid, setUid] = uidState;
  const [userAuthToken, setUserAuthToken] = userState;

  const [profileDetails, setProfileDetails] = useState({});

  let ownProfile =false;

  useEffect(() => {
    const getProfileDetails = async () => {
      let profileUrl = `${process.env.REACT_APP_API}/user/${profileUid}/`;
      console.log("profileURL:", profileUrl);
      const response = await fetch(profileUrl);
      const data = await response.json();
      console.log(data);
      setProfileDetails(data.response);
    };
    getProfileDetails();
  }, [profileUid]);


  if (Object.keys(profileDetails).includes("error")) {
    return <Loading message={profileDetails.error} />;
  } else if (!Object.keys(profileDetails).includes("_id")) {
    return <Loading />;
  } else {
    ownProfile=profileDetails._id ===uid;
    console.log("1.profile ready!", profileDetails);
    console.log('2.ownProfile:', ownProfile);
  }

  return (
    <div className="mainSpace">
      <div className="profileHeader">
        <div className="quickInfo">
          <img src={dummy} />
          <div className="intro">
            <span style={{ fontSize: "150%" }}>
              <span className="spChar">
                {profileDetails.first_name.charAt(0)}
              </span>
              {profileDetails.first_name.slice(1)}
              <span className="spChar">
                {" "}
                {profileDetails.last_name.charAt(0)}
              </span>
              .
              {/* <span className="spChar"> {profileDetails.last_name.charAt(0)}</span>{profileDetails.last_name.slice(1)} */}
            </span>
            <span>
              <strong>{profileDetails.user_type}</strong> since{" "}
              {profileDetails.date_joined}
            </span>
            <span className="text-muted" style={{ fontSize: "90%" }}>
              {profileDetails._id === uid ? <>active now</> : <>active {profileDetails.last_active}</>}
            </span>
          </div>
        </div>

        <Score annotationScore={profileDetails.annotation_score} />
      </div>

      <Tab.Container id="left-tabs" defaultActiveKey="about">
        <Row style={{ fontSize: "110%" }}>
          <Col sm={4}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="about">About</Nav.Link>
              </Nav.Item>
              {ownProfile &&
                <Nav.Item>
                  <Nav.Link eventKey="pass">Change Password</Nav.Link>
                </Nav.Item>
              }
              <Nav.Item>
                <Nav.Link eventKey="activity">Recent Activity</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="progress">Overall Progress</Nav.Link>
              </Nav.Item>
              { (profileDetails.user_type ==='admin' || profileDetails.user_type ==='problem_setter') ?
                (<Nav.Item>
                  <Nav.Link eventKey="report">Task Report</Nav.Link>
                </Nav.Item>)
                  : 
              <></>
              }
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
              <Tab.Pane eventKey="about">
                {console.log(profileDetails._id, uid)}
                <About
				          authToken={userAuthToken}
                  profileDetails={profileDetails}
                  ownProfile={profileDetails._id === uid}
                />
              </Tab.Pane>
              {ownProfile &&
                <Tab.Pane eventKey="pass">
                  <ChangePassword />
                </Tab.Pane>
              }
              <Tab.Pane eventKey="activity">
                <Activity activity={profileDetails.recent_activity} />
              </Tab.Pane>
              <Tab.Pane eventKey="progress">
                <Progress
                  progressCard={profileDetails.overall_progress}
                />
              </Tab.Pane>
              { (profileDetails.user_type ==='admin' || profileDetails.user_type ==='problem_setter') ?
              (<Tab.Pane eventKey="report">
                <TaskReport />
              </Tab.Pane>)
                :
              <></>
              }
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default Profile;

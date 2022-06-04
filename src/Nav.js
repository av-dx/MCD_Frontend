import { useContext } from "react";
import { Link } from "react-router-dom";

import { Nav, Navbar } from "react-bootstrap";
import Container from "react-bootstrap/Container";


// firebase
import {auth} from "./auth/fireAuth";
import {AuthContext} from "./store/AuthProvider";





const NavBar = () => {
  const {uidState, unameState, _} =useContext(AuthContext);
  const [uid, setUid] =uidState; const [uname, setUname] =unameState;
  
  return (
   
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" style={{padding:'10px 30px'}}>
    
      <Navbar.Brand href="/">MCD</Navbar.Brand>
      
      <Navbar.Toggle aria-controls="mcd-nav" />

      <Navbar.Collapse id="mcd-nav" >{/*className="d-flex justify-content-end">*/}
      
        <Nav className="ms-auto">
          <Link to="/leaderboard">
            <Nav.Link eventKey="1" href="#/leaderboard">
              Leaderboard
            </Nav.Link>
          </Link>
          
          {uname ?(
            <>
              <Link to={`/profile=${uid}`}>
                <Nav.Link eventKey="2" href="#/profile">
                  {uname}
                </Nav.Link>
              </Link>
              <Link to="/">
                <Nav.Link eventKey="3" href="#/logout" onClick={() => {auth.signOut()}}>
                  Logout
                </Nav.Link>
              </Link>
            </>
          ) : (
            <>
              <Nav.Link eventKey="4" href="/login">
                Login
              </Nav.Link>
              <Nav.Link eventKey="5" href="/register">
                Register
              </Nav.Link>
            </>
          )}
        </Nav>

      </Navbar.Collapse>

    </Navbar>
   
  );
  


};

export default NavBar;

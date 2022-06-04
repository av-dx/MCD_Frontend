import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
// Icons
import { BsListTask, BsFillPlusCircleFill } from "react-icons/bs";
import { FaSchool, FaUniversity } from "react-icons/fa";
import { GiModernCity, GiByzantinTemple } from "react-icons/gi";

import { AuthContext } from "../store/AuthProvider";

import "./css/components.css";

const Icon = ({ task }) => {
  const sz = 70;
  if (task === "Cities") {
    return <GiModernCity size={sz} />;
  } else if (task === "Schools") {
    return <FaSchool size={sz} />;
  } else if (task === "Temples") {
    return <GiByzantinTemple size={sz} />;
  } else if (task === "Colleges") {
    return <FaUniversity size={sz} />;
  } else if (task === "addProblems") {
    return <BsFillPlusCircleFill color="green" size={sz} />;
  } else {
    return <BsListTask size={sz} />;
  }
};

const TasksDev = () => {
  // GET the tasks/domains from the backend OR Keep it fixed if only handful of tasks
  const [tasks, setTasks] = useState([]);
  const { _, utypeState } = useContext(AuthContext);
  const [utype, setUtype] = utypeState;
  useEffect(() => {
    const getTasksList = async () => {
      const response = await fetch(`${process.env.REACT_APP_API}/task/`);
      const data = await response.json();
      setTasks(data.response);
    };
    getTasksList();
  }, []);

  return (
    <div className="mainSpace flexRowWrap centerContent">
      {["admin", "problem_setter"].includes(utype) && (
        <Link to={"/addProblems"} key="0">
          <div className="box task addProblems">
            <div className="name">
              <span className="spChar">A</span>dd Problems
            </div>
            <div className="alignCenter">
              <Icon task="addProblems" />
            </div>
          </div>
        </Link>
      )}
      {tasks.map((task) => (
        <Link to={`/task=${task._id}`} key={task._id}>
          <div className="box task">
            <div className="name">
              <span className="spChar">{task.name[0]}</span>
              {task.name.slice(1)}
            </div>
            <div className="alignCenter">
              <Icon task={task.name} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TasksDev;

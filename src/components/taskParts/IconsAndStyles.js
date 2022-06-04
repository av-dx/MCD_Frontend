import styled from 'styled-components';

// Icons
import { FaSchool, FaUniversity } from "react-icons/fa";
import { BsListTask, BsFillPlusCircleFill } from "react-icons/bs";
import { GiModernCity, GiByzantinTemple } from "react-icons/gi";

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
  
// Styled Components
const InactiveChoice =styled.span`
	color: rgba(115, 115, 115, 1);
	background: linear-gradient(to bottom, rgba(115, 115, 115, 0.05), rgba(115, 115, 115, 0.1));
  
	height: fit-content;
	padding: 3px 9px;
	margin-right: 10px;
	margin-bottom: 10px;
	border-radius: 10px;
  
	&:hover {
	  cursor: pointer;
	  // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 1.5px 5px 0 rgba(0, 0, 0, 0.19);
	  background: linear-gradient(to bottom, rgba(115, 115, 115, 0.05), rgba(115, 115, 115, 0.25));
	}
`;
const ActiveChoice =styled.span`
	color:${ props=>props.num%2 ?'rgba(0, 60, 255, 1)' : 'rgba(0,123,255, 1)' };
	background:${ props=>
						props.num%2 
						?'linear-gradient(to bottom, rgba(0, 60, 255, 0.05), rgba(0, 60, 255, 0.1))' 
						: 'linear-gradient(to bottom, rgba(0, 123, 255, 0.05), rgba(0, 123, 255, 0.1))'  
					  };
  
	height: fit-content;
	padding: 3px 9px;
	margin-right: 10px;
	margin-bottom: 10px;
	border-radius: 10px;
  
	&:hover {
	  cursor: pointer;
	  // box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 1.5px 5px 0 rgba(0, 0, 0, 0.19);
	  background:${ props=>props.num%2 
					  ?'linear-gradient(to bottom, rgba(0, 60, 255, 0.05), rgba(0, 60, 255, 0.25))' 
					  : 'linear-gradient(to bottom, rgba(0, 123, 255, 0.05), rgba(0, 123, 255, 0.25))' };
	}
`;
const Extra =styled(ActiveChoice)`
	color: grey;  
	background: none;
  
	padding: 5px;
	margin: 5px;
	border-radius: 10px;
  
	&:hover {
	  cursor: pointer;
	  background: rgb(235, 235, 235);
	}
`;

export {Icon, InactiveChoice, ActiveChoice, Extra};
import React, { useState } from 'react';

import {BiSort} from "react-icons/bi";
import { FaSearch } from "react-icons/fa";

import "./tasks.css";

const TaskHeader=({taskQuery, setTaskQuery, sortOption, setSortOption, tasksLength})=>{

	const [showOptions, setShowOptions]=useState(false);

	return (
		<div className="taskSpaceHeader">
			<div className="innerHeader">
				
				<div className="counts">
						<span style={{fontSize:'120%'}}>Tasks</span>
						<span style={{fontSize:'120%', color:'gray', marginLeft:'10px'}}>{tasksLength}</span>
				</div>

				<div className="tasksSearchArea">
					<FaSearch size={16} color="rgb(0,123,255)" style={{position:'absolute', marginTop:'6px', marginLeft:'10px'}} />
					<input type="text"
							placeholder="Search Tasks"
							value={taskQuery}
							className="tasksSearchBar twopxborder focus:ring-inset"
							onChange={(e)=>setTaskQuery(e.target.value)}
					/>
				</div>
			
				<div className="sortSelect">
					<span className="sortButton" onClick={()=>setShowOptions(!showOptions)}
									style={{border:showOptions?'2px rgb(0,123,255) solid':'2px rgb(240, 240, 240) solid'}}>
						<BiSort size={20} color="rgb(0,123,255)" style={{marginRight:'3px'}}/>
						<span>Sort: {sortOption}</span>
					</span>
					{showOptions &&
						<span className="options">
							<div className="oneOption" onClick={()=>{setSortOption('Alphabetical');setShowOptions(false)}}>Alphabetical</div>
							<div className="oneOption" onClick={()=>{setSortOption('Last Modified');setShowOptions(false)}}>Last Modified</div>
						</span>
					}
				</div>

			</div>
		</div>  
	);
};

export default TaskHeader;
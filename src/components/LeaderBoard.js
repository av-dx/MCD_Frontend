import React, {useContext, useEffect, useState } from 'react';
import { useHistory } from "react-router";

import Table from 'react-bootstrap/Table';

import {FaEllipsisV} from 'react-icons/fa';
import { AuthContext } from '../store/AuthProvider';

const LeaderBoard =()=>{

	const {userState, uidState, _} = useContext(AuthContext);
	const [uid, setUid] =uidState;
	const [userAuthToken, setUserAuthToken] = userState;
	
	const [details, setDetails] =useState([]);
	const [curUser, setCurUser] =useState([]);
	
	useEffect(() => {
		const getSessionDetails =async () => {
			console.log('requesting from', `${process.env.REACT_APP_API}/leaderboard`);
			//let leaderURL = `${process.env.REACT_APP_API}/leaderboard`;
			let leaderURL = '//mcdbackend.indicwikidsp.tk/leaderboard';
			if(userAuthToken){
				leaderURL = `${leaderURL}?auth_token=${userAuthToken}/`;
			}
			const response = await fetch(leaderURL);
			const data = await response.json();
			console.log(data);
			setDetails(data.response);
			setCurUser(data.user_rank);
		};
		getSessionDetails();
   	}, []);

	//Future Scope (per task leaderboard) //other filters
	// const [selectedTask, setSelectedTask] =useState('');
	// const [topCount, setTopCount] =useState(10);
	
	console.log('details', details);
	const history = useHistory();
	return(
		<div className='mainSpace enableScroll'>
			
			<Table striped hover variant="dark" style={{width:'70%', margin:'auto'}}>
				<thead>
					<tr>
						<th>#</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Total Score</th>
					</tr>
				</thead>
				<tbody>
					{details.map(row=>(
						<tr key={row.rank} style={{cursor:'pointer'}}
							onClick={()=>{history.push('/profile='+row.user_id)}}>
							<td>{row.rank}</td>
							<td>{row.first_name}</td>
							<td>{row.last_name}</td>
							<td>{row.final_score}</td>
						</tr>
					))}

					{curUser.length>0 && 
						<>
							<tr key="ellipsis">
								<td></td>
								<td></td>
								<td><FaEllipsisV size={20}/></td>
								<td></td>
							</tr>
							
							<tr key={curUser[0][0]}>
								<td>{curUser[0][0]}</td>
								<td>{curUser[0][1]}</td>
								<td>{curUser[0][2]}</td>
								<td>{curUser[0][4]}</td>
							</tr>
						</>
					}

				</tbody>
			</Table>

		</div>
	);
};

export default LeaderBoard;

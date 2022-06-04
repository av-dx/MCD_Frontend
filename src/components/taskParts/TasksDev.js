import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";

import {Icon} from "./IconsAndStyles";
import TaskHeader from "./TaskHeader";
import {FiltersPane, allinCategory } from "./FiltersPane";

import Loading from '../Loading';
import { AuthContext } from "../../store/AuthProvider";

import "./tasks.css";
import "../css/components.css";

const Tasks = () => {
	const diyfilters ={
		Langugage: ['English', 'Hindi', 'Telugu', 'Tamil', 'Marathi'],
		Multilinguality:['monolingual', 'multilingual', 'translation', 'transliteration'],
		Tags:['Cities', 'Wiki', 'Schools', 'Temples'],
		Author:['Arnold', 'Baburao', 'Chandini', 'Dom', 'Eshwar', 'Fanny', 'Ganesh', 'Harry', 'Ian', 'Jacob', 'Kate', 'Larry', 'Mangesh']
	}
	const [tasks, setTasks] = useState([]);
	const { utypeState } = useContext(AuthContext);
	const [utype, _] = utypeState;

	const [filters, setFilters]=useState({});
	const [fullForm, setFullForm]=useState({});
	const [taskQuery, setTaskQuery] =useState('');
	const [sortOption, setSortOption]=useState('Alphabetical');

	const initialize =rawFilters=>{
		setFullForm(rawFilters);
		let newState ={}
		Object.keys(rawFilters).map(category=>{
			let newChoices={};
			Object.keys(rawFilters[category]).map(choice=>{
				newChoices[choice]=true;
			});
			newState[category]=newChoices
		})
		return newState;
	};

	// Initializing !
	useEffect(() => {
		const getTasksList = async () => {
			const response = await fetch(`${process.env.REACT_APP_API}/task/`);
			const data = await response.json();
			console.log('data:', data);
			setTasks(data.response);
			setFilters(initialize(data.filter));
		};
		getTasksList();
	}, []);


	// UPDATE Tasks based on filters
	const [activeFilters, setActiveFilters] =useState();
	const updateActiveFilters=()=>{
		let newFilters ='';
		let updated = false;
		console.log('updating ActiveFilters:', filters);
		Object.keys(filters).map(category=>{
			if (!allinCategory(true, category, filters)){
				updated=true;
				Object.keys(filters[category]).map(choice=>{
					if (filters[category][choice]){
						newFilters+=category+':'+choice+','
					}
				})
			}
		})
		if (updated){
			newFilters =newFilters.slice(0, -1);
		}
		else{
			newFilters='';	
		}
		setActiveFilters(newFilters);
		return newFilters;
	};

	const getUpdateURL=(newFilters=activeFilters)=>{
		let updateURL =process.env.REACT_APP_API+'/task';
		let paramStart =true;

		if (newFilters){
			paramStart=false;
			updateURL +='?filter='+newFilters.toLowerCase().replace(' ', '_');
		}

		if (taskQuery){
			if (paramStart){
				paramStart=false;
				updateURL+='?search='+taskQuery.toLowerCase().replace(' ', '_');
			}else{
				updateURL+='&search='+taskQuery.toLowerCase().replace(' ', '_');
			}
		}

		if(sortOption){
			if(paramStart){
				paramStart=false;
				updateURL+='?sort='+sortOption.toLowerCase().replace(' ', '_');
			}else{
				updateURL+='&sort='+sortOption.toLowerCase().replace(' ', '_');
			}
		}
		
		return updateURL+'/';
	};
	const getUpdatedTasks = async (newFilters=activeFilters) => {
		let fetchUrl=getUpdateURL(newFilters);
		console.log('fetchUrl:', fetchUrl);
		const response = await fetch(fetchUrl);
		const data = await response.json();
		setTasks(data.response);
	};

	useEffect(()=>{
		let newFilters=updateActiveFilters();
		getUpdatedTasks(newFilters);
	}, [filters]);
	useEffect(()=>{
		getUpdatedTasks();
	}, [taskQuery, sortOption]);


	// Render !!!
	if(Object.keys(filters).length===0){
		return <Loading /> 
	}
	return (
		<div style={{display:"flex", height:"100%"}}>

			<FiltersPane fullForm={fullForm} filters={filters} setFilters={setFilters}/>

			<div className="taskSpace">

				<TaskHeader taskQuery={taskQuery} setTaskQuery={setTaskQuery} 
								sortOption={sortOption} setSortOption={setSortOption} tasksLength={tasks.length}/>
				
				<div className="taskScroll">
				<div className="flexRowWrap justify-content-center tasksList">
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
		 
			</div>
			</div>

		</div>
	);
};

export default Tasks;

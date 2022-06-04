import React, { useState, useEffect } from 'react';

import { Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import { FiArrowLeft } from "react-icons/fi";

import { ActiveChoice, InactiveChoice, Extra } from './IconsAndStyles';

import './tasks.css';

// Helper Functions
const allinCategory=(bool, category, newState)=>{
	let verdict = true;
	Object.keys(newState[category]).map(choice=>{
	  if(newState[category][choice]!==bool){
			verdict =false;
	  }
	})
	return verdict;
}
const setAllinCategory=(bool, category, newState)=>{
	Object.keys(newState[category]).map(choice=>{
	  newState[category][choice]=bool;
	})
	return newState;
}

// Main Auxilary Component
const FiltersPane=({fullForm, filters, setFilters})=>{

  const [query, setQuery]=useState('');
  const [filteredChoices, setFiltered]=useState([]);
  const [oneCategory, setOneCategory]=useState([]);

	useEffect(() =>{
	if (oneCategory.length){
	  setFiltered(Object.keys(filters[oneCategory[0]]).filter(choice=>{
		if (query.length===0 || query.trim()==='') {
		  return choice;
		} else if (choice.toLowerCase().startsWith(query.trim().toLowerCase())) {
		  return choice;
		}
	  }));
	}
  }, [query, oneCategory]);

	const clearCategory=category=>{
		let newState=JSON.parse(JSON.stringify(filters));
		newState=setAllinCategory(true, category, newState);
		setFilters(newState);
	}

	const selectChoice =(category, choice)=>{
		console.log("selectChoice:", category, choice);
		let newState=JSON.parse(JSON.stringify(filters));

		if(allinCategory(true, category, newState)){
			newState=setAllinCategory(false, category, newState);
			newState[category][choice]=true;
		}
		else{
			newState[category][choice]=!newState[category][choice];
			if(allinCategory(false, category, newState)){
			newState=setAllinCategory(true, category, newState);
			}
		}

		setFilters(newState);
	}

	const activeChoices=category=>{
		let activeChoice=[], inactiveChoice=[];
		Object.keys(filters[category]).map(choice=>{
			if(filters[category][choice])
				activeChoice.push(choice);
			else
				inactiveChoice.push(choice);
		})
		return [...activeChoice, ...inactiveChoice];
	}

	return(
		<div className="filterSpace" id="filterSpaceID">

			{oneCategory.length===0 &&
				<div className="innerSpace">
					{Object.keys(filters).map((category, index) =>(
						<div className="eachCategory" key={index}>
							<div style={{marginTop:'20px', marginBottom:'10px'}}>
								<span style={{fontSize:'120%'}}>{category}</span>
								<span className="clearAllBtn" onClick={()=>clearCategory(category)}>Clear All</span>
							</div>  
							<div className="categoryChoices">
								<>
									{activeChoices(category).splice(0,5).map((choice)=>{
										if(filters[category][choice]) {
											return(
												<ActiveChoice key={choice} num={index} active={filters[category][choice]}
													onClick={()=>selectChoice(category, choice)}>
													{fullForm[category][choice]}
												</ActiveChoice>
											)  
										}
										else {
											return (
												<InactiveChoice key={choice} num={index}
													onClick={()=>selectChoice(category, choice)}>
													{fullForm[category][choice]}
												</InactiveChoice>
											)  
										}
									})}
									{Object.keys(filters[category]).length > 4 &&
										<Extra key='extra' onClick={()=>setOneCategory([category, index])}>
											+{Object.keys(filters[category]).length-4}
										</Extra>
									}
								</>
							</div>
						</div>
					))}
				</div>
			}
			{oneCategory.length!==0 &&
				<div className="innerSpace">
					<Button variant="outline-secondary" className="backButton" onClick={()=>setOneCategory([])} 
											style={{display:'flex', alignItems:'center', justifyContent:'space-between', borderRadius:'10px' }}>
						<FiArrowLeft style={{marginRight:'5px', alignSelf:'top'}} size={18}/> All Filters
					</Button>

					<div style={{marginTop:'20px'}}>
						<span style={{fontSize:'120%'}}>{oneCategory[0]}</span>
						<span className="clearAllBtn" onClick={()=>clearCategory(oneCategory[0])}>Clear All</span>
					</div> 
					<div className="filtersSearchArea">
						<FaSearch color="rgb(0,123,255)"  />
						<input type="text"
											placeholder="Search"
											value={query}
											className="filtersSearchbar"
											onChange={(e)=>setQuery(e.target.value)}
						/>
					</div>
				
					<div className="categoryChoices">
						{filteredChoices.map(choice=>{
								if(filters[oneCategory[0]][choice]) {
									return(
										<ActiveChoice key={choice} num={oneCategory[1]}
											onClick={()=>selectChoice(oneCategory[0], choice)}>
											{fullForm[oneCategory[0]][choice]}
										</ActiveChoice>
									)  
								}
								else {
									return (
										<InactiveChoice key={choice} num={oneCategory[1]}
											onClick={()=>selectChoice(oneCategory[0], choice)}>
											{fullForm[oneCategory[0]][choice]}
										</InactiveChoice>
									)  
								}
							})}
					</div>
				
				</div>
			}

		</div>
	);
};

export {FiltersPane, allinCategory};
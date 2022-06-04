import React, { useState, useEffect } from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import Checkbox from "react-custom-checkbox";

import styled from 'styled-components';
import { Row, Col } from 'react-bootstrap';

import {MdRemoveCircle} from "react-icons/md";

import "./css/components.css";

const QList=styled.div` 
	max-height: 50vh;
	overflow-y: auto;
	overflow-x: hidden;
`;  

const QuestionRelease=({show, onHide, questions, releaseQuestions})=>{

	const [selectedQuestions, setSelectedQuestions]=useState([]);

	const handleChange=async (selected, qid)=>{
		let newList =[...selectedQuestions];
		if (selected && !newList.includes(qid)){
			newList.push(qid);
		} else if (!selected && newList.includes(qid)){
			const index =newList.indexOf(qid);
			newList.splice(index, 1);
		}
		setSelectedQuestions(newList);
	};

	return(
		<Modal
			show={show}
			onHide={onHide}

			size="lg"
			centered
			aria-labelledby="image_upload_modal"
		>
			<Modal.Header closeButton>
				<Modal.Title id="Release Questions">
					Select questions to release
				</Modal.Title>
			</Modal.Header>

			<Modal.Body style={{textAlign:'center'}}>
				
				<QList>
				{questions.map((que,index)=>(
					<Row style={{padding:'10px 0px', 
								borderBottom:index+1<questions.length?'1px solid gray':'0px'
					}}>
						<Col xs={2}>
							Q {index+1}
						</Col>

						<Col xs={8}>
							<span dangerouslySetInnerHTML={{ __html: que.question_prompt }}></span>
						</Col>

						<Col xs={2} className="d-flex justify-content-center">
							<Checkbox 
								size={30}
								disabled={que.annotation_done}
								checked={selectedQuestions.includes(que.id)}
								value={selectedQuestions[0]}
								icon={<MdRemoveCircle color="red" size={30}/>}

								onChange={value=>handleChange(value,que.id)}
								
								borderWidth={2}
								borderColor={que.annotation_done?"rgba(150,150,150)":"rgba(255,0,0,0.5)"}
								className="customCheckbox"
								style={{
											backgroundColor:que.annotation_done?"rgba(150,150,150, 0.5)":
												selectedQuestions.includes(que.id)?
													'rgba(255,0,0,0.2)':
													'transparent'
										}}
							/>
						</Col>
					</Row>
				))}
				</QList>

			</Modal.Body>

			<Modal.Footer>
				<Button variant="outline-danger"
					onClick={e=>{
						e.preventDefault();
						releaseQuestions(selectedQuestions,setSelectedQuestions);
					}}>
					Release
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default QuestionRelease;
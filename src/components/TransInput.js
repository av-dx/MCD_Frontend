import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { ReactTransliterate, TriggerKeys } from "react-transliterate";

import './css/components.css';
import 'react-transliterate/dist/index.css';

const TransInput =({lang, text, setText, hidden=false}) =>{
	useEffect(()=>{
		console.log('TransInput Initiated');
	}, [])
	console.log('1text', text);
	return (		
		<>
			<ReactTransliterate
				lang ={lang}
				hidden={hidden}
				value ={text}
				onChange ={(e) => setText(e.target.value)}
				placeholder="Type your answer"
				offsetX ={13}
				containerClassName ='editArea'
				renderComponent={
					(props) => <Form.Control  as="textarea" 
										{...props} style={{fontSize:'90%', height:'8em'}} />
				}
				activeItemStyles={{backgroundColor:'rgb(0,123,255)', fontSize:'110%'}}
				triggerKeys={[TriggerKeys.KEY_ENTER, TriggerKeys.KEY_TAB, TriggerKeys.KEY_RETURN]}
			/>
		</>
	);
}

export default TransInput;
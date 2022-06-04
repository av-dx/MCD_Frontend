import React, { useState } from 'react';

import '../css/components.css';

const Activity=({activity})=>{

	if (activity.length===1){
		return (
			<div className="spChar" style={{textAlign:'center', marginTop:'1.5em'}}>
				No activity yet... 
			</div>
		);
	}
	else{
		return (
			<div style={{textAlign:'center', marginTop:'1.5em'}}>
				<span className="spChar" >Work In Progress</span><br />
				<span className="text-muted">sorry for the delay</span>

			</div>
		);
	}

};

export default Activity;
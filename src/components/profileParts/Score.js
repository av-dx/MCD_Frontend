import React from 'react';

import Tooltip from 'react-bootstrap/Tooltip'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'

// icons 
import {FaCoins} from "react-icons/fa";
import {FiHexagon} from "react-icons/fi";

import "../css/components.css";

const Score =({annotationScore})=>(
	<OverlayTrigger placement="top" 
			overlay={
				<Tooltip>
					<strong>Annotation</strong> score
				</Tooltip>
			}
		>
		<div className="scoreDetails">
			<FiHexagon size={38} color="gold" fill="gold" />
			<span className="ml-1">{annotationScore}</span>
		</div>
	</OverlayTrigger>
);

export default Score;


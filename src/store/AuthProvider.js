import React, { useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = (props) => {
	// data
	const [uid, setUid] =useState(null);
	const [userAuthToken, setUserAuthToken] = useState(null);
	const [uname, setUname] = useState(null);
	const [utype, setUtype] = useState(null);

	// provider
	return (
		<AuthContext.Provider
			value={{
				uidState: [uid, setUid],
				utypeState: [utype, setUtype],
				unameState: [uname, setUname],
				userState: [userAuthToken, setUserAuthToken],
			}}
		>
			{props.children}
		</AuthContext.Provider>
	);
};

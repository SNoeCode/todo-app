
import React, { createContext, useState, useContext, useEffect } from "react";

export const UserContext = createContext(null);
export const UserProvider = ({ children }) => {
//define initail state based on local storage
  const initialUser = {
    //if there is a usernamr in local storafe it get username if no usernamr defaults to null
    username: localStorage.getItem("username") || "",
    token: localStorage.getItem("token") || null,
  };
  //keep track of authuser in state
  const [authedUser, setAuthedUser] = useState(initialUser);
  //whhen compound mounts(loads) it sync state with local storage
    useEffect(() => {
  
    const storedUsername = localStorage.getItem("username") || "";
    const storedToken = localStorage.getItem("token") || null;
    //updates states with loccal storafw
    setAuthedUser({
      username: storedUsername,
      token: storedToken,
    });
  }, []);
  //updates to all child components 
  return (
    <UserContext.Provider value={{ authedUser, setAuthedUser }}>
      {children}
    </UserContext.Provider>
  );
};

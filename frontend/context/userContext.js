import React, {createContext, useEffect, useState, useContext} from 'react';

const userContext = React.createContext();

export const UserContextProvider = ({ children }) => {
    return (
        <userContext.Provider value={"Hello from context"}>
            {children}
        </userContext.Provider>
    )
};

export const useUserContext = () => {
    return useContext(userContext);
}


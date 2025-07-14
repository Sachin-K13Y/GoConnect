
import React, { createContext, useState, useEffect } from 'react';

export const UserDataContext = createContext();

const UserContext = ({ children }) => {
    const [user, setUserState] = useState(() => {
        // Try to load user from localStorage on first render
        const stored = localStorage.getItem('user');
        return stored ? JSON.parse(stored) : {
            email: '',
            fullName: {
                firstName: '',
                lastName: ''
            }
        };
    });

    
    const setUser = (userObj) => {
        setUserState(userObj);
        if (userObj) {
            localStorage.setItem('user', JSON.stringify(userObj));
        } else {
            localStorage.removeItem('user');
        }
    };

    useEffect(() => {
        // If user is empty, try to load from localStorage (for hot reloads)
        if (!user || !user.email) {
            const stored = localStorage.getItem('user');
            if (stored) setUserState(JSON.parse(stored));
        }
    }, []);

    return (
        <div>
            <UserDataContext.Provider value={{ user, setUser }}>
                {children}
            </UserDataContext.Provider>
        </div>
    );
};

export default UserContext;

import { createContext, useState, useEffect } from 'react';

export const DriverDataContext = createContext();

const DriverContext = ({ children }) => {
    const [driver, setDriverState] = useState(() => {
        const stored = localStorage.getItem('driver');
        return stored ? JSON.parse(stored) : null;
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Wrap setDriver to also persist to localStorage
    const setDriver = (driverObj) => {
        setDriverState(driverObj);
        if (driverObj) {
            localStorage.setItem('driver', JSON.stringify(driverObj));
        } else {
            localStorage.removeItem('driver');
        }
    };

    // For hot reloads, try to load from localStorage if driver is null
    useEffect(() => {
        if (!driver) {
            const stored = localStorage.getItem('driver');
            if (stored) setDriverState(JSON.parse(stored));
        }
    }, []);

    const updateDriver = (driverData) => {
        setDriver(driverData);
    };

    const value = {
        driver,
        setDriver,
        isLoading,
        setIsLoading,
        error,
        setError,
        updateDriver
    };

    return (
        <DriverDataContext.Provider value={value}>
            {children}
        </DriverDataContext.Provider>
    );
};

export default DriverContext;
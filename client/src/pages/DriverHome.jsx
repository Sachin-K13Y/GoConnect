import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';

import { DriverDataContext } from '../context/DriverContext';
import { SocketContext } from '../context/socketContext';


import DriverDetails from '../components/DriverDetails';
import RidePopUp from '../components/RidePopUp';
import ConfirmRidePopUp from '../components/ConfirmRidePopUp';
import LiveTracking from './LiveTracking';

const LoadingScreen = () => (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-gray-800">goConnect Driver</h1>
        <p className="mt-2 text-gray-600">Loading your dashboard...</p>
    </div>
);

const DriverHome = () => {
    const { socket } = useContext(SocketContext);
    const { driver, setDriver } = useContext(DriverDataContext);
    const navigate = useNavigate();

    const [ride, setRide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [ridePopupPanel, setRidePopupPanel] = useState(false);
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

    const ridePopupPanelRef = useRef(null);
    const confirmRidePopupPanelRef = useRef(null);

    useEffect(() => {
        const fetchDriverProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/driver-login');
                return;
            }
            if (driver) {
                setIsLoading(false);
                return;
            }
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/drivers/profile`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setDriver(response.data);
            } catch (err) {
                console.error("Failed to fetch driver profile:", err);
                setError('Session expired. Please log in again.');
                handleDriverLogout(navigate);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDriverProfile();
    }, [driver, setDriver, navigate]);

    useEffect(() => {
        if (!driver || !socket) return;

        socket.emit('join', { userId: driver._id, userType: "driver" });

        const handleNewRide = (data) => {
            setRide(data);
            setRidePopupPanel(true);
        };

        socket.on('new-ride', handleNewRide);

        const locationInterval = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    socket.emit('update-location-driver', {
                        userId: driver._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    });
                },
                (error) => console.error("Geolocation error:", error)
            );
        }, 10000);

        return () => {
            socket.off('new-ride', handleNewRide);
            clearInterval(locationInterval);
        };
    }, [driver, socket]);

    const confirmRide = async () => {
        if (!ride || !driver) return;
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/confirm`, {
                rideId: ride._id,
                driver: driver._id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setRidePopupPanel(false);
            setConfirmRidePopupPanel(true);
        } catch (err) {
            console.error("Failed to confirm ride:", err);
        }
    };

    useGSAP(() => {
        gsap.to(ridePopupPanelRef.current, { y: ridePopupPanel ? '0%' : '100%', duration: 0.5, ease: 'power3.inOut' });
    }, [ridePopupPanel]);

    useGSAP(() => {
        gsap.to(confirmRidePopupPanelRef.current, { y: confirmRidePopupPanel ? '0%' : '100%', duration: 0.5, ease: 'power3.inOut' });
    }, [confirmRidePopupPanel]);

    if (isLoading) {
        return <LoadingScreen />;
    }
    
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center text-center p-4">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <div className='h-screen flex flex-col bg-gray-100'>
            <header className='fixed top-0 left-0 w-full bg-white shadow-md p-4 flex items-center justify-between z-20'>
                <h1 className='text-xl font-bold text-gray-800'>goConnect Driver</h1>
                <button 
                    onClick={() => handleDriverLogout(navigate)} 
                    className='h-10 w-10 bg-gray-200 hover:bg-red-500 hover:text-white text-gray-700 flex items-center justify-center rounded-full transition-colors'
                    aria-label="Logout"
                >
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </button>
            </header>

            <main className='flex-grow pt-16 flex flex-col'>
                <div className='h-3/5 w-full'>
                    <LiveTracking />
                </div>
                <div className='h-2/5 p-6 bg-white rounded-t-2xl shadow-inner-top'>
                    {driver ? <DriverDetails /> : <p>Loading driver details...</p>}
                </div>
            </main>
            
            <div ref={ridePopupPanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl p-6'>
                <RidePopUp
                    ride={ride}
                    confirmRide={confirmRide}
                    setRidePopupPanel={setRidePopupPanel}
                />
            </div>
            
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-40 bottom-0 translate-y-full bg-white p-6 flex items-center justify-center'>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                />
            </div>
        </div>
    );
};

export default DriverHome;

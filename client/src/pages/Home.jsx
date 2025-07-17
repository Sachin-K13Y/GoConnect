import React, { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';
import { useNavigate } from 'react-router-dom';

import { SocketContext } from '../context/socketContext';
import { UserDataContext } from '../context/UserContext';

import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import LiveTracking from './LiveTracking';

const Spinner = () => (
    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
);

const LoadingScreen = () => (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-white">
        <h1 className="text-3xl font-bold text-gray-800">goConnect</h1>
        <p className="mt-2 text-gray-600">Loading your experience...</p>
    </div>
);


const Home = () => {
    const { socket } = useContext(SocketContext);
    const { user } = useContext(UserDataContext);
    const navigate = useNavigate();

    const [pickup, setPickup] = useState('');
    const [destination, setDestination] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState('');
    const [fare, setFare] = useState(null);
    const [vehicleType, setVehicleType] = useState(null);
    const [ride, setRide] = useState(null);

    const [panelOpen, setPanelOpen] = useState(false);
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false);
    const [vehicleFound, setVehicleFound] = useState(false);
    const [waitingForDriver, setWaitingForDriver] = useState(false);

    const [isFareLoading, setIsFareLoading] = useState(false);
    const [fareError, setFareError] = useState('');

    const panelRef = useRef(null);
    const panelCloseRef = useRef(null);
    const vehiclePanelRef = useRef(null);
    const confirmRidePanelRef = useRef(null);
    const vehicleFoundRef = useRef(null);
    const waitingForDriverRef = useRef(null);

    useEffect(() => {
        if (!socket || !user?._id) return;

        socket.emit("join", { userType: "user", userId: user._id });

        const handleRideConfirmed = (confirmedRide) => {
            setWaitingForDriver(true);
            setRide(confirmedRide);
        };

        const handleRideStarted = (startedRide) => {
            setWaitingForDriver(false);
            navigate('/riding', { state: { ride: startedRide } });
        };

        socket.on('ride-confirmed', handleRideConfirmed);
        socket.on('ride-started', handleRideStarted);

        return () => {
            socket.off('ride-confirmed', handleRideConfirmed);
            socket.off('ride-started', handleRideStarted);
        };
    }, [socket, user, navigate]);


    const createRide = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/create`, {
                pickup,
                destination,
                vehicleType
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (error) {
            console.error("Failed to create ride:", error);
        }
    };

    const findTrip = async () => {
        if (!pickup || !destination) {
            setFareError("Please enter both pickup and destination.");
            return;
        }
        setIsFareLoading(true);
        setFareError('');

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/get-fare`, {
                params: { pickup, destination },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFare(response.data);
            setVehiclePanel(true);
            setPanelOpen(false);
        } catch (err) {
            setFare(null);
            setFareError("Could not calculate fare. Please try again.");
            console.error("Fare calculation error:", err);
        } finally {
            setIsFareLoading(false);
        }
    };

    const fetchSuggestions = async (input) => {
        if (!input || input.length < 2) {
            setSuggestions([]);
            return;
        }
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/get-suggestion`, {
                params: { input: encodeURIComponent(input) },
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSuggestions(res.data);
        } catch (err) {
            setSuggestions([]);
        }
    };

    const handleInputFocus = (field) => {
        setActiveField(field);
        setPanelOpen(true);
        fetchSuggestions(field === 'pickup' ? pickup : destination);
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        if (field === 'pickup') setPickup(value);
        else setDestination(value);
        setActiveField(field);
        fetchSuggestions(value);
        setPanelOpen(true);
    };

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') setPickup(suggestion);
        else if (activeField === 'destination') setDestination(suggestion);
        setPanelOpen(false);
        setSuggestions([]);
    };

    useGSAP(() => {
        gsap.to(panelRef.current, { height: panelOpen ? '70%' : '0%', padding: panelOpen ? 24 : 0, duration: 0.5, ease: 'power3.inOut' });
        gsap.to(panelCloseRef.current, { opacity: panelOpen ? 1 : 0, duration: 0.5 });
    }, [panelOpen]);

    useGSAP(() => {
        gsap.to(vehiclePanelRef.current, { y: vehiclePanel ? '0%' : '100%', duration: 0.5, ease: 'power3.inOut' });
    }, [vehiclePanel]);

    useGSAP(() => {
        gsap.to(confirmRidePanelRef.current, { y: confirmRidePanel ? '0%' : '100%', duration: 0.5, ease: 'power3.inOut' });
    }, [confirmRidePanel]);
    
    useGSAP(() => {
        gsap.to(vehicleFoundRef.current, { y: vehicleFound ? '0%' : '100%', duration: 0.5, ease: 'power3.inOut' });
    }, [vehicleFound]);

    useGSAP(() => {
        gsap.to(waitingForDriverRef.current, { y: waitingForDriver ? '0%' : '100%', duration: 0.5, ease: 'power3.inOut' });
    }, [waitingForDriver]);


    if (!user) {
        return <LoadingScreen />;
    }

    return (
        <div className='h-screen relative overflow-hidden bg-gray-200'>
            <h1 className='text-3xl font-bold text-gray-800 absolute left-5 top-5'>goConnect</h1>
            
            <div className='h-screen w-screen'>
                <LiveTracking />
            </div>

            <div className='absolute bottom-0 w-full flex flex-col'>
                <div className='bg-white p-6 shadow-2xl rounded-t-3xl'>
                    <div className='flex items-center justify-between mb-4'>
                        <h4 className='text-2xl font-bold text-gray-800'>Find a trip</h4>
                        <h5 ref={panelCloseRef} onClick={() => setPanelOpen(false)} className='opacity-0 text-2xl cursor-pointer text-gray-500 hover:text-gray-800'>
                            <i className="ri-arrow-down-s-line"></i>
                        </h5>
                    </div>
                    
                    <div className='relative flex flex-col gap-3'>
                        <div className="absolute h-10 w-1 top-1/2 -translate-y-1/2 left-4 bg-gray-300 rounded-full"></div>
                        <div className="absolute top-[22px] left-[10px]"><i className="ri-record-circle-fill text-gray-500"></i></div>
                        <div className="absolute top-[71px] left-[10px]"><i className="ri-map-pin-2-fill text-gray-500"></i></div>
                        
                        <input
                            onClick={() => handleInputFocus('pickup')}
                            value={pickup}
                            onChange={(e) => handleInputChange(e, 'pickup')}
                            className='bg-gray-100 pl-10 pr-4 py-3 text-lg rounded-lg w-full border-2 border-transparent focus:border-black focus:outline-none transition-all'
                            type="text"
                            placeholder='Add a pickup location'
                        />
                        <input
                            onClick={() => handleInputFocus('destination')}
                            value={destination}
                            onChange={(e) => handleInputChange(e, 'destination')}
                            className='bg-gray-100 pl-10 pr-4 py-3 text-lg rounded-lg w-full border-2 border-transparent focus:border-black focus:outline-none transition-all'
                            type="text"
                            placeholder='Enter your destination' />
                    </div>

                    <div className="mt-4">
                        <button 
                            onClick={findTrip}
                            disabled={isFareLoading}
                            className="bg-black text-white font-semibold py-3 px-6 rounded-lg w-full flex items-center justify-center h-[50px]
                                       hover:bg-gray-800 active:scale-95 transition duration-200 disabled:bg-gray-500 disabled:cursor-not-allowed"
                        >
                            {isFareLoading ? <Spinner /> : 'Find Trip'}
                        </button>
                        {fareError && <p className="text-red-500 text-sm mt-2 text-center">{fareError}</p>}
                    </div>
                </div>

                <div ref={panelRef} className='bg-white h-0 overflow-y-auto'>
                    <LocationSearchPanel 
                        suggestions={suggestions} 
                        onSuggestionClick={handleSuggestionClick} 
                    />
                </div>
            </div>

            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl p-6'>
                <VehiclePanel selectVehicle={setVehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} fare={fare} />
            </div>

            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl p-6'>
                <ConfirmRide 
                    createRide={createRide}
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    passenger={user}
                    setConfirmRidePanel={setConfirmRidePanel} 
                    setVehicleFound={setVehicleFound} 
                />
            </div>

            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl p-6'>
                <LookingForDriver
                    pickup={pickup}
                    destination={destination}
                    fare={fare}
                    vehicleType={vehicleType}
                    setVehicleFound={setVehicleFound} 
                />
            </div>

            <div ref={waitingForDriverRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl p-6'>
                <WaitingForDriver
                    ride={ride}
                    setVehicleFound={setVehicleFound}
                    waitingForDriver={waitingForDriver} 
                />
            </div>
        </div>
    );
};

export default Home;
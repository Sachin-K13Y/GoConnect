import React, { useRef, useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';

import FinishRide from '../components/FinishRide';
import LiveTracking from './LiveTracking'; // Replaced placeholder with LiveTracking


const DriverRiding = () => {
    const [finishRidePanel, setFinishRidePanel] = useState(false);
    const finishRidePanelRef = useRef(null);
    const location = useLocation();
    const navigate = useNavigate();
    const rideData = location.state?.ride;

    useGSAP(() => {
        gsap.to(finishRidePanelRef.current, { y: finishRidePanel ? '0%' : '100%', duration: 0.5, ease: 'power3.inOut' });
    }, [finishRidePanel]);

    if (!rideData) {
        return <Navigate to="/driver-home" replace />;
    }

    return (
        <div className='h-screen flex flex-col bg-gray-100 relative'>
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
                <div className='h-3/5 w-full relative'>
                    <LiveTracking />
                    <div className='absolute top-4 left-4 right-4 bg-white p-4 rounded-xl shadow-lg z-10'>
                        <div className='flex items-center gap-4 mb-4'>
                            <img 
                                className='h-14 w-14 rounded-full object-cover border-2 border-gray-200'
                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${rideData.user?.fullname?.firstname} ${rideData.user?.fullname?.lastname}`}
                                alt="User Avatar" 
                            />
                            <div>
                                <h3 className='text-lg font-bold text-gray-800'>
                                    {rideData.user?.fullname?.firstname} {rideData.user?.fullname?.lastname}
                                </h3>
                                <p className='text-sm text-gray-500'>Passenger</p>
                            </div>
                        </div>
                        
                        <div className='space-y-3 text-sm'>
                            <div className='flex items-start gap-3'>
                                <i className="ri-record-circle-line text-blue-500 mt-1"></i>
                                <div>
                                    <p className='font-semibold text-gray-500'>Pickup</p>
                                    <p className='font-medium text-gray-800'>{rideData.pickup}</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <i className="ri-map-pin-2-line text-red-500 mt-1"></i>
                                <div>
                                    <p className='font-semibold text-gray-500'>Destination</p>
                                    <p className='font-medium text-gray-800'>{rideData.destination}</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <i className="ri-money-dollar-circle-line text-green-500 mt-1"></i>
                                <div>
                                    <p className='font-semibold text-gray-500'>Fare</p>
                                    <p className='font-bold text-lg text-gray-800'>₹{rideData.fare}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div 
                    className='h-2/5 p-6 flex flex-col items-center justify-center relative bg-black text-white cursor-pointer'
                    onClick={() => setFinishRidePanel(true)}
                >
                    <div className='text-center'>
                        <i className="ri-arrow-up-s-line text-3xl text-gray-400 absolute top-2 left-1/2 -translate-x-1/2"></i>
                        <h4 className='text-2xl font-bold'>Ride in Progress</h4>
                        <p className='text-gray-400'>Tap here to complete the ride</p>
                    </div>
                </div>
            </main>

            <div ref={finishRidePanelRef} className='fixed w-full z-30 bottom-0 translate-y-full bg-white rounded-t-3xl shadow-2xl p-6'>
                <FinishRide
                    rideData={rideData}
                    setFinishRidePanel={setFinishRidePanel} 
                />
            </div>
        </div>
    );
};

export default DriverRiding;

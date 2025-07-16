import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import DriverDetails from '../components/DriverDetails'
import RidePopUp from '../components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ConfirmRidePopUp from '../components/ConfirmRidePopUp'
import { DriverDataContext } from '../context/DriverContext'
import { SocketContext } from '../context/socketContext'
import LiveTracking from './LiveTracking';

const DriverHome = () => {
    const {socket} = useContext(SocketContext);
    const {driver, setDriver} = useContext(DriverDataContext);


    useEffect(() => {
        const fetchDriverProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token && !driver) {
                    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/drivers/profile`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (response.data) {
                        setDriver(response.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch driver profile:", error);
            }
        };
        
        fetchDriverProfile();
    }, []);

    const confirmRide = async()=>{
        console.log(driver);
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/confirm`, {
            rideId: ride._id,
            driver: driver._id
        },{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        console.log(response.data);
        setRidePopupPanel(false);
        setConfirmRidePopupPanel(true);
    }

    // Connect to socket when driver data is available
    useEffect(() => {
        if (driver && driver._id && socket) {
            socket.emit('join', {
                userId: driver._id,
                userType: "driver"
            });

        }
        let intervalId;
        if (driver && driver._id && socket && navigator.geolocation) {
            intervalId = setInterval(() => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {


                        socket.emit('update-location-driver', {
                            userId: driver._id,
                            location:{
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                            }
                        });
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                    }
                );
            }, 10000);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    });
    const [ridePopupPanel, setRidePopupPanel] = useState(false)
    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false)
    const [ride,setRide] = useState(null);
    const ridePopupPanelRef = useRef(null)
    const confirmRidePopupPanelRef = useRef(null)

    socket.on('new-ride',(data)=>{
        console.log(data);
        setRide(data);
        setRidePopupPanel(true);
    })


    useGSAP(function () {
        if (ridePopupPanel) {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(ridePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ridePopupPanel])

    useGSAP(function () {
        if (confirmRidePopupPanel) {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePopupPanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePopupPanel])

    return (
        <div className='h-screen'>
            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/driver-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-3/5'>
                <LiveTracking/>

            </div>
            <div className='h-2/5 p-6'>
                <DriverDetails />
            </div>
            <div ref={ridePopupPanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <RidePopUp
                ride = {ride}
                confirmRide={confirmRide}
                setRidePopupPanel={setRidePopupPanel}  setConfirmRidePopupPanel={setConfirmRidePopupPanel} />
            </div>
            <div ref={confirmRidePopupPanelRef} className='fixed w-full h-screen z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <ConfirmRidePopUp
                ride = {ride}
                
                setConfirmRidePopupPanel={setConfirmRidePopupPanel} setRidePopupPanel={setRidePopupPanel}  />
            </div> 
        </div>
    )
}

export default DriverHome
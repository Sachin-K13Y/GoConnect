import React, { useContext, useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css'
import LocationSearchPanel from '../components/LocationSearchPanel';
import VehiclePanel from '../components/VehiclePanel';
import ConfirmRide from '../components/ConfirmRide';
import LookingForDriver from '../components/LookingForDriver';
import WaitingForDriver from '../components/WaitingForDriver';
import { SocketContext } from '../context/socketContext';
import { UserDataContext } from '../context/UserContext';
import { set } from 'mongoose';

const Home = () => {
    const {socket} = useContext(SocketContext);
    const {user} = useContext(UserDataContext);
    const [passenger, setPassenger] = useState(user);
    useEffect(()=>{
        console.log(user)
        socket.emit("join",{userType:"user",userId:user._id},[user]);
    })
    const [pickup, setPickup] = useState('')
    const [destination, setDestination] = useState('')
    const [panelOpen, setPanelOpen] = useState(false)
    const [activeField, setActiveField] = useState('') // 'pickup' or 'destination'
    const [suggestions, setSuggestions] = useState([])
    const vehiclePanelRef = useRef(null)
    const confirmRidePanelRef = useRef(null)
    const vehicleFoundRef = useRef(null)
    const waitingForDriverRef = useRef(null)
    const panelRef = useRef(null)
    const panelCloseRef = useRef(null)
    const [vehiclePanel, setVehiclePanel] = useState(false)
    const [confirmRidePanel, setConfirmRidePanel] = useState(false)
    const [vehicleFound, setVehicleFound] = useState(false)
    const [waitingForDriver, setWaitingForDriver] = useState(false)
    const [fare,setFare] = useState(null);
    const [vehicleType,setVehicleType] = useState(null);
    const [ride,setRide] = useState(null);
    const createRide=async()=>{
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/create`,{
            pickup,
            destination,
            vehicleType
        },{
            headers:{
                Authorization:`Bearer ${localStorage.getItem('token')}`
            }
        });

    }
    const findTrip = async () => {
        setVehiclePanel(true)
        setPanelOpen(false)

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/get-fare`, {
                params: { pickup, destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
        
            setFare(response.data);
        } catch (err) {
            setFare(null);
        }
    }
    // Fetch suggestions from backend
    const fetchSuggestions = async (input) => {
        if (!input || input.length < 2) {
            setSuggestions([])
            return
        }
        try {
            const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/map/get-suggestion`, {
                params: { input: encodeURIComponent(input) },
                headers:{
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            })
            setSuggestions(res.data)
        } catch (err) {
            setSuggestions([])
        }
    }

    const handleInputFocus = (field) => {
        setActiveField(field)
        setPanelOpen(true)
        if (field === 'pickup') fetchSuggestions(pickup)
        else fetchSuggestions(destination)
    }

    const handleInputChange = (e, field) => {
        const value = e.target.value
        if (field === 'pickup') setPickup(value)
        else setDestination(value)
        setActiveField(field)
        fetchSuggestions(value)
        setPanelOpen(true)
    }

    const handleSuggestionClick = (suggestion) => {
        if (activeField === 'pickup') setPickup(suggestion)
        else if (activeField === 'destination') setDestination(suggestion)
        setPanelOpen(false)
        setSuggestions([])
    }

    const submitHandler = (e) => {
        e.preventDefault()
    }

    socket.on('ride-confirmed', (ride) => {
        setWaitingForDriver(true);
        setRide(ride);
    })
    useGSAP(function () {
        if (panelOpen) {
            gsap.to(panelRef.current, {
                height: '70%',
                padding: 24
                // opacity:1
            })
            gsap.to(panelCloseRef.current, {
                opacity: 1
            })
        } else {
            gsap.to(panelRef.current, {
                height: '0%',
                padding: 0
                // opacity:0
            })
            gsap.to(panelCloseRef.current, {
                opacity: 0
            })
        }
    }, [panelOpen])


    useGSAP(function () {
        if (vehiclePanel) {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehiclePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehiclePanel])

    useGSAP(function () {
        if (confirmRidePanel) {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(confirmRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [confirmRidePanel])

    useGSAP(function () {
        if (vehicleFound) {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(vehicleFoundRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [vehicleFound])

    useGSAP(function () {
        if (waitingForDriver) {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(waitingForDriverRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [waitingForDriver])

    return (
        <div className='h-screen relative overflow-hidden'>
            <img className='w-16 absolute left-5 top-5' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
            <div className='h-screen w-screen'>
                {/* image for temporary use  */}
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
            </div>
            <div className=' flex flex-col justify-end h-screen absolute top-0 w-full'>
                <div className='h-[30%] p-6 bg-white relative'>
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanelOpen(false)
                    }} className='absolute opacity-0 right-6 top-6 text-2xl'>
                        <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className='text-2xl font-semibold'>Find a trip</h4>
                    <form className='relative py-3' onSubmit={(e) => {
                        submitHandler(e)
                    }}>
                        <div className="line absolute h-16 w-1 top-[50%] -translate-y-1/2 left-5 bg-gray-700 rounded-full"></div>
                        <input
                            onClick={() => handleInputFocus('pickup')}
                            value={pickup}
                            onChange={(e) => handleInputChange(e, 'pickup')}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full'
                            type="text"
                            placeholder='Add a pick-up location'
                        />
                        <input
                            onClick={() => handleInputFocus('destination')}
                            value={destination}
                            onChange={(e) => handleInputChange(e, 'destination')}
                            className='bg-[#eee] px-12 py-2 text-lg rounded-lg w-full  mt-3'
                            type="text"
                            placeholder='Enter your destination' />
                    </form>
                   <button onClick={findTrip}
  className="
    bg-black 
    text-white 
    font-semibold 
    py-3 
    px-6 
    rounded-lg 
    hover:bg-gray-800 
    active:scale-95 
    transition 
    duration-200 
    w-full
  "
>
  Find Trip
</button>

                </div>
                <div ref={panelRef} className='bg-white h-0'>
                    <LocationSearchPanel suggestions={suggestions} onSuggestionClick={handleSuggestionClick} setPanelOpen={setPanelOpen} setVehiclePanel={setVehiclePanel} />
                </div>
            </div>
            <div ref={vehiclePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <VehiclePanel selectVehicle = {setVehicleType} setConfirmRidePanel={setConfirmRidePanel} setVehiclePanel={setVehiclePanel} fare={fare} />
            </div>
            <div ref={confirmRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <ConfirmRide createRide={createRide}
                pickup={pickup}
                destination = {destination}
                fare={fare}
                vehicleType = {vehicleType}
                passenger = {passenger}
                setConfirmRidePanel={setConfirmRidePanel} setVehicleFound={setVehicleFound} />
            </div>
            <div ref={vehicleFoundRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-6 pt-12'>
                <LookingForDriver
                pickup={pickup}
                destination={destination}
                fare={fare}
                vehicleType={vehicleType}
                 setVehicleFound={setVehicleFound} />
            </div>
            <div ref={waitingForDriverRef} className='fixed w-full  z-10 bottom-0  bg-white px-3 py-6 pt-12'>
                <WaitingForDriver
                ride = {ride}
                setVehicleFound = {setVehicleFound}
                
                  waitingForDriver={waitingForDriver} />
            </div>
        </div>
    )
}

export default Home
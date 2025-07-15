import React, { useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const DriverRiding = () => {

    const [ finishRidePanel, setFinishRidePanel ] = useState(false)
    const finishRidePanelRef = useRef(null)
    const location = useLocation()
    const rideData = location.state?.ride

    useGSAP(function () {
        if (finishRidePanel) {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(0)'
            })
        } else {
            gsap.to(finishRidePanelRef.current, {
                transform: 'translateY(100%)'
            })
        }
    }, [ finishRidePanel ])


    return (
        <div className='h-screen relative'>

            <div className='fixed p-6 top-0 flex items-center justify-between w-screen'>
                <img className='w-16' src="https://upload.wikimedia.org/wikipedia/commons/c/cc/Uber_logo_2018.png" alt="" />
                <Link to='/driver-home' className=' h-10 w-10 bg-white flex items-center justify-center rounded-full'>
                    <i className="text-lg font-medium ri-logout-box-r-line"></i>
                </Link>
            </div>
            <div className='h-4/5'>
                <img className='h-full w-full object-cover' src="https://miro.medium.com/v2/resize:fit:1400/0*gwMx05pqII5hbfmX.gif" alt="" />
                {rideData && (
                    <div className='absolute top-20 left-0 right-0 bg-white m-4 p-4 rounded-lg shadow-lg'>
                        <div className='flex items-center gap-3 mb-4'>
                            <img className='h-12 w-12 rounded-full object-cover' 
                                 src="https://i.pinimg.com/236x/af/26/28/af26280b0ca305be47df0b799ed1b12b.jpg" 
                                 alt="User" />
                            <div>
                                <h3 className='text-lg font-semibold'>
                                    {rideData.user?.fullname?.firstname} {rideData.user?.fullname?.lastname}
                                </h3>
                                <p className='text-sm text-gray-600'>User</p>
                            </div>
                        </div>
                        
                        <div className='space-y-3'>
                            <div className='flex items-center gap-3'>
                                <i className="ri-map-pin-user-fill text-blue-500"></i>
                                <div>
                                    <p className='text-sm text-gray-600'>Pickup</p>
                                    <p className='font-medium'>{rideData.pickup}</p>
                                </div>
                            </div>
                            
                            <div className='flex items-center gap-3'>
                                <i className="ri-map-pin-2-fill text-red-500"></i>
                                <div>
                                    <p className='text-sm text-gray-600'>Destination</p>
                                    <p className='font-medium'>{rideData.destination}</p>
                                </div>
                            </div>
                            
                            <div className='flex items-center gap-3'>
                                <i className="ri-money-rupee-circle-line text-green-500"></i>
                                <div>
                                    <p className='text-sm text-gray-600'>Fare</p>
                                    <p className='font-medium'>₹{rideData.fare}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <div className='h-1/5 p-6 flex items-center justify-between relative bg-yellow-400 pt-10'
                onClick={() => {
                    setFinishRidePanel(true)
                }}
            >
                <h5 className='p-1 text-center w-[90%] absolute top-0'>
                    <i className="text-3xl text-gray-800 ri-arrow-up-wide-line"></i>
                </h5>
                <div className='flex flex-col'>
                    <h4 className='text-xl font-semibold'>Ride in Progress</h4>
                    <p className='text-sm'>ID: {rideData?._id}</p>
                </div>
                <button className='bg-green-600 text-white font-semibold p-3 px-10 rounded-lg'>
                    Complete Ride
                </button>
            </div>
            <div ref={finishRidePanelRef} className='fixed w-full z-10 bottom-0 translate-y-full bg-white px-3 py-10 pt-12'>
                <FinishRide
                    rideData={rideData}
                    setFinishRidePanel={setFinishRidePanel} />
            </div>

        </div>
    )
}

export default DriverRiding
import React, { useContext } from 'react';
import { DriverDataContext } from '../context/DriverContext';
import 'remixicon/fonts/remixicon.css';

const StatCard = ({ icon, value, label }) => (
    <div className='text-center p-4 bg-gray-100 rounded-xl flex-1'>
        <i className={`${icon} text-3xl mb-2 text-gray-600`}></i>
        <h5 className='text-xl font-bold text-gray-800'>{value}</h5>
        <p className='text-sm text-gray-500'>{label}</p>
    </div>
);

const DriverDetails = () => {
    const { driver } = useContext(DriverDataContext);

    if (!driver) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading driver details...</p>
            </div>
        );
    }

    const { fullname, earnings, hoursOnline, completedRides, rating } = driver;

    return (
        <div className="flex flex-col h-full">
            <div className='flex items-center justify-between mb-6'>
                <div className='flex items-center gap-4'>
                    <img 
                        className='h-16 w-16 rounded-full object-cover border-2 border-gray-200' 
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${fullname?.firstname} ${fullname?.lastname}`}
                        alt="Driver Avatar" 
                    />
                    <div>
                        <h4 className='text-xl font-bold text-gray-800'>
                            {`${fullname?.firstname || ""} ${fullname?.lastname || ""}`}
                        </h4>
                         <p className='text-sm text-gray-500'>You are online</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className='text-sm text-gray-500'>Total Earnings</p>
                    <h4 className='text-2xl font-bold text-green-600'>
                        ₹{earnings?.toFixed(2) ?? '0.00'}
                    </h4>
                </div>
            </div>

            <div className='flex gap-4 mt-4'>
                <StatCard icon="ri-time-line" value={hoursOnline ?? 0} label="Hours Online" />
                <StatCard icon="ri-road-map-line" value={completedRides ?? 0} label="Total Trips" />
                <StatCard icon="ri-star-line" value={rating?.toFixed(1) ?? 'N/A'} label="Rating" />
            </div>
        </div>
    );
};

export default DriverDetails;

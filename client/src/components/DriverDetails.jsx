
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DriverDetails = () => {
    const [driver, setDriver] = useState(null);

    useEffect(() => {
        const fetchDriver = async () => {
            try {
                const res = await axios.get('http://localhost:3000/drivers/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setDriver(res.data);
            } catch (err) {
                setDriver(null);
            }
        };
        fetchDriver();
    }, []);

    console.log(driver);
    return (
        <div>
            <div className='flex items-center justify-between'>
                <div className='flex items-center justify-start gap-3'>
                    <img className='h-10 w-10 rounded-full object-cover' src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdlMd7stpWUCmjpfRjUsQ72xSWikidbgaI1w&s" alt="" />
                    <h4 className='text-lg font-medium'>{driver.fullname.firstname + " "+ driver.fullname.lastname} </h4>
                </div>
                <div>
                    <h4 className='text-xl font-semibold'>₹{driver ? driver.earnings ?? '0.00' : '0.00'}</h4>
                    <p className='text-sm text-gray-600'>Earned</p>
                </div>
            </div>
            <div className='flex p-3 mt-8 bg-gray-100 rounded-xl justify-center gap-5 items-start'>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-timer-2-line"></i>
                    <h5 className='text-lg font-medium'>{driver ? driver.hoursOnline ?? '0' : '0'}</h5>
                    <p className='text-sm text-gray-600'>Hours Online</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-speed-up-line"></i>
                    <h5 className='text-lg font-medium'>{driver ? driver.completedRides ?? '0' : '0'}</h5>
                    <p className='text-sm text-gray-600'>Completed Rides</p>
                </div>
                <div className='text-center'>
                    <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                    <h5 className='text-lg font-medium'>{driver ? driver.rating ?? '0' : '0'}</h5>
                    <p className='text-sm text-gray-600'>Rating</p>
                </div>
            </div>
        </div>
    );
};

export default DriverDetails;
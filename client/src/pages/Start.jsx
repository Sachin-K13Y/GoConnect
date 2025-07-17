import React from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const Start = () => {
  return (
    <div className='relative h-screen w-full'>
      <div 
        className='absolute inset-0 bg-cover bg-center'
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1575440688375-7a6949216104?q=80&w=2574&auto=format&fit=crop')" }}
      ></div>
      
      <div className='absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent'></div>

      <div className='relative h-full flex flex-col justify-between text-white p-8'>
        <header>
          <h1 className='text-3xl font-bold'>goConnect</h1>
        </header>

        <main className='flex flex-col items-start'>
          <h2 className='text-5xl font-bold leading-tight mb-4'>
            Your Ride, <br />
            Your Way.
          </h2>
          <p className='text-lg text-gray-300 mb-8 max-w-md'>
            Tap a button, get a ride. Reliable, safe, and always ready for you.
          </p>
          
          <Link 
            to='/login' 
            className='flex items-center justify-center gap-2 w-full max-w-sm bg-white text-black font-bold py-4 rounded-lg text-lg
                       hover:bg-gray-200 active:scale-95 transition-transform duration-200'
          >
            Get Started
            <i className="ri-arrow-right-line"></i>
          </Link>
          
          <Link 
            to='/driver-login'
            className='w-full max-w-sm text-center mt-4 text-gray-300 hover:text-white transition'
          >
            Are you a driver?
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Start;

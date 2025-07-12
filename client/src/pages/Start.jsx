import React from 'react'
import { Link } from 'react-router-dom'

const Start = () => {
  return (
    <div className="relative h-screen w-full">
      {/* Background Image with overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1470&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between px-8 py-10 max-w-md mx-auto">
        {/* Logo */}
        <img
          className="w-20 mb-6"
          src="https://cdn-icons-png.flaticon.com/512/684/684908.png" // A simple car icon for goConnect
          alt="goConnect Logo"
        />

        {/* Bottom card */}
        <div className="bg-white bg-opacity-90 rounded-3xl shadow-xl p-8 backdrop-blur-sm">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-6">
            Welcome to <span className="text-green-600">goConnect</span>
          </h1>
          <p className="text-gray-700 mb-8">
            Your reliable ride-sharing app for NIT Bihta and nearby areas.
          </p>

          <Link
            to="/login"
            className="block w-full text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Start

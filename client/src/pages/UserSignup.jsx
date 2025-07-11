import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const UserSignup = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userData, setUserData] = useState({})

  const submitHandler = (e) => {
    e.preventDefault()
    setUserData({
      fullName: {
        firstName,
        lastName,
      },
      email,
      password,
    })

    setEmail('')
    setFirstName('')
    setLastName('')
    setPassword('')
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-green-50 to-white px-6 py-12">
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-lg p-8">
        <div className="flex justify-center mb-8">
          <img
            className="w-20 h-20"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYQy-OIkA6In0fTvVwZADPmFFibjmszu2A0g&s"
            alt="goConnect User Icon"
          />
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">What's your name</h3>
            <div className="flex gap-4">
              <input
                required
                type="text"
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
              <input
                required
                type="text"
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-1/2 px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-lg font-semibold mb-2 text-gray-700">
              What's your email
            </label>
            <input
              id="email"
              required
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-lg font-semibold mb-2 text-gray-700">
              Enter Password
            </label>
            <input
              id="password"
              required
              type="password"
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-green-600 hover:underline font-medium">
            Login here
          </Link>
        </p>
      </div>

      <div className="w-full max-w-md mx-auto mt-6 text-center text-xs text-gray-500 px-4">
        <p>
          This site is protected by reCAPTCHA and the{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline">
            Google Privacy Policy
          </a>{' '}
          and{' '}
          <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline">
            Terms of Service
          </a>{' '}
          apply.
        </p>
      </div>
    </div>
  )
}

export default UserSignup

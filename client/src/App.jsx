import React, { useContext } from 'react'

import { Route, Routes } from 'react-router-dom'
import Start from './pages/Start'
import UserLogin from './pages/UserLogin'
import UserSignup from './pages/UserSignup'
import DriverSignup from './pages/DriverSignup'
import Home from './pages/Home'
import UserProtectWrapper from './pages/UserProtectWrapper'
import UserLogout from './pages/UserLogout'
import DriverHome from './pages/DriverHome'
import DriverProtectWrapper from './pages/DriverProtectWrapper'
import DriverLogout from './pages/DriverLogout'
import Riding from './pages/Riding'
import DriverRiding from './pages/DriverRiding'
import 'remixicon/fonts/remixicon.css'

import DriverLogin from './pages/DriverLogin'
const App = () => {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Start />} />
        <Route path='/login' element={<UserLogin />} />
        <Route path='/riding' element={<Riding />} />
        <Route path='/driver-riding' element={<DriverRiding />} />

        <Route path='/signup' element={<UserSignup />} />
        <Route path='/driver-login' element={<DriverLogin />} />
        <Route path='/driver-signup' element={<DriverSignup />} />
        <Route path='/home'
          element={
            <UserProtectWrapper>
              <Home />
            </UserProtectWrapper>
          } />
        <Route path='/user/logout'
          element={<UserProtectWrapper>
            <UserLogout />
          </UserProtectWrapper>
          } />
        <Route path='/driver-home' element={
          <DriverProtectWrapper>
            <DriverHome />
          </DriverProtectWrapper>

        } />
        <Route path='/driver/logout' element={
          <DriverProtectWrapper>
            <DriverLogout />
          </DriverProtectWrapper>
        } />
      </Routes>
    </div>
  )
}

export default App
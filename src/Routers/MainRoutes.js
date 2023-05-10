import React from 'react'
import {BrowserRouter as Router,
        Routes,
        Route
} from 'react-router-dom'

import Signin from '../Components/Signin'
import SideMenu from '../Components/SideMenu'

import Home from '../Pages/Home'
import Dashboard from '../Pages/Dashboard'
import Orders from '../Pages/Orders'
import POSOrder from '../Pages/POSOrder'
import Users from '../Pages/Users'
import Message from '../Pages/Message'
import NonAdmin from '../Pages/NonAdmin'

import Uniform from '../Category/Uniform'
import Pants from '../Category/Pants'
import Accessory from '../Category/Accessory'
import IDlace from '../Category/IDlace'
import Patch from '../Category/Patch'
import Jersey from '../Category/Jersey'

import Error from '../Pages/Error'

import ProtectedRoutes from '../Functions/ProtectedRoutes'
import UserProtected from '../Functions/UserProtected'

export const MainRoutes = () => {
  return (
    
    <Router>

        {/* <SideMenu/> */}
        
      <Routes>
          <Route path='/' element={<Signin/>} />
          <Route path='/RTUApparel' element={<UserProtected><SideMenu/></UserProtected>}>

          <Route path='home' element={<UserProtected><Home/></UserProtected>} >
              <Route path='uniform' element={<UserProtected><Uniform/></UserProtected>} /> 
              <Route path='pants' element={<UserProtected><Pants/></UserProtected>} /> 
              <Route path='accessory' element={<UserProtected><Accessory/></UserProtected>} /> 
              <Route path='idlace' element={<UserProtected><IDlace/></UserProtected>} /> 
              <Route path='patch' element={<UserProtected><Patch/></UserProtected>} /> 
              <Route path='jersey' element={<UserProtected><Jersey/></UserProtected>} /> 
          </Route>
          
          <Route path='dashboard' element={<UserProtected><Dashboard/></UserProtected>} />
          <Route path='orders' element={<UserProtected><Orders/></UserProtected>} />
          <Route path='posOrders' element={<UserProtected><POSOrder/></UserProtected>} />
          <Route path='users' element={<UserProtected><Users/></UserProtected>} />
          <Route path='message' element={<UserProtected><Message/></UserProtected>} />
          </Route>
         
          <Route path='/restricted' element={<ProtectedRoutes><NonAdmin/></ProtectedRoutes>} />
          <Route path='*' element={<Error/>} />
         
        </Routes>

       

      
    </Router>
  )
}

export default MainRoutes
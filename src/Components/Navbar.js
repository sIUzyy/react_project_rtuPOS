//this navbar is only for our home.js wherein it will display the email or name of the user who login, on top of that it will display the image of the user.
import React from 'react'
import { useAuth } from '../Functions/authContext'


const Navbar = () => {

    //currentUser is from our authContext.js
    const { currentUser } = useAuth()

  return (
    <div className=''>
    
        <div className='flex items-center justify-between mx-5 my-2 '>

            <div>
            <h1 className='font-fontPOS font-bold text-lg'>Welcome, <span className='font-semibold text-red-600'>{(currentUser && currentUser.displayName) || currentUser.email}</span> </h1>
          
            </div>

            <div className=''>
              <img className='w-10 h-10 bg-black rounded-full outline-none border-none ' src={currentUser?.photoURL|| "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg"} alt=''/>
            </div>

        </div>

          <p className='mx-5 text-sm -mt-0 md:-mt-4 font-semibold text-gray-500 font-fontP'>Step into the world of RTU Apparel's 'rtupos' collection, where all your clothing needs are met with style, comfort, and quality.</p>
    
    </div>
  )
}

export default Navbar
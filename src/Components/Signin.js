import React, {useState, useEffect, useRef} from 'react'
import { useNavigate } from 'react-router-dom'
import {collection, where, query, getDocs} from 'firebase/firestore'
import { useAuth } from '../Functions/authContext'
import { db } from '../Database/firebase'
import posUI from '../Assets/webp-img/mainPOS.webp'


const Signin = () => {
  
  //created a state to hold the value of user email.
  const [email, setEmail] = useState('')

  //created a state to hold the value of user password.
  const [password, setPassword] = useState('')

  //created a ref for our users.
  const userCollectionRef = collection(db, "users-info" )

  //created for mounting.
  const [isSubmitting,setIsSubmitting] = useState(false)

  //this signIn function is from authContext.js
  const { signIn  } = useAuth()

  //created a const called mounted and we equal it to useRef.
  const mounted = useRef(false)

  //this state will handle the error in our login page.
  const [error, setError] = useState('')

  //created a const called navigate and set it to useNavigate, it will allow us to go to different web page
  const navigate = useNavigate()

  //this useEffect will handle our login.
  useEffect(() => {
    mounted.current = true
    return() => {
        mounted.current = false
    }
}, [])

//this function will check if the email is existing to our database, if the user exist it will check the role, if admin proceed to the RTUPOS, if not, restrict it and will be directed to RTU Apparel page.
  const handleSubmit = async (e) => {
  e.preventDefault()
  setError('')

  if (!email || !password) {
    setError('')
    return
  }

  setIsSubmitting(true)

  signIn(email, password)
    .then(async (response) => {
      // console.log(response)

      // Check if a document with this email exists
      const existingUserQuery = query(userCollectionRef, where('email', '==', email))
      const existingUserDocs = await getDocs(existingUserQuery)

      if (existingUserDocs.size === 0) {
        setError('User does not exist')
        return
      }

      // Get the role of the user
      const role = existingUserDocs.docs[0].data().role

      // Check if the user is an admin
      if (role === 'admin') {
        navigate('/RTUApparel')
      } else {
        navigate('/restricted')
      }
    })
    .catch((error) => {
      console.log(error.message)
      setError(error.message)
    })
    .finally(() => mounted.current && setIsSubmitting(false))
  }

  return (
    
    <div className='h-screen bg-black md:flex justify-center items-center'>
  

        <img className='order-last md:w-3/5 lg:w-6/12 2xl:w-8/12 2xl:h-screen' src={posUI} alt=''/>
        
        <div className='md:w-2/5 md:h-[460px] lg:h-[520px] lg:w-6/12 xl:mx-10 2xl:w-4/12  '>
                

          <form onSubmit={handleSubmit}>
        
            <div className='mx-5 mt-5 md:mt-20'>

         
              <label className='font-semibold text-sm text-gray-500'>EMAIL</label>
              <input 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type='email' 
              placeholder='Enter your email' 
              className='w-full p-3 bg-transparent border rounded-sm text-white outline-none text-sm'/>
            </div>

            <div className='mx-5 mt-5'>
              <label className='font-semibold text-sm text-gray-500'>PASSWORD</label>
              <input 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type='password' 
              placeholder='Enter your password' 
              className='w-full p-3 bg-transparent border text-white rounded-sm outline-none text-sm'/>
            </div>

            <div className='mx-5 mt-10'>
          
            <button className='bg-indigo-600 w-full p-3 rounded-lg text-white font-medium hover:opacity-80 '>Sign In</button>
            { error && <p className='mt-2 text-center text-red-500 font-semibold italic text-md'>{error}</p>}
          

          </div>
          </form>

         
        </div>
    </div>
  )
}

export default Signin


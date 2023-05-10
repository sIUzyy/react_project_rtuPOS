import React, { useEffect, useState } from 'react'
import {FcCheckmark} from 'react-icons/fc'
import {RxCross2} from 'react-icons/rx'
import { db } from '../Database/firebase'
import { collection, deleteDoc, doc, getDocs } from 'firebase/firestore'
import AlertErr from '../Components/AlertErr'
import AlertSuccess from '../Components/AlertSuccess'

const TableMessage = () => {

    //We created a state for our productList, using this we can map through our 'contact-us' collection firestore.
    const [contact, setContact] = useState([]);

    //By using localStorage, the button state can be preserved even if the user refreshes the page or closes the browser.
    const [checkedRows, setCheckedRows] = useState(
      JSON.parse(localStorage.getItem('checkedRows')) || {}
    );


    //We created a const called 'colRef' in short for contactReference.
    //Using this we set our 'colRef' to our collection 'contact-us'
    const colRef = collection(db, 'contact-us');

    const [showSuccess, setShowSuccess] = useState(false)
    const [showError, setShowError] = useState(false)

        //this useEffect will render if the success message pop out, after 3 seconds the message will disappear. 
    useEffect(() => {
        let timer
        if(showSuccess ) {
            timer = setTimeout(() => {
                setShowSuccess(false)
        
            }, 3000)
        }

        return() => clearTimeout(timer)
    }, [showSuccess])

    //this useEffect will render if the error message pop out, after 3 seconds the message will disappear.
    useEffect(() => {
        let timer
        if(showError) {
            timer = setTimeout(() => {
                setShowError(false)
            }, 3000)
        }

        return() => clearTimeout(timer)
    }, [showError])



    //Using useEffect we fetch the 'contact-us' collection in our firestore firebase.
    //When we say 'fetch' we get the data from database and display it into our web page table.
    useEffect(() => { 
      getDocs(colRef)
        .then((snapshot) => {
          let contactData = []
          snapshot.docs.forEach((doc) => {
            contactData.push({...doc.data(), id: doc.id}) 
          })
          setContact(contactData);
        })
        .catch(err => {
          console.log(err.message);
        });
    }, [colRef]);

    //This function will delete the specific row in my table.
    const handleDelete = (id) => {
        const newContact = contact.filter((c) => c.id !== id);
        setContact(newContact);
        deleteDoc(doc(db, 'contact-us', id))
          .then(() => {
            setShowSuccess(true)
          })
          .catch((error) => {
            setShowError(true)
          });
      };

     
     //Using this function we can check or unchecked the row in our table.
      const handleCheck = (index) => {
      setCheckedRows({
        ...checkedRows,
        [index]: !checkedRows[index]
      });
    };
    
    //Using useEffect we stored our isChecked in our localStorage, so whenever we switch to different web page, the isChecked remain the same.
    useEffect(() => {
      localStorage.setItem('checkedRows', JSON.stringify(checkedRows));
    }, [checkedRows]);
      
    
  return (
    <div className='m-2 '>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-center text-white ">
        <caption class="bg-black p-5 text-lg font-semibold text-white text-left  ">
            Contact
            <p class="mt-1 text-sm font-normal text-gray-500 ">This page serves as a comprehensive archive of all messages submitted by users on the RTU Apparel website.</p>
        </caption>
        <thead class=" text-[#EFDD8D] uppercase bg-black text-sm">
            <tr>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                   Name
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Email
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Phone
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Subject
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Message
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Action
                </th>
              
            </tr>
        </thead>
        <tbody>
        {contact.map((contacts, index) => (
            <tr key={contacts.id}  class="bg-black border-b dark:border-gray-700">
     
                <th scope="row" class={checkedRows[index] ? 'line-through px-6 py-4 font-font whitespace-nowrap text-green-500' :"px-6 py-4 font-font  whitespace-nowrap text-white"}>
                    {contacts.firstName + '' + contacts.lastName}
                </th>
                <td class={checkedRows[index] ? ' line-through px-6 py-4 text-green-500 font-font' : 'px-6 py-4 font-font'}>
                {contacts.email}
                </td>
                <td class={checkedRows[index] ? ' line-through px-6 py-4 text-green-500 font-font' : 'px-6 py-4 font-font'}>
                {contacts.phoneNumber}
                </td>
                <td class={checkedRows[index] ? ' line-through px-6 py-4 text-green-500 font-font' : 'px-6 py-4 font-font'}>
                {contacts.subject}
                </td>
                <td class={checkedRows[index] ? ' line-through px-6 py-4 text-green-500 font-font' : 'px-6 py-4 font-font'}>
                {contacts.message}
                </td>
                <td class="px-6 py-4 text-right">

                 <div className='flex justify-center '>
                 
                 <div className='mr-2'>
                 <button onClick={() => handleCheck(index)}>
                   <FcCheckmark size={20}/>
                   </button>
                   </div>

                   <div className='ml-2'>  
                   <button onClick={() => handleDelete(contacts.id)}>
                   <RxCross2 size={20} color='red'/>
                   </button>
                   </div>

                 </div>
                </td>
                  
            </tr>
      
            ))}
        </tbody>
    </table>
</div>

  <div className='absolute right-0 mr-2 mt-2'>

        {/* handleDelete success and error message */}
        {showSuccess && (
        <AlertSuccess
        successMessage='The message has been successfully deleted!'
        onClose={() => setShowSuccess(false)}
        />
        )}

        {/* handleDelete success and error message */}
        {showError && (
            <AlertErr
            errorMessage='Im sorry, but there was an error deleting the message!'
            onClose={() => setShowError(false)}
            />
        )}

        </div>


    </div>
  )
}

export default TableMessage


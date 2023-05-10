import React, { useState, useEffect } from 'react'
import {BsTrash} from 'react-icons/bs'
import { RxReset } from 'react-icons/rx'
import { db } from '../Database/firebase'
import { collection, doc, getDocs, deleteDoc, updateDoc,  } from 'firebase/firestore'
import tempImg from '../Assets/webp-img/mainPOS.webp'
import AlertErr from '../Components/AlertErr'
import AlertSuccess from '../Components/AlertSuccess'


const TableDashboard = () => {

    //We created a state for our productList, using this we can map through our 'products' collection firestore.
    const [productList, setProductList] = useState([]) 

    //We created a state to display a 'Peso' currency sign.
    const [pesoSign] = useState('₱')

    //We created a const called 'productRef' in short for productReference.
    //Using this we set our 'productRef' to our collection 'products'
    const productRef = collection(db, 'products')

    //this state will hold the error message for handleDelete function
    const [showError, setShowError] = useState(false)

    //this state will hold the success message for handleDelete function
    const [showSuccess, setShowSuccess] = useState(false)

    //this state will hold the error message for handleReset function.
    const [showErrorReset, setShowErrorReset] = useState(false)

    //this state will hold the success message for handleReset function.
    const [showSuccessReset, setShowSuccessReset] = useState(false)

    //this useEffect will render if the success message pop out, after 3 seconds the message will disappear. 
    useEffect(() => {
        let timer
        if(showSuccess || showSuccessReset) {
            timer = setTimeout(() => {
                setShowSuccess(false)
                setShowSuccessReset(false)
            }, 3000)
        }

        return() => clearTimeout(timer)
    }, [showSuccess, showSuccessReset])

    //this useEffect will render if the error message pop out, after 3 seconds the message will disappear.
    useEffect(() => {
        let timer
        if(showError || showErrorReset) {
            timer = setTimeout(() => {
                setShowError(false)
                setShowErrorReset(false)
            }, 3000)
        }

        return() => clearTimeout(timer)
    }, [showError, showErrorReset])

    //Using useEffect we fetch the 'products' collection in our firestore firebase.
    //When we say 'fetch' we get the data from database and display it into our web page table.
     useEffect(() => { 
      getDocs(productRef)
        .then((snapshot) => {
          let productlists = []
          snapshot.docs.forEach((doc) => {
            productlists.push({...doc.data(), id: doc.id}) 
          })
          setProductList(productlists);
        })
        .catch(err => {
          console.log(err.message);
        });
    }, [productRef]);

    //This function will delete the specific document in my 'products' collection.
    const handleDelete = (id) => {
        const newContact = productList.filter((c) => c.id !== id);
        setProductList(newContact);
        deleteDoc(doc(db, 'products', id))
          .then(() => {
            setShowSuccess(true)
          })
          .catch((error) => {
            setShowError(true)
        });
      };

    //This function will reset the productStock to 20 of specific document in my 'products' collection
      const handleReset = (id) => {
        updateDoc(doc(db, 'products', id), {
          productStock: 20
        }).then(() => {
          setShowSuccessReset(true);
        }).catch((error) => {
          setShowErrorReset(true);
        });
      };
      

  return (

    
    <div className='m-2'>
    <div class="relative  overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-center text-white ">
        <caption class="bg-[#232C33] p-5 text-lg font-semibold text-left text-white ">
            Dashboard
            <p class="mt-1 text-sm font-normal text-gray-500 ">The dashboard page displays the current state of the business with comprehensive metrics, 
            including the total number of products, users, revenue, and orders.</p>
        </caption>
        <thead class="text-[#EFDD8D] text-sm uppercase bg-[#232C33] ">
            <tr>
                <th scope="col" class="px-6 py-3">
                   -
                </th>
                <th scope="col" class="px-6 py-3  font-normal font-fontMain tracking-widest ">
                    Product
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Variations
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Sizes
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Category
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Stocks
                </th>

                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Price
                </th>

                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Action
                </th>
              
              
            </tr>
        </thead>
        <tbody>
        {productList.map((ListProduct =>
            <tr class="bg-[#232C33] border-b border-gray-700">
                <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                <div className='flex justify-center'>

                {/* <img className='bg-white w-12 h-12' src={ListProduct.productImg + `?t=${Date.now()}`} alt='' /> display the real image of product */}
                <img className='bg-white w-12 h-12' src={tempImg} alt='' />

                    </div>
                </th>
                <td class="px-6 py-4 uppercase font-font text-sm">
                  {ListProduct.productName || "-"}
                </td>
                <td class="px-6 py-4 uppercase font-font text-sm">
                 {ListProduct.productVariations.map((variation, index) => (
                    <span key={index} >{variation || "-"}{index !== ListProduct.productVariations.length -1 ? ', ' : ''}</span>
                 ))}
                </td>
              
                <td class="px-6 py-4 uppercase font-font text-sm">
                {ListProduct.productSizes.map((size, index) => (
                    <span key={index} >{size || "-"}{index !== ListProduct.productSizes.length -1 ? ', ' : ''}</span>
                 ))}
                </td>
               
                <td class="px-6 py-4 uppercase font-font text-sm">
                    {ListProduct.productCategory || "-"}
                </td>
                
                <td class="px-6 py-4 uppercase font-font text-sm">
                    {ListProduct.productStock  || "-"}
                </td>

                <td class="px-6 py-4 uppercase font-font text-sm">
                {ListProduct.productPrice ? (pesoSign ? pesoSign + ' ' : '') + ListProduct.productPrice : '-'}
                        
                </td>

                <td class="px-6 py-4 uppercase font-font">
                

                   <div className='ml-2 flex justify-center items-center'>  
                  
                   <button onClick={() => handleDelete(ListProduct.id)}>
                   <BsTrash size={18} color='red' className='mx-2'/>
                   </button>

                   <button onClick={() => handleReset(ListProduct.id)}>
                    <RxReset size={18} color='green' className='mx-2' />
                   </button>
                
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
        successMessage='The product has been successfully deleted!'
        onClose={() => setShowSuccess(false)}
        />
        )}

        {/* handleDelete success and error message */}
        {showError && (
            <AlertErr
            errorMessage='Im sorry, but there was an error deleting the product!'
            onClose={() => setShowError(false)}
            />
        )}

        {/* handleReset success and error message */}
        {showSuccessReset && (
        <AlertSuccess
        successMessage='The product stock has been successfully updated!'
        onClose={() => setShowSuccessReset(false)}
        />
        )}

        {/* handleReset success and error message */}
        {showErrorReset && (
        <AlertSuccess
        successMessage='Im sorry, but there was an error updating the product stock!'
        onClose={() => setShowErrorReset(false)}
        />
        )}

    </div>
        
    </div>
  )
}

export default TableDashboard



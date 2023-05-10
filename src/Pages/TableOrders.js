import React,{useEffect, useState} from 'react'
import {FcCheckmark} from 'react-icons/fc'
import {RxCross2} from 'react-icons/rx'
import {AiFillPrinter} from 'react-icons/ai'
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../Database/firebase'
import AlertErr from '../Components/AlertErr'
import AlertSuccess from '../Components/AlertSuccess'

const TableOrders = () => {

    //We created a state for our productList, using this we can map through our 'place-order' collection firestore.
    const [productList, setProductList] = useState([])

    //By using localStorage, the button state can be preserved even if the user refreshes the page or closes the browser.
    const [checkedRows, setCheckedRows] = useState(
        JSON.parse(localStorage.getItem('checkedRows')) || {}
      );
  

    //this state will hold the error message for handleDelete function
    const [showError, setShowError] = useState(false)

    //this state will hold the success message for handleDelete function
    const [showSuccess, setShowSuccess] = useState(false)

    //We created a const called 'orderRef' in short for orderReference.
    //Using this we set our 'orderRef' to our collection 'place-order'
    const orderRef = collection(db, 'place-order')

    //Using useEffect we fetch the 'place-order' collection in our firestore firebase.
    //When we say 'fetch' we get the data from database and display it into our web page table.
     useEffect(() => {  
      getDocs(orderRef)
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
    }, [orderRef]);

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
        

    //This function will print the order.
    const handlePrint = () => {
        window.print();
      };

    //this useEffect will render if the success message pop out, after 3 seconds the message will disappear. 
    useEffect(() => {
        let timer
        if(showSuccess) {
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

    //This function will delete the specific row in my table.
    const handleDelete = (id) => {
        const newOrder = productList.filter((o) => o.id !== id);
        setProductList(newOrder);
        deleteDoc(doc(db, 'place-order', id))
          .then(() => {
            setShowSuccess(true)
        })
          .catch((error) => {
            setShowError(true)
        });
      };



    

  return (
    <div className='m-2'>

    <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-center text-white ">
        <caption class="bg-black p-5 text-lg font-semibold text-left  text-white ">
            Purchase Item
            <p class="mt-1 text-sm font-normal text-gray-500">If you're looking for information about orders placed by users on the RTU Apparel website,
             you've come to the right place as this page displays all of that data.</p>
        </caption>
        <thead class="text-[#EFDD8D] text-sm uppercase bg-black ">
            <tr>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                   Email
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Student Number
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Delivery Address
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Name
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Phone Number
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Message
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Payment Option
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Product
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Variations
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Size
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Quantity
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Total Payment
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Action
                </th>

              
            </tr>
        </thead>
        <tbody>
        {productList.map((OrderList, index) => (
            <tr key={OrderList.id}  class="bg-black border-b dark:border-gray-700">
                <th scope="row" class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 text-sm whitespace-nowrap font-font':"px-6 py-4 text-sm whitespace-nowrap text-white font-font"}>
                   {OrderList.email || '-'}
                </th>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font':"px-6 py-4 font-font"}>
                   {OrderList.studentNumber || '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font':"px-6 py-4 font-font"}>
                   {OrderList.address || '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font':"px-6 py-4 font-font"}>
                   {OrderList.name || '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font':"px-6 py-4 font-font"}>
                  {OrderList.phoneNumber || '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font':"px-6 py-4 font-font"}>
                   {OrderList.message || '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font uppercase':"px-6 py-4 font-font uppercase"}>
                   {OrderList.cash || '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font uppercase':"px-6 py-4 font-font uppercase"}>
                {OrderList.products && OrderList.products.length > 0 ? OrderList.products.map((product) => product.productName).join(', ') : '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font uppercase':"px-6 py-4 font-font uppercase"}>
                {OrderList.products && OrderList.products.length > 0 ? OrderList.products.map((product) => product.productVariation).join(', ') : '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font uppercase':"px-6 py-4 font-font uppercase"}>
                {OrderList.products && OrderList.products.length > 0 ? OrderList.products.map((product) => product.productSize).join(', ') : '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font uppercase':"px-6 py-4 font-font uppercase"}>
                {OrderList.products && OrderList.products.length > 0 ? OrderList.products.map((product) => product.productQuantity).join(', ') : '-'}
                </td>

                <td class={checkedRows[index] ? 'line-through text-green-500 px-6 py-4 font-font uppercase':"px-6 py-4 font-font uppercase"}>
                {OrderList.products && OrderList.products.length > 0 ? `₱${OrderList.products.reduce((total, product) => total + product.productPrice, 0) + 30}` : '-'}
                </td>

                <td class="px-6 py-4">
                    <div className='flex justify-center items-center'>

                <div className='mx-2'>
                <button onClick={() => handleCheck(index)}>
                     <FcCheckmark size={20}/>
                    </button>
                </div>

                <div className='mx-2'>  
                   <button onClick={() => handleDelete(OrderList.id)} >
                    <RxCross2 size={20} color='red'/>
                   </button>
                </div>

                <div className='mx-2'>
                   <button onClick={handlePrint}>
                        <AiFillPrinter size={20}/>
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
        successMessage='The order has been successfully deleted!'
        onClose={() => setShowSuccess(false)}
        />
        )}

        {/* handleDelete success and error message */}
        {showError && (
            <AlertErr
            errorMessage='Im sorry, but there was an error deleting the order!'
            onClose={() => setShowError(false)}
            />
        )}

    </div>  
    </div>
  )
}

export default TableOrders
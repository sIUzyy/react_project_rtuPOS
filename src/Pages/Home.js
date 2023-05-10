//This page contains navbar, categories and all of the functionality of RTUPOS.

import React, { useState, useEffect, useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import Navbar from '../Components/Navbar'
import {  RxCross2  } from 'react-icons/rx'
import home from './home.css'
import { db } from '../Database/firebase'
import { collection,  getDocs, addDoc } from 'firebase/firestore'
import GWalletModal from './GWallet'
import { ReceiptContext } from '../Functions/receiptContext'
import tempImg from '../Assets/webp-img/mainPOS.webp'
import jsPDF from 'jspdf'
import AlertErr from '../Components/AlertErr'
import AlertSuccess from '../Components/AlertSuccess'

const Home = () => {

  //Since we have multiple categories, using this state when we render the one category, it will hide the content of other category.
  const [showOutlet, setShowOutlet] = useState(true)

  //We created a state to display a 'Peso' currency sign.
  const [pesoSign] = useState('₱')
  
  //We created a const called 'productRef' in short for productReference.
  //Using this we set our 'productRef' to our collection 'products'
  const productRef = collection(db, 'products')
  
  const {productList,
    setProductList,
    selectedItems,
    setSelectedItems,
    subtotal,
    paymentMethod,
    setPaymentMethod,
    amountTendered,
    setAmountTendered,
    change,
    setChange,
    handleClick,
    handleSizeSelect,
    handleRemoveProduct,
    handleIncrement,
    handleDecrement,
    handlePaymentMethodChange,
    handleAmountTenderedChange      
   } = useContext(ReceiptContext)

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
 }, [productRef, setProductList]);

  const posOrderRef = collection(db, "pos-order")

  const [showAlert, setShowAlert] = useState(false)
  const [showAmount, setShowAmount] = useState(false)
  const [showSubtotal, setShowSubtotal] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showMainError, setShowMainError] = useState(false)

  useEffect(() => {
    let timer
    if (showAlert || showAmount || showSubtotal || showPayment) {
      timer = setTimeout(() => {
        setShowAlert(false);
        setShowAmount(false);
        setShowSubtotal(false);
        setShowPayment(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAlert, showAmount, showSubtotal, showPayment]);

  useEffect(() => {
    let timer
    if(showSuccessAlert){
      timer = setTimeout(() => {
        setShowSuccessAlert(false)
      }, 3000)
    }
    return() => clearTimeout(timer)

  }, [showSuccessAlert])

  const placeOrder = (e) => {
    e.preventDefault();
  
    if (!selectedItems || selectedItems.length === 0) {
      setShowAlert(true);
      return;
    }
  
    if (subtotal === 0) {
      setShowSubtotal(true);
      return;
    }
  
    if (!paymentMethod) {
      setShowPayment(true);
      return;
    }
  
    if (paymentMethod === 'cash' && (isNaN(amountTendered) || amountTendered < subtotal)) {
      setShowAmount(true);
      return;
    }
  
    const orderData = {
      products: selectedItems.map(item => ({
        productName: item.productName,
        productVariation: item.productVariations,
        productSize: item.selectedSize || '-',
        productPrice: item.productPrice,
        productQuantity: item.quantity,
      })),
      total: subtotal.toFixed(2),
      vatSales: '0.00', // add vat sales field
      vatAmount: '0.00', // add vat amount field
      modeOfPayment: paymentMethod,
      amountTendered: paymentMethod === 'cash' ? amountTendered : 0,
      change: paymentMethod === 'cash' ? change.toFixed(2) : 0,
      numberOfItems: selectedItems?.length || 0,
      createdAt: new Date() // Use the current local date and time
    };
  
    // Call the addDoc function with the orderData object
    addDoc(posOrderRef, orderData)
      .then(() => {
        setShowSuccessAlert(true);
        setSelectedItems([]);
        setPaymentMethod('');
        setAmountTendered(0);
        setChange(0);
  
        // Create new jsPDF instance
        const doc = new jsPDF();
  
        // Generate PDF content
        const productsText = selectedItems.map(item => `${item.productName} - ${item.quantity} - ${item.productPrice}`).join('\n');
        const createdAt = new Date();
        const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const formattedDateTime = createdAt.toLocaleString('en-US', { timeZone: userTimeZone, dateStyle: 'short', timeStyle: 'medium' });
  
        const pdfContent = `RTU POINT OF SALE\n\n${productsText}\n\nSubtotal: ${subtotal.toFixed(2)}\nVAT Sales: ${orderData.vatSales}\nVAT Amount: ${orderData.vatAmount}\nTotal: ${orderData.total}\nMode of Payment: ${orderData.modeOfPayment}\nAmount Tendered: ${orderData.amountTendered}\nChange: ${orderData.change}\nNumber of Items: ${orderData.numberOfItems}\nDate: ${formattedDateTime}\n\nTHANK YOU FOR PURCHASING AN ITEM FROM RTU APPAREL!\nTHIS SERVES AS AN OFFICIAL RECEIPT.`;
  
        // Add PDF content to the document
        doc.text(pdfContent, 10, 10);
  
        // Open the generated PDF in a new tab or download automatically
        doc.autoPrint();
        doc.output('dataurlnewwindow');
      })
      .catch((error) => {
        setShowMainError(true);
      });
  };
  
  

  return (
    
    <div className='w-full h-auto md:w-4/5 md:ml-auto md:absolute md:right-0 lg:w-11/12 '> 
    
      <div className='absolute right-0 mr-5 mt-2 '>
      {showAlert && (
      <AlertErr 
      errorMessage='Please note that no item has been selected, and kindly ensure that you select an item before proceeding.'  
      onClose={() => setShowAlert(false)}
      />
      )}

      {showAmount && (
      <AlertErr 
      errorMessage='Amount tendered is invalid, please provide the correct amount.'  
      onClose={() => setShowAmount(false)}
      />
      )}

      {showSubtotal && (
      <AlertErr 
      errorMessage='Subtotal is empty.'  
      onClose={() => setShowSubtotal(false)}
      />
      )}

      {showPayment && (
      <AlertErr 
      errorMessage='Please choose a payment method.'  
      onClose={() => setShowPayment(false)}
      />
      )}

      {showMainError && (
        <AlertErr
        errorMessage='Im sorry, but there seems to have been an error placing your order.'
        onClose={() => setShowMainError(false)}
        />
      )}

      {showSuccessAlert 
      && <AlertSuccess 
      successMessage='Your order has been placed successfully!'
      onClose={() => setShowSuccessAlert(false)} />
      }



      </div>

      <div className=''>
        <Navbar/>
      </div>

    


        <div className='div-container md:flex'>  {/* div container start */}



            <div className='main-div h-auto  pb-5 m-5 bg-[#1E212B] md:w-3/5 md:mx-5 md:pb-0 2xl:w-3/4 '> {/* main div start */}

                <div className='m-5 text-white'>
                  <h1 className='pt-5 md:pt-0 font-fontP uppercase font-bold'>RTU<span className='text-orange-600'>POS</span></h1>

                  <div className='bg-white rounded-lg font-fontP mt-3 p-5 uppercase font-semibold text-black'> {/* category div */}

                    <h1>Categories</h1>


                    <div className='grid gap-4 grid-cols-4 2xl:grid-cols-7 my-2'>

                        <div><Link to='/RTUApparel/home' onClick={() => setShowOutlet(true)}><button className='w-full bg-gray-300 rounded-md p-1 hover:bg-orange-600'>All</button></Link></div>
                        <div><Link to='uniform' onClick={() => setShowOutlet(false)}><button className='w-full bg-gray-300 rounded-md p-1 hover:bg-orange-600'>Uniform</button></Link></div>
                        <div><Link to='pants' onClick={() => setShowOutlet(false)}><button className='w-full bg-gray-300 rounded-md p-1 hover:bg-orange-600'>Pants</button></Link></div>
                        <div><Link to='jersey' onClick={() => setShowOutlet(false)}><button className='w-full bg-gray-300 rounded-md p-1 hover:bg-orange-600'>Jersey</button></Link></div>
                        <div><Link to='idlace' onClick={() => setShowOutlet(false)}><button className='w-full bg-gray-300 rounded-md p-1 hover:bg-orange-600'>ID Lace</button></Link></div>
                        <div><Link to='patch' onClick={() => setShowOutlet(false)}><button className='w-full bg-gray-300 rounded-md p-1 hover:bg-orange-600'>Patch</button></Link></div>
                        <div><Link to='accessory' onClick={() => setShowOutlet(false)}><button className='w-full bg-gray-300 rounded-md p-1 hover:bg-orange-600'>Accessory</button></Link></div>

                    </div>

                    
                    
                  </div> {/* category div end */}


                 
                      {showOutlet && ( 
                        <div className='bg-white rounded-lg font-fontP mt-3 p-5 font-semibold text-black'>  {/* main item div */}

                      <h1 className='text-xl'>All</h1>

                      <div className='grid gap-4 2xl:grid-cols-3 my-2'>
                     
                      {productList?.map(product => ( 
                      
                      <button 
                      onClick={() => handleClick(product)} 
                      disabled={product.productStock === 0}
                      className={product.productStock === 0 ? 'cursor-not-allowed' : 'cursor-default'}
                      >
                      <div  className='border p-2 bg-gray-300 rounded-lg uppercase flex items-center'>
                      
                          
                          <div>
                          {/* <img className='w-36 h-36 rounded-md' src={product.productImg + `?t=${Date.now()}`}  alt='' /> display the real image of product */}
                          <img className='w-36 h-36 rounded-md' src={tempImg} alt='' />
                          </div>

                          <div className='ml-4'>
                          <div className='flex justify-between  w-[420px] md:w-[205px] lg:w-[235px] xl:w-[338px] 2xl:w-[195px] items-center text-sm'>

                          <h1 className='text-left'> {product.productName || "-"}</h1>
                          <h1 className='tracking-stocks text-red-600'>{product.productStock}</h1>

                          </div>

                          <h1 className='text-[#FA9500] text-left text-sm'>  {product.productPrice ? (pesoSign ? pesoSign + ' ' : '') + product.productPrice : '-'} <span >/  {product.productVariations.map((variation, index) => (
                            <span key={index} >{variation || "-"}{index !== product.productVariations.length -1 ? ', ' : ''}</span>
                        ))}</span></h1>


                          <div className='text-left'>
                          <h1 className='text-sm mt-4 -mb-2 text-left '>Sizes</h1>
                          <div className='sizes'>
                          {product.productSizes.map((size, index) => (
                            <button 
                              key={index}
                              className={`m-2 bg-[#EEF1EF] text-sm w-8 h-8 uppercase rounded-md hover:bg-[#EDD9A3] ${size === product.selectedSize ? 'bg-[#EDD9A3]' : ''}`}
                              onClick={() => handleSizeSelect(product, size)}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        </div>
                        </div>

                         
                      </div>
                      </button>
                      
      
                      ))}
                  
                      </div>

                  </div>/* main item div end */
                  
                  )}
                
                  
                  <Outlet/>


                </div>



            </div> {/* main div end */}

         
            <div className='receipt-div bg-[#011627] h-auto pb-5 m-5 md:w-2/5 md:mx-5 md:pb-0 2xl:w-1/4'>  {/* receipt div start */}

   <div className='m-5 text-white'>
      <h1 className='font-fontP uppercase font-bold mb-5 pt-5 md:pt-0'>Current Order</h1>

      {selectedItems?.map((item,index) => (
        
    <div key={index} className='font-fontP uppercase font-semibold text-sm mt-3 p-5 rounded-lg bg-[#30343F]'>    {/* item order */}

      <div className='flex justify-between'>
        
      <h1>{item.productName}</h1>
    
    <button className='remove_product' onClick={() => handleRemoveProduct(index)}>  <RxCross2 size={20} color='red'/></button>

      </div>

      <h1>{item.productVariations}</h1>
      <h1 className='selected_Size'>{item.selectedSize || '-'}</h1>
      <h1 className='mb-2'>{ pesoSign + ' ' + item.productPrice}</h1>
        
        <div className='flex items-center'>
          <button onClick={() => handleIncrement(index)} className='w-8 text-base border mr-5'>+</button>
          <h1>{item.quantity}</h1>
          <button onClick={() => handleDecrement(index)} className='w-8 text-base border ml-5'>-</button>
        </div>


    </div> 

     ))}

      <div className='mt-10 p-5 font-fontP  font-bold text-gray-400 rounded-lg bg-[#30343F]'> {/* receipt-of-order */}

         <div className=''>   
            <h1 className='flex justify-between '>SubTotal <span>₱ {subtotal.toFixed(2)}</span></h1>
            <h1 className='flex justify-between'>VAT Sales <span>₱ 0.00</span></h1>
          
            <h1 className='border-b-2 pb-2 border-dashed flex justify-between '>VAT Amount <span>₱ 0.00</span></h1>
            <h1 className='pt-2 flex justify-between'>Total <span>₱ {subtotal.toFixed(2)}</span></h1>
        </div>

      </div> {/* receipt-of-order end */}



      <div className='mt-5 p-5 font-fontP uppercase font-bold rounded-lg bg-[#30343F]'> {/*place-order div */}

        <div className='flex justify-between items-center text-sm'>
          <button 
          className={`bg-[#011627] p-2 w-2/4 mr-2 rounded-full focus:bg-red-600 hover:bg-red-600 active:bg-red-600 ${paymentMethod === 'cash' ? 'bg-red-600' : ''}`}
          onClick={() => handlePaymentMethodChange('cash')}
          >
          Cash
          </button>

          <button
          className={`bg-[#011627] p-2 w-2/4 mr-2 rounded-full hover:bg-red-600 ${paymentMethod === 'gw' ? 'bg-red-600' : ''}`}
          onClick={() => handlePaymentMethodChange('gwallet')}
          >
          <GWalletModal/> 
          </button>
         
        
        </div>
        {paymentMethod === 'cash' && (

        <div className='text-sm mt-5 pb-3 border-b-2 border-white  border-dashed text-black'>
          <label className='block text-gray-400 mb-2'>Amount Tender</label>
          <input 
          // className='w-full p-2 outline-none bg-transparent border border-white text-white placeholder:text-sm placeholder:pl-1' 
          className={`${home.input} w-full p-2 outline-none bg-transparent border border-white text-white placeholder:text-sm placeholder:pl-1`}
          type='number' 
          placeholder='Input the customers payment in cash'
          value={amountTendered}
          onChange={handleAmountTenderedChange} 
          />
        </div>
        )}

        {paymentMethod === 'cash' && (
          <div className='mt-5 text-sm'>
          <h1 className='flex justify-between text-gray-400'>Change <span>₱ {change.toFixed(2)}</span></h1>
          </div>
          )}

        <div className='mt-2 text-sm'>
          <h1 className='flex justify-between text-gray-400'>No. of Items <span>{selectedItems?.length}</span></h1>
        </div>

        <button onClick={placeOrder} className='my-5 text-center w-full bg-white p-3 text-[#011627] rounded-lg'>Place Order</button>

      </div> 
      {/*place-order div end */}
</div>

</div> 
{/* receipt div end */}


</div> {/* div container end */}

</div>
    
  )
}

export default Home
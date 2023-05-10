import { collection, getDocs } from 'firebase/firestore'
import { db } from '../Database/firebase'
import React, { useEffect, useState } from 'react'

const TablePOSOrders = () => {

    const [receiptList, setReceiptList] = useState([])
    const receiptRef = collection(db, 'pos-order')

    useEffect(() => {  
        getDocs(receiptRef)
          .then((snapshot) => {
            let receiptlists = []
            snapshot.docs.forEach((doc) => {
                receiptlists.push({...doc.data(), id: doc.id}) 
            })
            setReceiptList(receiptlists);
          })
          .catch(err => {
            console.log(err.message);
          });
      }, [receiptRef]);

  return (
<div className='m-2'>
<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
    <table class="w-full text-sm text-center text-white ">
        <caption class="bg-black p-5 text-lg font-semibold text-left  text-white ">
        Transaction Record
            <p class="mt-1 text-sm font-normal text-gray-500">
            On this page you will be able to view the receipt generated from the orders made through the Point of Sale system.
             </p>
        </caption>
        <thead class="text-[#EFDD8D] text-sm uppercase bg-black ">
            <tr>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Product
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Variations
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Quantity
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Size
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Price
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    No. of Items
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Total
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Payment Option
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Amount Tendered
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Change
                </th>
                <th scope="col" class="px-6 py-3 font-normal font-fontMain tracking-widest">
                    Date
                </th>
                
              
            </tr>
        </thead>
        <tbody>
        {receiptList.map(receipt => (
            <tr key={receipt.id} class="bg-black border-b dark:border-gray-700">

                <th scope="row" className="px-6 py-4 text-sm whitespace-nowrap text-white font-font">
                {receipt.products && receipt.products.length > 0 ? receipt.products.map((product) => product.productName).join(', ') : '-'}
                </th>

                <td class="px-6 py-4 font-font">
                {receipt.products && receipt.products.length > 0 ? receipt.products.map((product) => product.productVariation).join(', ') : '-'}
                </td>

                <td class="px-6 py-4 font-font">
                {receipt.products && receipt.products.length > 0 ? receipt.products.map((product) => product.productQuantity).join(', ') : '-'}
                </td>

                <td class="px-6 py-4 font-font">
                {receipt.products && receipt.products.length > 0 ? receipt.products.map((product) => product.productSize).join(', ') : '-'}
                </td>

                <td class="px-6 py-4 font-font">
                {receipt.products && receipt.products.length > 0 ? receipt.products.map((product) => product.productPrice).join(', ') : '-'}
                </td>

                <td class="px-6 py-4 font-font">
                   {receipt.numberOfItems}
                </td>

                <td class="px-6 py-4 font-font">
                   {receipt.total}
                </td>

                <td class="px-6 py-4 font-font uppercase">
                   {receipt.modeOfPayment}
                </td>

                <td class="px-6 py-4 font-font">
                   {receipt.amountTendered}
                </td>

                <td class="px-6 py-4 font-font">
                   {receipt.change}
                </td>

                <td class="px-6 py-4 font-font uppercase">
                {receipt.createdAt?.seconds ? new Date(receipt.createdAt.seconds * 1000).toDateString() : ''}
                </td>

            

            </tr>
    
        ))}
          
        </tbody>
    </table>
</div>

</div>
  )
}

export default TablePOSOrders
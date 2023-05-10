import React, { useEffect, useState } from 'react'
import DashboardModal from './DashboardModal'
import TableDashboard from './TableDashboard'
import { db } from '../Database/firebase'
import { collection, onSnapshot} from 'firebase/firestore'

const Dashboard = () => {

  //setting the productCount to 0
  const [productCount, setProductCounts] = useState(0)

  //setting the userCount to 0
  const [userCount, setUserCount] = useState(0)

  //setting the orderCount to 0
  const [orderCount, setOrderCount] = useState(0)

  const [apparelRevenue, setApparelRevenue] = useState(0)
  const [posRevenue, setPOSRevenue] = useState(0)

  //fetching the data from our product collection, using this we count how many uid we have in that collection.
  useEffect(() => {
    const productsRef = collection(db, "products");
  
    const unsubscribe = onSnapshot(productsRef, (querySnapshot) => {
      setProductCounts(querySnapshot.size);
    });
  
    // Cleanup function to unsubscribe when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);

  //fetching the data from our users-info collection, using this we count how many uid we have in that collection.
  useEffect(() => {
    const usersRef = collection(db, 'users-info')

    const unsubscribe = onSnapshot(usersRef, (querySnapshot) => {
      setUserCount(querySnapshot.size)
    })

    return() => {
      unsubscribe()
    }
  }, [])

    //fetching the data from our place-order collection, using this we count how many uid we have in that collection.
    useEffect(() => {
      const orderRef = collection(db, 'place-order')
  
      const unsubscribe = onSnapshot(orderRef, (querySnapshot) => {
        setOrderCount(querySnapshot.size)
      })
  
      return() => {
        unsubscribe()
      }
    }, [])

    //fetching the data from our 'place-order' collection and get the productPrice of each document.
    //Then, each document we add 30(delivery fee).
    useEffect(() => {
      const apparelRef = collection(db, 'place-order');
      const unsubscribe = onSnapshot(apparelRef, (querySnapshot) => {
        let totalRevenue = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const products = data.products;
          let orderTotal = 0;
          products.forEach((product) => {
            orderTotal += product.productPrice;
          });
          orderTotal += 30; // Add 30 to the revenue for each document
          totalRevenue += orderTotal;
        });
        setApparelRevenue(totalRevenue);
      });
    
      return () => {
        unsubscribe();
      };
    }, []);

    //fetching the data from our 'pos-order' collection and get the total of each document.
    useEffect(() => {
      const posRef = collection(db, 'pos-order');
    
      const unsubscribe = onSnapshot(posRef, (querySnapshot) => {
        let totalRevenue = 0;
        querySnapshot.forEach((doc) => {
          const { total } = doc.data();
          totalRevenue += total ? Number(total) : 0;
        });
        setPOSRevenue(totalRevenue);
      });
    
      return () => {
        unsubscribe();
      };
    }, []);
    
  return (

    // main-div
    <div className='w-full h-auto md:w-4/5 md:ml-auto md:absolute md:right-0 lg:w-11/12'> 


    <div className='flex'>{/* div-that-hold-the-two-cols */}

    
      <div className='w-1/2 bg-[#6F1A07] h-72 m-2 flex justify-center items-center rounded-lg  text-white '>  {/* user and product div */}

      <div className='font-bold uppercase text-xl 2xl:text-5xl font-fontMain tracking-widest mx-2'>
      {/* display how many user we have */}
      <h1>users: <span className='text-5xl md:text-7xl text-orange-500'>{userCount}</span></h1>

      {/* display how many products we have */}
      <h1>products: <span className='text-5xl md:text-7xl text-orange-500'> {productCount}</span></h1>
      </div>
        
      </div>   {/* user and product div end */}



      <div className='w-1/2 bg-[#1E555C] h-72 m-2 flex justify-center items-center rounded-lg  text-white '>   {/* order and revenue div */}

      <div className='font-bold uppercase text-xl 2xl:text-5xl font-fontMain tracking-widest mx-2'>
      <h1>total orders: <span className='text-5xl md:text-7xl text-orange-500'>{orderCount}</span></h1>
      <h1>total revenue: <span className='text-5xl md:text-7xl text-orange-500'>{apparelRevenue + posRevenue}</span></h1>
      
      </div>

      </div>   {/* order and revenue div end */}

    </div>    {/* div-that-hold-the-two-cols end*/}

  
    <div className='p-3'>
      <DashboardModal/>
    </div>

   <div>
    <TableDashboard/>
   </div>


{/* main-div end*/}
</div> 
  )
}

export default Dashboard
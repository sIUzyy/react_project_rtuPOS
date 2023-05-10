import React, { createContext, useState, useEffect } from "react"
import {doc, updateDoc } from "firebase/firestore"
import { db } from "../Database/firebase"

export const ReceiptContext = createContext()

export const ReceiptContextProvider = (props) => {

    const [selectedItems, setSelectedItems] = useState([])
    const [selectedProduct, setSelectedProduct] = useState(null)
    const [subTotal, setSubTotal] = useState(0)
    const [amountTendered, setAmountTendered] = useState(0);
    const [change, setChange] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [productList, setProductList] = useState([]) 

    //When we click our product it will display it on the current order section.
    const handleClick = async (product) => {  
        const updatedProduct = {
          ...product,
          productStock: product.productStock - 1
        }
      
        // Check if the selected product is already in the selectedItems array
        const productExists = selectedItems.some(item => item.id === product.id);
      
        if (!productExists) {
          // Find the index of the product in the productList array
          const index = productList.findIndex(p => p.id === product.id);
      
          // Update the product in the productList array
          const updatedProductList = [...productList];
          updatedProductList[index] = updatedProduct;
          setProductList(updatedProductList);
          setSelectedProduct(updatedProduct);
          setSelectedItems((prevItems) => [...prevItems, updatedProduct]);
      
          // Update the product stock in Firestore
          const productRef = doc(db, 'products', product.id);
          await updateDoc(productRef, { productStock: updatedProduct.productStock });
        }
      }
      
      

    //We have 'x' sign in our current order, when the user click that the specific item will be remove.
    const handleRemoveProduct = async (index) => {
        const itemToRemove = selectedItems[index];
        const updatedProductList = productList.map(product => {
          if (product.id === itemToRemove.id) {
            return {
              ...product,
              productStock: product.productStock + 1
            };
          }
          return product;
        });
        const updatedItems = [...selectedItems];
        updatedItems.splice(index, 1);
        setSelectedItems(updatedItems);
        setProductList(updatedProductList);
      
        // Update the product stock in Firestore
        const productRef = doc(db, 'products', itemToRemove.id);
        await updateDoc(productRef, { productStock: itemToRemove.productStock + 1 });
      };
      

    //This function will hold the size of each item.
    const handleSizeSelect = (item, size) => {
    const updatedItem = {
        ...item,
        selectedSize: size
    }
    
    setSelectedItems(prevState => {
        const index = prevState.findIndex(p => p.id === item.id)
        const updatedState = [...prevState]
        updatedState[index] = updatedItem
        return updatedState
    })
    }
    //this function is for our quantity, if they click the '+' it will increment the quantity also the total.
    const handleIncrement = async (index) => {
        const updatedItems = [...selectedItems];
        const selectedItem = updatedItems[index];
        const updatedProductList = productList.map((product) => {
          if (product.id === selectedItem.id) {
            return {
              ...product,
              productStock: product.productStock - 1
            };
          }
          return product;
        });
        selectedItem.quantity = selectedItem.quantity ? selectedItem.quantity + 1 : 2;
        selectedItem.productStock = selectedItem.productStock - 1; // update productStock
        setSelectedItems(updatedItems);
        setProductList(updatedProductList);
      
        // Update the product stock in Firestore
        const productRef = doc(db, "products", selectedItem.id);
        await updateDoc(productRef, {
          productStock: selectedItem.productStock
        });
      };
      
    //this function is for our quantity, if they click the '-' it will decrement the quantity also the total.
    const handleDecrement = async (index) => {
        const updatedItems = [...selectedItems];
        const selectedItem = updatedItems[index];
        const updatedProductList = productList.map((product) => {
          if (product.id === selectedItem.id) {
            return {
              ...product,
              productStock: product.productStock + 1
            };
          }
          return product;
        });
        selectedItem.quantity = selectedItem.quantity && selectedItem.quantity > 1
          ? selectedItem.quantity - 1
          : 1;
        selectedItem.productStock = selectedItem.productStock + 1; // update productStock
        setSelectedItems(updatedItems);
        setProductList(updatedProductList);
      
        // Update the product stock in Firestore
        const productRef = doc(db, "products", selectedItem.id);
        await updateDoc(productRef, {
          productStock: selectedItem.productStock
        });
      };
      
    //This function will hold the subTotal of all items in our current order, also, it will calculate the subTotal based on how many item we have and current order, and how many quantities we have.
    const subtotal = selectedItems.reduce((acc, item) => {
    const itemPrice = parseFloat(item.productPrice); // Parse price as float
    const itemQuantity = item.quantity || 1; // Use 1 as default quantity
    return acc + (itemPrice * itemQuantity)
    }, 0)

    //this function will hold the paymentMethod that user selected.
    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method)
        setAmountTendered('')
    };

    //Using this useEffect everytime the quantity increasing or decreasing, same to our subTotal and total.
  useEffect(() => {
    let total = 0
    selectedItems?.forEach((item) => {
      total += item.quantity * item.productPrice
    });
    setSubTotal(total);
  }, [selectedItems])

    //This function will stand for our change, it will calculate the customer money minus to subTotal or total.
    const handleAmountTenderedChange = (e) => {
        const tendered = e.target.value
        setAmountTendered(tendered)
    
        if (tendered < subtotal) {
        setChange(0);
        } else {
        setChange(tendered - subtotal);
        }
    }

    const contextValue = {
        selectedItems,
        setSelectedItems,
        productList,
        setProductList,
        paymentMethod,
        setPaymentMethod,
        change,
        setChange,
        amountTendered,
        setAmountTendered,
        subTotal,
        setSubTotal,
        selectedProduct,
        setSelectedProduct,
        handleClick,
        handleRemoveProduct,
        handleSizeSelect,
        handleIncrement,
        handleDecrement,
        subtotal,
        handlePaymentMethodChange,
        handleAmountTenderedChange

    }


    return <ReceiptContext.Provider value={contextValue}>
            {props.children}
    </ReceiptContext.Provider>
}
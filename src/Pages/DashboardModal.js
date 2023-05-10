import React, { useState } from "react";
import { Button, Dialog} from "@material-tailwind/react";
import { useFormik } from 'formik' 
import { SchemaObject } from "../Functions/ValidationSchema";
import { addDoc, collection } from 'firebase/firestore'
import { db, storage } from '../Database/firebase'
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {  v4  } from 'uuid'
import { convertStringToArray } from "../Functions/ConvertString";

 
export default function DashboardModal() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen((cur) => !cur);
  const [imageUpload, setImageUpload] = useState(null)
  const [setImageUrl] = useState('');
  const productRef = collection(db, 'products')


  const handleProduct = async (e) => {
    e.preventDefault();
  
    const productVariationsArr = convertStringToArray(values.productVariations);
    const productSizesArr = convertStringToArray(values.productSizes);
  
    // Upload image to storage
    let imgUrl = '';
    if (imageUpload !== null) {
      const imageRef = ref(storage, `productImage/${imageUpload.name + v4()}`);
      await uploadBytes(imageRef, imageUpload);
      imgUrl = await getDownloadURL(imageRef) + `?t=${Date.now()}`;
    }
  
    // Add product data to Firestore
    await addDoc(productRef, {
      productName: values.productName,
      productVariations: productVariationsArr,
      productSizes: productSizesArr,
      productCategory: values.productCategory,
      productStock: values.productStock,
      productPrice: values.productPrice,
      productImg: imgUrl,
    });
  
    // Update image URL
    if (imgUrl !== '') {
      setImageUrl(imgUrl);
    }
  
    // Reset form
    resetForm({
      values: values.initialValues,
    });
  };
  
  const {values, errors, touched, handleChange, handleBlur, handleSubmit, resetForm} = useFormik({

          //This 'initialValues' will become our states.
          initialValues:{
                productName: "",
                productVariations: "",
                productSizes: "",
                productCategory: "",
                productPrice: "",
                productStock: "",
                productImg: "",
          },
        

          ValidationSchema: SchemaObject,
  })

 
  return (
    <React.Fragment>
    <div className="flex justify-end mx-2">
    <Button className="bg-black  normal-case font-fontMain tracking-widest font-normal "  onClick={handleOpen}>Add Product</Button>
    </div>
    <Dialog
      size="xs"
      open={open}
      handler={handleOpen}
      className="bg-transparent shadow-none"
    >

    <div className="max-w-7xl mx-auto">

        <div className="bg-[#F3EFF5] w-96 -ml-32 rounded-xl md:-ml-24 lg:ml-0 2xl:w-auto 2xl:h-auto">
            <div className="mx-5">
                <div className="pt-5 mb-5">
                    <h1 className="text-black font-bold font-fontDash text-center uppercase 2xl:text-4xl ">Create a product listing.</h1>

                </div>

            <div className="form-data">

                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="mb-2 text-sm font-medium text-black">Product Name</label>
                       <input
                       value={values.productName}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       id='productName'
                       className="w-full p-2 outline-none bg-transparent border border-black text-black placeholder:text-sm placeholder:pl-2 " 
                       type='text' 
                       placeholder="Enter your product name" 
                       required
                      />
                      {errors.productName && touched.productName && <p className="text-black font-2xl">{errors.productName}</p>}
                       
                    </div>

                    <div className="mb-2">
                       <label className="mb-2 text-sm font-medium text-black">Product Variation</label>
                       <input 
                       value={values.productVariations}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       id='productVariations'
                       className="w-full p-2 outline-none bg-transparent border border-black text-black placeholder:text-sm placeholder:pl-2" 
                       type='text' 
                       placeholder="Enter your product variations"
                       required
                       />
                       {errors.productVariations && touched.productVariations && <p className="text-black font-lg">{errors.productVariations}</p>}
                       
                    </div>

                    <div className="mb-2">
                       <label className="mb-2 text-sm font-medium text-black">Product Size</label>
                       <input 
                       value={values.productSizes}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       id='productSizes'
                       className="w-full p-2  outline-none bg-transparent border border-black text-black placeholder:text-sm placeholder:pl-2" 
                       type='text' 
                       placeholder="Enter your product sizes"
                       />
                       {errors.productSizes && touched.productSizes && <p className="text-black font-2xl">{errors.productSizes}</p>}
                       
                    </div>

                    <div className="mb-2">
                       <label className="mb-2 text-sm font-medium text-black">Product Category</label>
                       
                       <input
                       value={values.productCategory}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       id='productCategory' 
                       className="w-full p-2  outline-none bg-transparent border border-black text-black placeholder:text-sm placeholder:pl-2" 
                       type='text' 
                       placeholder="Enter your product category"
                       required
                       />
                       {errors.productCategory && touched.productCategory && <p className="text-black font-2xl">{errors.productCategory}</p>}
                       
                    </div>

                    <div className="mb-5">
                       <label className="mb-2 text-sm font-medium text-black">Product Stocks</label>
                       <input 
                       value={values.productStock}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       id='productStock'
                       className="w-full p-2  outline-none bg-transparent border border-black text-black placeholder:text-sm placeholder:pl-2" 
                       type='number' 
                       placeholder="Enter your product stocks"
                       required
                       />
                       {errors.productStock && touched.productStock && <p className="text-black font-2xl">{errors.productStock}</p>}
                       
                    </div>

                    <div className="mb-5">
                       <label className="mb-2 text-sm font-medium text-black">Product Price</label>
                       <input 
                       value={values.productPrice}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       id='productPrice'
                       className="w-full p-2  outline-none bg-transparent border border-black text-black placeholder:text-sm placeholder:pl-2" 
                       type='number' 
                       placeholder="Enter your product price"
                       required
                       />
                       {errors.productPrice && touched.productPrice && <p className="text-black font-2xl">{errors.productPrice}</p>}
                       
                    </div>

                    <div className="mb-5">
                       
                    
                    <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload product image (PNG or JPG.)</label>
                    <input 
                      value={values.productImg}
                      onChange={(e) => {
                      handleChange(e);
                      setImageUpload(e.target.files[0]);
                    }}
                      id='productImg'
                      class="block w-full text-sm text-gray-900 cursor-pointer focus:outline-none placeholder-gray-400 p-3" 
                      aria-describedby="file_input_help"  
                      type="file"
                      required
                      />
                      {errors.productImg && touched.productImg && <p className="text-black font-2xl">{errors.productImg}</p>}
                  
                       
                    </div>

                    <div className="pb-5">
                        <button 
                        onClick={handleProduct}
                        className="rounded-lg text-white font-semibold p-3 w-full bg-red-600 hover:opacity-80">Add Product</button>
                    </div>
                </form>
            </div>   
            </div>

        </div>
        
    </div>
      
    </Dialog>
  </React.Fragment>

  );
}
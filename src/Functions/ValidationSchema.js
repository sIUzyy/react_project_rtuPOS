import React from 'react'
import * as yup from 'yup'

export const SchemaObject = yup.object().shape({

    productName: yup.string()
    .required('Please enter the name of your product'),

    productVariations: yup.string()
    .required('Please enter the variation of your product'),

    productSizes: yup.string()
    .required('Please enter the size of your product'),

    productCategory: yup.string()
    .required('Please enter the category of your product'),

    productPrice: yup.number()
    .integer()
    .required('Please enter the price of your product'),


})
import React from 'react';
import "./App.css"

const Product = ({ product }) => (
  <li className="product-item">
    <div className="product-details">
      <div className="product-info">
        <h2 className="product-name"> {product.product}</h2>
        <p className="product-price">${product.price} </p>
      </div>
      <p className="product-brand"> {product.brand}</p>
    </div>
  </li>
);

export default Product;

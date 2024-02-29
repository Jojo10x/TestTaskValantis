import React from 'react';

const Product = ({ product }) => (
  <li>
    {product.product} {product.price} {product.brand}
  </li>
);

export default Product;

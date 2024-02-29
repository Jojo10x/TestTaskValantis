import React, { useState, useEffect, useRef } from 'react';
import { fetchProductIds, fetchProducts, fetchFilteredProductIds } from './api';
import Product from './Product';

const ProductList = () => {
  const [productIds, setProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const endOfListRef = useRef(null);

  const debounce = (func, delay) => {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  useEffect(() => {
    setProducts([]);
    const fetchProductIdsAndUpdateState = async () => {
      const ids = await fetchProductIds(page);
      setProductIds(ids);
    };
    fetchProductIdsAndUpdateState();
  }, [page]);

  useEffect(() => {
    const fetchProductsAndUpdateState = async () => {
      if (productIds.length === 0) return;
      setLoading(true);
      const productList = await fetchProducts(productIds);
      setProducts(productList);
      setLoading(false);
    };
    fetchProductsAndUpdateState();
  }, [productIds]);

  useEffect(() => {
    const filteredProductIds = async () => {
      if (priceFilter !== '') {
        setLoading(true);
        const ids = await fetchFilteredProductIds('price', priceFilter);
        setProductIds(ids);
        setLoading(false);
      } else {
        setPage(1);
      }
    };
    filteredProductIds();
  }, [priceFilter]);

  useEffect(() => {
    const filteredProductIds = async () => {
      setLoading(true);
      const ids = await fetchFilteredProductIds('brand', brandFilter);
      setProductIds(ids);
      setLoading(false);
    };
    if (brandFilter !== '') {
      filteredProductIds();
    }
  }, [brandFilter]);

  useEffect(() => {
    const delayedSearch = debounce(() => {
      console.log("Search term:", searchTerm);
    }, 500);

    delayedSearch();

    return () => {
      clearTimeout(delayedSearch);
    };
  }, [searchTerm]);

  const filteredProducts = products.filter(
    (product) =>
      product.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const goToNextPage = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const goToPrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceFilterChange = (event) => {
    const priceValue = event.target.value;
    setPriceFilter(priceValue !== '' ? parseFloat(priceValue).toString() : '');
  };

  const handleBrandFilterChange = (event) => {
    setBrandFilter(event.target.value);
  };

  return (
    <div className="container">
    <h1>Product List</h1>
    <div className="input-group">
      <input
        type="text"
        placeholder="Search by name..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <input
        type="number"
        placeholder="Filter by price..."
        value={priceFilter}
        onChange={handlePriceFilterChange}
      />
      <input
        type="text"
        placeholder="Filter by brand..."
        value={brandFilter}
        onChange={handleBrandFilterChange}
      />
    </div>
    <ul>
      {filteredProducts.map((product, index) => (
        <Product key={index} product={product} />
      ))}
    </ul>
    {loading && <p className="loading">Loading...</p>}
    <div ref={endOfListRef}></div>
    <div className="pagination">
      <button onClick={goToPrevPage} disabled={page === 1} >
        Previous Page
      </button>
      <button onClick={goToNextPage} >Next Page</button>
    </div>
  </div>
);
};

export default ProductList;

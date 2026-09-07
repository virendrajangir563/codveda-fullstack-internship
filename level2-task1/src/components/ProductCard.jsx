function ProductCard({ product }) {
  return (
    <div className="product-card">
      <h3>{product.name}</h3>

      <p>Price: ₹{product.price}</p>

      <p>Description: {product.description}</p>

      <p>Category: {product.category}</p>

      <p>Stock: {product.stock}</p>
    </div>
  );
}

export default ProductCard;
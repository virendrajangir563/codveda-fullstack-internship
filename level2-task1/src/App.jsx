import { useEffect, useState } from "react";
import ProductCard from "./components/ProductCard";
import "./App.css";

function App() {
  // Products
  const [products, setProducts] = useState([]);

  // Loading & Error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Form fields
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");

  // Fetch products when page loads
  useEffect(() => {
    fetchProducts();
  }, []);

  // GET Products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();

      setProducts(data.products);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // POST Product
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            price: Number(price),
            description,
            category,
            stock: Number(stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create product"
        );
      }

      alert("Product created successfully");

      // Clear form
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");

      // Refresh products
      await fetchProducts();
    } catch (error) {
      setError(error.message);
    }
  };

  // Loading screen
  if (loading) {
    return (
      <div className="app">
        <h2>Loading products...</h2>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div className="app">
        <h2>Error: {error}</h2>

        <button onClick={fetchProducts}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="app">

      <h1>Codveda Products</h1>

      {/* Add Product */}
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) =>
            setCategory(e.target.value)
          }
        />

        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) =>
            setStock(e.target.value)
          }
        />

        <button type="submit">
          Add Product
        </button>

      </form>

      <hr />

      {/* Products */}
      <h2>Products</h2>

      <button onClick={fetchProducts}>
        Refresh Products
      </button>

      {products.length === 0 ? (
        <p>No products available.</p>
      ) : (
        products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))
      )}

    </div>
  );
}

export default App;
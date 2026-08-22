import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getProducts } from "../backend/api";

function Marketplace() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All");

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch((error) => alert(error.message));
  }, []);

  const addToCart = (product) => {
    const oldCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existing = oldCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existing) {
      updatedCart = oldCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              cartQuantity: item.cartQuantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...oldCart,
        {
          ...product,
          cartQuantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert(`${product.name} added to cart! 🛒`);

    navigate("/cart");
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      product.location
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" ||
      product.category === category;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="marketplace">

      <div className="market-header">

        <span className="small-title">
          FARMERS DIRECT MARKET
        </span>

        <h1>🌾 Fresh Produce Marketplace</h1>

        <p>
          Buy fresh products directly from local farmers.
        </p>

      </div>

      <div className="filters">

        <input
          type="text"
          placeholder="🔍 Search product or location..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All Categories</option>
          <option value="Vegetables">Vegetables</option>
          <option value="Fruits">Fruits</option>
          <option value="Grains">Grains</option>
        </select>

      </div>

      <div className="product-grid">

        {filteredProducts.map((product) => (

          <div
            className="product-card"
            key={product.id}
          >

            <div className="product-emoji">
              {product.emoji}
            </div>

            <h2>{product.name}</h2>

            <p>
              👨‍🌾 Farmer: {product.farmer}
            </p>

            <p>
              📍 {product.location}
            </p>

            <p>
              📦 Available: {product.quantity} kg
            </p>

            <h3>
              ₹{product.price} / kg
            </h3>

            {product.soldOut ? (

              <button
                disabled
                style={{
                  background: "#999",
                  cursor: "not-allowed",
                }}
              >
                🚫 Sold Out
              </button>

            ) : (

              <button
                onClick={() => addToCart(product)}
              >
                🛒 Add to Cart
              </button>

            )}

          </div>

        ))}

      </div>

    </div>
  );
}

export default Marketplace;
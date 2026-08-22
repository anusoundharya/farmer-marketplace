import { Link, useNavigate } from "react-router-dom";

function Cart() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);

    localStorage.setItem("cart", JSON.stringify(updatedCart));

    window.location.reload();
  };

  return (
    <div className="cart-page">

      <div className="page-heading">
        <span>YOUR SHOPPING BAG</span>
        <h1>🛒 My Cart</h1>
        <p>Fresh products selected directly from local farmers.</p>
      </div>

      {cart.length === 0 ? (

        <div className="empty-cart">
          <div className="empty-icon">🛒</div>

          <h2>Your cart is empty</h2>

          <p>
            Discover fresh produce from farmers near you.
          </p>

          <Link to="/marketplace" className="shop-btn">
            🌾 Continue Shopping
          </Link>
        </div>

      ) : (

        <div className="cart-layout">

          <div className="cart-products">

            {cart.map((item) => (

              <div className="cart-product" key={item.id}>

                <div className="cart-product-image">
                  {item.emoji}
                </div>

                <div className="cart-product-info">

                  <span>{item.category}</span>

                  <h2>{item.name}</h2>

                  <p>👨‍🌾 {item.farmer}</p>

                  <p>📍 {item.location}</p>

                  <div className="cart-price">
                    ₹{item.price} / kg
                  </div>

                </div>

                <div className="cart-quantity">
                  <span>Quantity</span>
                  <strong>{item.cartQuantity} kg</strong>
                </div>

                <div className="cart-item-total">
                  <strong>
                    ₹{item.price * item.cartQuantity}
                  </strong>

                  <button
                    onClick={() => removeItem(item.id)}
                  >
                    🗑️ Remove
                  </button>
                </div>

              </div>

            ))}

          </div>

          <div className="cart-summary">

            <h2>Order Summary</h2>

            <div className="summary-row">
              <span>Products</span>
              <span>{cart.length}</span>
            </div>

            <div className="summary-row">
              <span>Delivery</span>
              <span>Free</span>
            </div>

            <hr />

            <div className="summary-total">
              <span>Total</span>
              <strong>₹{total}</strong>
            </div>

            <button
              className="checkout-btn"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout →
            </button>

            <Link
              to="/marketplace"
              className="continue-shopping"
            >
              ← Continue Shopping
            </Link>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;
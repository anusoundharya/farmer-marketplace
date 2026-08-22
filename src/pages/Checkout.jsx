import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createOrder } from "../backend/api";

function Checkout() {
  const navigate = useNavigate();

  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.cartQuantity,
    0
  );

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
    payment: "Cash on Delivery",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const placeOrder = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.pincode
    ) {
      alert("Please fill all delivery details.");
      return;
    }

    try {
      await createOrder({ ...formData, products: cart });
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch (error) {
      alert(error.message);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-page">
        <div className="checkout-card">
          <h1>🛒 Your Cart is Empty</h1>

          <p style={{ textAlign: "center", marginBottom: "25px" }}>
            Please add some fresh products before checkout.
          </p>

          <button onClick={() => navigate("/marketplace")}>
            🌾 Go to Marketplace
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">

      <div className="checkout-card">

        <h1>🛍️ Checkout</h1>

        <p style={{ textAlign: "center", color: "#687269", marginBottom: "25px" }}>
          Complete your delivery details
        </p>

        <form onSubmit={placeOrder}>

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
          />

          <label>Phone Number</label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={formData.phone}
            onChange={handleChange}
          />

          <label>Delivery Address</label>

          <textarea
            name="address"
            placeholder="Enter your complete address"
            value={formData.address}
            onChange={handleChange}
          />

          <label>City</label>

          <input
            type="text"
            name="city"
            placeholder="Enter your city"
            value={formData.city}
            onChange={handleChange}
          />

          <label>PIN Code</label>

          <input
            type="text"
            name="pincode"
            placeholder="Enter PIN code"
            value={formData.pincode}
            onChange={handleChange}
          />

          <label>Payment Method</label>

          <select
            name="payment"
            value={formData.payment}
            onChange={handleChange}
          >
            <option value="Cash on Delivery">
              💵 Cash on Delivery
            </option>

            <option value="UPI">
              📱 UPI
            </option>

            <option value="Card">
              💳 Credit / Debit Card
            </option>
          </select>

          <div className="checkout-total">

            <span>Order Total</span>

            <strong>
              ₹{total}
            </strong>

          </div>

          <button type="submit">
            ✅ Place Order
          </button>

        </form>

      </div>

    </div>
  );
}

export default Checkout;
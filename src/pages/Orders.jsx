import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrders } from "../backend/api";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((error) => alert(error.message));
  }, []);

  return (
    <div className="orders-page">

      <div className="page-heading">
        <span>YOUR PURCHASES</span>
        <h1>📦 My Orders</h1>
        <p>
          Track your fresh produce orders from local farmers.
        </p>
      </div>

      {orders.length === 0 ? (

        <div className="empty-cart">

          <div className="empty-icon">
            📦
          </div>

          <h2>No Orders Yet</h2>

          <p>
            You haven't placed any orders yet.
          </p>

          <Link
            to="/marketplace"
            className="shop-btn"
          >
            🌾 Start Shopping
          </Link>

        </div>

      ) : (

        <div className="orders-list">

          {orders
            .slice()
            .reverse()
            .map((order) => (

              <div
                className="order-card"
                key={order.id}
              >

                {/* Order Header */}

                <div className="order-top">

                  <div>
                    <h3>
                      Order #{order.id}
                    </h3>

                    <p>
                      📅 {order.date}
                    </p>
                  </div>

                  <span className="order-status">
                    ✓ {order.status}
                  </span>

                </div>


                {/* Products */}

                {order.products &&
                  order.products.map((product) => (

                    <div
                      className="order-product"
                      key={product.id}
                    >

                      <div className="order-emoji">
                        {product.emoji || "🥕"}
                      </div>

                      <div>

                        <h3>
                          {product.name}
                        </h3>

                        <p>
                          Quantity:{" "}
                          {product.cartQuantity || 1} kg
                        </p>

                        <p>
                          ₹{product.price} / kg
                        </p>

                      </div>

                      <strong>
                        ₹
                        {product.price *
                          (product.cartQuantity || 1)}
                      </strong>

                    </div>

                  ))}


                {/* Order Total */}

                <div className="order-bottom">

                  <span>
                    Total Amount
                  </span>

                  <strong>
                    ₹{order.total}
                  </strong>

                </div>


                {/* Delivery */}

                <div className="tracking">

                  <h3>
                    🚚 Delivery Tracking
                  </h3>

                  <div className="tracking-line">

                    <div className="active">
                      <span>✓</span>
                      <p>Order Placed</p>
                    </div>

                    <div>
                      <span>○</span>
                      <p>Confirmed</p>
                    </div>

                    <div>
                      <span>○</span>
                      <p>Out for Delivery</p>
                    </div>

                    <div>
                      <span>○</span>
                      <p>Delivered</p>
                    </div>

                  </div>

                </div>

              </div>

            ))}

        </div>

      )}

    </div>
  );
}

export default Orders;
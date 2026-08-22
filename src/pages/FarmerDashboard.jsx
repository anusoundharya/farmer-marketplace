import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteProduct as removeProduct, getProducts, updateProduct } from "../backend/api";

function FarmerDashboard() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const farmer = JSON.parse(localStorage.getItem("currentFarmer") || "null");
    getProducts()
      .then((items) => setProducts(items.filter((item) => item.farmerId === farmer?.id)))
      .catch((error) => alert(error.message));
  });

  const deleteProduct = (id) => {
    removeProduct(id)
      .then(() => setProducts(products.filter((product) => product.id !== id)))
      .then(() => alert("🗑️ Product deleted successfully!"))
      .catch((error) => alert(error.message));
  };

  const markSoldOut = (id) => {
    updateProduct(id, { soldOut: true })
      .then(() => setProducts(products.map((product) => product.id === id ? { ...product, soldOut: true } : product)))
      .then(() => alert("🚫 Product marked as sold out!"))
      .catch((error) => alert(error.message));
  };

  const logout = () => {
    localStorage.removeItem("farmerLoggedIn");
    navigate("/farmer-login");
  };

  const availableProducts = products.filter(
    (product) => !product.soldOut
  ).length;

  const soldProducts = products.filter(
    (product) => product.soldOut
  ).length;

  return (
    <div className="farmer-dashboard">

      {/* TOP NAVBAR */}

      <header className="farmer-topbar">

        <div className="brand">

          <div className="brand-logo">
            🌿
          </div>

          <div>
            <h2>FarmDirect</h2>
            <span>Farmer Portal</span>
          </div>

        </div>

        <div className="farmer-user">

          <div className="user-avatar">
            👨‍🌾
          </div>

          <div className="user-info">
            <strong>Farmer</strong>
            <span>Seller Account</span>
          </div>

          <button
            onClick={logout}
            className="dashboard-logout"
          >
            Logout
          </button>

        </div>

      </header>


      {/* MAIN CONTENT */}

      <main className="farmer-main">

        {/* WELCOME BANNER */}

        <section className="welcome-banner">

          <div className="welcome-content">

            <span className="welcome-tag">
              🌱 FARMER DASHBOARD
            </span>

            <h1>
              Welcome back, Farmer! 👋
            </h1>

            <p>
              Manage your fresh produce and connect
              directly with customers.
            </p>

            <Link
              to="/add-produce"
              className="main-add-btn"
            >
              <span>＋</span>
              Add New Produce
            </Link>

          </div>

          <div className="welcome-illustration">
            🌾
          </div>

        </section>


        {/* STATISTICS */}

        <section className="dashboard-stats">

          <div className="dashboard-stat-card">

            <div className="stat-icon green">
              🌾
            </div>

            <div>
              <span>Total Products</span>
              <h2>{products.length}</h2>
              <small>Listed products</small>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon blue">
              📦
            </div>

            <div>
              <span>Available</span>
              <h2>{availableProducts}</h2>
              <small>Ready for sale</small>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon orange">
              🚜
            </div>

            <div>
              <span>Sold Out</span>
              <h2>{soldProducts}</h2>
              <small>Completed listings</small>
            </div>

          </div>


          <div className="dashboard-stat-card">

            <div className="stat-icon purple">
              💰
            </div>

            <div>
              <span>Total Sales</span>
              <h2>₹0</h2>
              <small>Sales summary</small>
            </div>

          </div>

        </section>


        {/* PRODUCTS HEADER */}

        <section className="products-section">

          <div className="products-section-header">

            <div>
              <span className="section-label">
                YOUR FARM
              </span>

              <h2>My Products 🌱</h2>

              <p>
                Manage the products you have listed.
              </p>
            </div>

            <Link
              to="/add-produce"
              className="small-add-btn"
            >
              ＋ Add Product
            </Link>

          </div>


          {/* NO PRODUCTS */}

          {products.length === 0 ? (

            <div className="empty-products">

              <div className="empty-emoji">
                🌱
              </div>

              <h2>
                Your farm is waiting!
              </h2>

              <p>
                Add your first fresh produce and
                start selling directly to customers.
              </p>

              <Link
                to="/add-produce"
                className="empty-product-btn"
              >
                🌾 Add Your First Product
              </Link>

            </div>

          ) : (

            <div className="dashboard-product-grid">

              {products.map((product) => (

                <div
                  className="dashboard-product-card"
                  key={product.id}
                >

                  <div className="product-image-area">

                    <span className="product-big-emoji">
                      {product.emoji || "🌾"}
                    </span>

                    {product.soldOut ? (
                      <span className="status-badge sold">
                        SOLD OUT
                      </span>
                    ) : (
                      <span className="status-badge available">
                        AVAILABLE
                      </span>
                    )}

                  </div>


                  <div className="product-card-content">

                    <span className="product-category">
                      {product.category}
                    </span>

                    <h3>
                      {product.name}
                    </h3>

                    <p className="product-location">
                      📍 {product.location}
                    </p>

                    <div className="product-details">

                      <div>
                        <span>Quantity</span>
                        <strong>
                          {product.quantity} kg
                        </strong>
                      </div>

                      <div>
                        <span>Price</span>
                        <strong>
                          ₹{product.price}/kg
                        </strong>
                      </div>

                    </div>


                    {!product.soldOut && (

                      <button
                        onClick={() =>
                          markSoldOut(product.id)
                        }
                        className="sold-product-btn"
                      >
                        ✓ Mark Sold Out
                      </button>

                    )}


                    {product.soldOut && (

                      <div className="already-sold">
                        🚫 This product is sold out
                      </div>

                    )}


                    <button
                      onClick={() =>
                        deleteProduct(product.id)
                      }
                      className="delete-product-btn"
                    >
                      🗑 Delete Product
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* QUICK ACTIONS */}

        <section className="quick-section">

          <div className="section-label">
            QUICK ACTIONS
          </div>

          <h2>Manage Your Farm</h2>

          <div className="quick-actions">

            <Link
              to="/add-produce"
              className="quick-card"
            >
              <span>🌱</span>
              <div>
                <h3>Add Produce</h3>
                <p>List a new product</p>
              </div>
              <b>→</b>
            </Link>


            <Link
              to="/marketplace"
              className="quick-card"
            >
              <span>🛒</span>
              <div>
                <h3>View Marketplace</h3>
                <p>See your products</p>
              </div>
              <b>→</b>
            </Link>


            <Link
              to="/orders"
              className="quick-card"
            >
              <span>📦</span>
              <div>
                <h3>Orders</h3>
                <p>Manage customer orders</p>
              </div>
              <b>→</b>
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default FarmerDashboard;
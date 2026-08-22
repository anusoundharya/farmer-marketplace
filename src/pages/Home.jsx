import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home">

      <nav className="navbar">
        <Link to="/" className="logo">
          🌾 <span>Agri</span>Direct
        </Link>

        <div className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/orders">Orders</Link>
          <Link to="/cart">🛒 Cart</Link>
          <Link to="/login" className="login-btn">
            Login
          </Link>
        </div>
      </nav>



      {/* Hero */}
      <section className="hero">
        <div className="hero-content">

          <div className="small-title">
            🌱 FARM FRESH • DIRECT TO YOU
          </div>

          <h1>
            Fresh Produce
            <br />
            <span>From Local Farmers</span>
          </h1>

          <p>
            Discover fresh vegetables, fruits and grains directly
            from farmers near you. Fair prices, fresh produce,
            and a better future for farming.
          </p>

          <div className="hero-buttons">
            <Link to="/marketplace" className="btn primary">
              🛒 Explore Marketplace
            </Link>

            <Link to="/register" className="btn secondary">
              👨‍🌾 Sell Your Produce
            </Link>
          </div>

          <div className="hero-stats">
            <div>
              <strong>500+</strong>
              <span>Farmers</span>
            </div>

            <div>
              <strong>1K+</strong>
              <span>Products</span>
            </div>

            <div>
              <strong>2K+</strong>
              <span>Customers</span>
            </div>
          </div>

        </div>

        <div className="hero-visual">
          <div className="circle-bg"></div>

          <div className="farmer-emoji">
            👨‍🌾
          </div>

          <div className="floating-card card-one">
            🥕 Fresh Vegetables
          </div>

          <div className="floating-card card-two">
            ⭐ 4.9 Rating
          </div>

          <div className="floating-card card-three">
            📍 Local Farmers
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features">

        <div className="section-heading">
          <span>WHY AGRIDIRECT?</span>
          <h2>Better for Farmers. Better for You.</h2>
          <p>
            We connect farmers and customers directly for a
            simple and transparent marketplace experience.
          </p>
        </div>

        <div className="feature-grid">

          <div className="feature-card">
            <div className="feature-icon">👨‍🌾</div>
            <h3>Direct From Farmers</h3>
            <p>
              Connect directly with local farmers and support
              their livelihood.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Fair & Transparent Prices</h3>
            <p>
              Farmers set their own prices and customers get
              transparent pricing.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🥬</div>
            <h3>Fresh Produce</h3>
            <p>
              Find fresh vegetables, fruits and grains from
              nearby farms.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🚚</div>
            <h3>Easy Ordering</h3>
            <p>
              Browse, add to cart and place your order in
              just a few clicks.
            </p>
          </div>

        </div>
      </section>

      {/* Categories */}
      <section className="categories">

        <div className="section-heading">
          <span>SHOP BY CATEGORY</span>
          <h2>Fresh From the Farm</h2>
        </div>

        <div className="category-grid">

          <Link to="/marketplace" className="category-card">
            <div>🥕</div>
            <h3>Vegetables</h3>
            <p>Fresh & organic vegetables</p>
          </Link>

          <Link to="/marketplace" className="category-card">
            <div>🍎</div>
            <h3>Fruits</h3>
            <p>Fresh seasonal fruits</p>
          </Link>

          <Link to="/marketplace" className="category-card">
            <div>🌾</div>
            <h3>Grains</h3>
            <p>Quality grains & rice</p>
          </Link>

          <Link to="/marketplace" className="category-card">
            <div>🥥</div>
            <h3>Other Crops</h3>
            <p>Farm fresh products</p>
          </Link>

        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <div>
          <span>🌱 GROW TOGETHER</span>
          <h2>Are You a Farmer?</h2>
          <p>
            List your fresh produce and reach customers
            directly through AgriDirect.
          </p>
        </div>

        <Link to="/register" className="btn cta-btn">
          Start Selling →
        </Link>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-logo">
          🌾 AgriDirect
        </div>

        <p>
          Connecting farmers with customers for a fresher,
          fairer future.
        </p>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/marketplace">Marketplace</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>

        <div className="footer-bottom">
          © 2026 AgriDirect. All rights reserved.
        </div>
      </footer>

    </div>
  );
}

export default Home;
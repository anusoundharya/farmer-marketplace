import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../backend/api";

function FarmerLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      const { token, user } = await loginUser({ email, password, role: "farmer" });
      const authenticatedUser = { ...user, token };
      localStorage.setItem("currentUser", JSON.stringify(authenticatedUser));
      localStorage.setItem("currentFarmer", JSON.stringify(authenticatedUser));
      localStorage.setItem("farmerLoggedIn", "true");
      alert("🌱 Login successful!");
      navigate("/farmer-dashboard");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="farmer-login-page">

      {/* LEFT SIDE */}

      <div className="farmer-login-left">

        <div className="login-brand">
          🌿 FarmDirect
        </div>

        <div className="farmer-illustration">
          🌾
        </div>

        <h1>
          Grow Your Farm.
          <br />
          Reach More Customers.
        </h1>

        <p>
          Sell your fresh produce directly to
          customers and grow your farm business
          with FarmDirect.
        </p>

        <div className="login-features">

          <div>
            <span>🌱</span>
            <p>Sell Fresh Produce</p>
          </div>

          <div>
            <span>💰</span>
            <p>Set Your Own Price</p>
          </div>

          <div>
            <span>🤝</span>
            <p>Connect Directly</p>
          </div>

        </div>

      </div>


      {/* RIGHT SIDE */}

      <div className="farmer-login-right">

        <div className="farmer-login-card">

          <div className="login-icon">
            👨‍🌾
          </div>

          <span className="login-label">
            FARMER PORTAL
          </span>

          <h2>
            Welcome Back! 👋
          </h2>

          <p className="login-subtitle">
            Login to manage your farm
          </p>


          <form onSubmit={handleLogin}>

            <div className="login-form-group">

              <label>
                📧 Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>


            <div className="login-form-group">

              <label>
                🔒 Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

            </div>


            <button
              type="submit"
              className="farmer-login-btn"
            >
              Login as Farmer
              <span>→</span>
            </button>

          </form>


          <div className="login-divider">
            <span>New to FarmDirect?</span>
          </div>


          <button
            className="farmer-register-btn"
            onClick={() => navigate("/register")}
          >
            🌱 Create Farmer Account
          </button>


          <button
            className="back-home-btn"
            onClick={() => navigate("/")}
          >
            ← Back to Home
          </button>

        </div>

      </div>

    </div>
  );
}

export default FarmerLogin;
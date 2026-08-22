import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../backend/api";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password
    ) {
      alert("Please fill all fields");
      return;
    }

    if (form.password.length < 4) {
      alert("Password must contain at least 4 characters");
      return;
    }

    try {
      await registerUser(form);
      alert("🎉 Registration successful!");
      navigate(form.role === "farmer" ? "/farmer-login" : "/login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-icon">
          🌱
        </div>

        <h1>Create Account</h1>

        <p>
          Join Farmers' Direct Marketplace
        </p>

        <form onSubmit={handleRegister}>

          {/* NAME */}

          <label>Full Name</label>

          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={form.name}
            onChange={handleChange}
          />


          {/* EMAIL */}

          <label>Email</label>

          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={form.email}
            onChange={handleChange}
          />


          {/* PHONE */}

          <label>Phone Number</label>

          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={form.phone}
            onChange={handleChange}
          />


          {/* PASSWORD */}

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange}
          />


          {/* ROLE */}

          <label>Register As</label>

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
          >
            <option value="customer">
              🛒 Customer
            </option>

            <option value="farmer">
              👨‍🌾 Farmer
            </option>
          </select>


          {/* REGISTER */}

          <button
            type="submit"
            className="register-btn"
          >
            Create Account →
          </button>

        </form>


        <div className="register-footer">

          <p>
            Already have an account?
          </p>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="login-link"
          >
            Login
          </button>

        </div>

      </div>

    </div>
  );
}

export default Register;
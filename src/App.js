import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Marketplace from "./pages/Marketplace";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerLogin from "./pages/FarmerLogin";
import FarmerDashboard from "./pages/FarmerDashboard";
import AddProduce from "./pages/AddProduce";
import Checkout from "./pages/Checkout";

import "./App.css";

const basename = process.env.PUBLIC_URL || "/farmer-marketplace";

function App() {
  return (
    <BrowserRouter basename={basename}>

      <Routes>

        {/* CUSTOMER */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/marketplace"
          element={<Marketplace />}
        />

        <Route
          path="/orders"
          element={<Orders />}
        />

        <Route
          path="/cart"
          element={<Cart />}
        />

        <Route
          path="/checkout"
          element={<Checkout />}
        />

        <Route
          path="/login"
          element={<Login />}
        />
        <Route
  path="/register"
  element={<Register />}
/>

        {/* FARMER */}

        <Route
          path="/farmer-login"
          element={<FarmerLogin />}
        />

        <Route
          path="/farmer-dashboard"
          element={<FarmerDashboard />}
        />

        <Route
          path="/add-produce"
          element={<AddProduce />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
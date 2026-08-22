import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addProduct } from "../backend/api";

function AddProduce() {

  const navigate = useNavigate();

  const [product, setProduct] = useState({
    farmer: "",
    name: "",
    category: "Vegetables",
    emoji: "🍅",
    quantity: "",
    price: "",
    location: "",
  });

  useEffect(() => {

    const loggedIn =
      localStorage.getItem("farmerLoggedIn");

    if (loggedIn !== "true") {

      alert("Please login as a farmer first!");

      navigate("/farmer-login");
    }

  }, [navigate]);


  const handleChange = (e) => {

    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });

  };


  const submitProduct = async (e) => {

    e.preventDefault();

    if (
      !product.farmer ||
      !product.name ||
      !product.quantity ||
      !product.price ||
      !product.location
    ) {

      alert("Please fill all fields!");

      return;
    }


    try {
      const farmer = JSON.parse(localStorage.getItem("currentFarmer") || "null");
      await addProduct({ ...product, farmerId: farmer?.id, quantity: Number(product.quantity), price: Number(product.price) });
      alert("🌱 Product added successfully!");
      navigate("/farmer-dashboard");
    } catch (error) {
      alert(error.message);
    }

  };


  return (

    <div className="add-produce-page">

      {/* TOP HEADER */}

      <div className="add-produce-header">

        <button
          onClick={() =>
            navigate("/farmer-dashboard")
          }
          className="back-btn"
        >
          ← Dashboard
        </button>

        <div className="add-header-title">

          <span>🌿 FARM DIRECT</span>

          <h1>Add New Produce</h1>

          <p>
            List your fresh farm products
            for customers.
          </p>

        </div>

      </div>


      {/* FORM AREA */}

      <div className="add-produce-container">

        <div className="add-produce-card">

          <div className="form-heading">

            <div className="form-icon">
              🌾
            </div>

            <div>

              <h2>Product Information</h2>

              <p>
                Enter the details of your
                agricultural product.
              </p>

            </div>

          </div>


          <form onSubmit={submitProduct}>

            {/* FARMER NAME */}

            <div className="form-group">

              <label>
                👨‍🌾 Farmer Name
              </label>

              <input
                type="text"
                name="farmer"
                placeholder="Enter farmer name"
                value={product.farmer}
                onChange={handleChange}
              />

            </div>


            {/* PRODUCT NAME */}

            <div className="form-group">

              <label>
                🌱 Product Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Example: Tomato"
                value={product.name}
                onChange={handleChange}
              />

            </div>


            {/* CATEGORY */}

            <div className="form-group">

              <label>
                🏷️ Category
              </label>

              <select
                name="category"
                value={product.category}
                onChange={handleChange}
              >

                <option value="Vegetables">
                  Vegetables
                </option>

                <option value="Fruits">
                  Fruits
                </option>

                <option value="Grains">
                  Grains
                </option>

                <option value="Other Crops">
                  Other Crops
                </option>

              </select>

            </div>


            {/* PRODUCT EMOJI */}

            <div className="form-group">

              <label>
                🍎 Product Icon
              </label>

              <select
                name="emoji"
                value={product.emoji}
                onChange={handleChange}
              >

                <option value="🍅">
                  🍅 Tomato
                </option>

                <option value="🥕">
                  🥕 Carrot
                </option>

                <option value="🥔">
                  🥔 Potato
                </option>

                <option value="🧅">
                  🧅 Onion
                </option>

                <option value="🌶️">
                  🌶️ Chilli
                </option>

                <option value="🥬">
                  🥬 Spinach
                </option>

                <option value="🍎">
                  🍎 Apple
                </option>

                <option value="🍌">
                  🍌 Banana
                </option>

                <option value="🥭">
                  🥭 Mango
                </option>

                <option value="🍊">
                  🍊 Orange
                </option>

                <option value="🌾">
                  🌾 Rice
                </option>

                <option value="🥥">
                  🥥 Coconut
                </option>

              </select>

            </div>


            {/* TWO COLUMN */}

            <div className="form-row">

              {/* QUANTITY */}

              <div className="form-group">

                <label>
                  📦 Quantity (kg)
                </label>

                <input
                  type="number"
                  name="quantity"
                  placeholder="50"
                  min="1"
                  value={product.quantity}
                  onChange={handleChange}
                />

              </div>


              {/* PRICE */}

              <div className="form-group">

                <label>
                  💰 Price per kg (₹)
                </label>

                <input
                  type="number"
                  name="price"
                  placeholder="40"
                  min="1"
                  value={product.price}
                  onChange={handleChange}
                />

              </div>

            </div>


            {/* LOCATION */}

            <div className="form-group">

              <label>
                📍 Farm Location
              </label>

              <input
                type="text"
                name="location"
                placeholder="Example: Salem, Tamil Nadu"
                value={product.location}
                onChange={handleChange}
              />

            </div>


            {/* PREVIEW */}

            <div className="product-preview">

              <div className="preview-icon">
                {product.emoji}
              </div>

              <div>

                <span>
                  PRODUCT PREVIEW
                </span>

                <h3>
                  {product.name ||
                    "Your Product"}
                </h3>

                <p>
                  📍{" "}
                  {product.location ||
                    "Farm Location"}
                </p>

              </div>

              <strong>
                ₹{product.price || "0"}/kg
              </strong>

            </div>


            {/* BUTTONS */}

            <div className="form-buttons">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  navigate("/farmer-dashboard")
                }
              >
                Cancel
              </button>

              <button
                type="submit"
                className="add-submit-btn"
              >
                🌱 Add Produce
              </button>

            </div>

          </form>

        </div>


        {/* RIGHT SIDE INFO */}

        <div className="produce-info">

          <div className="info-image">
            🌾
          </div>

          <h2>
            Sell Fresh.
            <br />
            Sell Direct.
          </h2>

          <p>
            Connect directly with customers
            and showcase your fresh farm
            produce.
          </p>


          <div className="info-item">

            <span>🌱</span>

            <div>
              <strong>
                Fresh Produce
              </strong>

              <p>
                List products directly
                from your farm.
              </p>
            </div>

          </div>


          <div className="info-item">

            <span>💰</span>

            <div>
              <strong>
                Fair Pricing
              </strong>

              <p>
                Set your own price
                for your products.
              </p>
            </div>

          </div>


          <div className="info-item">

            <span>🤝</span>

            <div>
              <strong>
                Direct Customers
              </strong>

              <p>
                Sell without unnecessary
                intermediaries.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>

  );
}

export default AddProduce;
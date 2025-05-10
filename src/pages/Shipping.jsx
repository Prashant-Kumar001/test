import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBackCircle } from "react-icons/io5";
import { motion } from "framer-motion";
import { cities, state as states, countries } from "../../india.js";
import { useDispatch, useSelector } from "react-redux";

import toast from "react-hot-toast";

import { saveShippingInfo } from "../redux/reducer/product.reducer.js";
import axios from "axios";

const Shipping = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    address: "",
    state: "",
    city: "",
    country: "India",
    pinCode: "",
  });

  const { grandTotal, cart } = useSelector((state) => state.product);

  const [filteredCities, setFilteredCities] = useState([]);

 

  useEffect(() => {
    if (formData.state) {
      const matchingCities = cities.filter(
        (city) => city.admin_name === formData.state
      );
      setFilteredCities(matchingCities);
      if (!matchingCities.some((city) => city.city === formData.city)) {
        setFormData((prev) => ({ ...prev, city: "" }));
      }
    } else {
      setFilteredCities([]);
      setFormData((prev) => ({ ...prev, city: "" }));
    }
  }, [formData.state, formData.city]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    dispatch(saveShippingInfo(formData));

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/api/v1/payment/create`,
        {
          amount: grandTotal,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (data && data.client_secret) {
        navigate("/pay", { state: data.client_secret });
      } else {
        toast.error("Payment failed. Please try again.");
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Failed to create payment intent.");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gray-100">
      <div className="max-w-3xl w-full">
        <motion.button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-800 transition-colors"
        >
          <IoArrowBackCircle
            size={32}
            className="hover:-translate-x-1 hover:text-purple-600 transition-transform duration-300"
          />
          <span className="ml-2 font-medium">Back</span>
        </motion.button>

        <motion.div
          className="rounded-2xl shadow-xl bg-white p-6 md:p-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Shipping Address
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                name="address"
                placeholder="123 Main St"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select State</option>
                  {states.map((state, index) => (
                    <option key={index} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  disabled={!formData.state}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white"
                >
                  <option value="">
                    {formData.state ? "Select City" : "Select State First"}
                  </option>
                  {filteredCities.map((item, index) => (
                    <option key={index} value={item.city}>
                      {item.city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white"
                >
                  <option value="">Select Country</option>
                  {countries.map((country, index) => (
                    <option key={index} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ZIP Code
              </label>
              <input
                type="text"
                name="pinCode"
                placeholder="10001"
                value={formData.pinCode}
                onChange={handleChange}
                required
                pattern="[0-9]{5,6}"
                title="Enter a valid ZIP code (5-6 digits)"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 bg-gray-50 hover:bg-white"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold focus:ring-4 focus:ring-purple-200 transition-all duration-300 shadow-md 
    ${
      isLoading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700"
    }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Proceed to Payment"
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default Shipping;

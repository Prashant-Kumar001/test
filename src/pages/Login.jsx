import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { auth } from "../config/firebase";
import Loader from "../components/Loader";
import { useLoginMutation } from "../redux/api/user.api";
import { loginSuccess, loginFailure } from "../redux/reducer/user.reducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [login] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "gender") setGender(value);
    if (name === "dob") setDob(value);
  };

  const loginHandler = async (e) => {
    e.preventDefault();

    if (!gender || !dob) {
      toast.error("All fields are required");
      return;
    }

    setLoader(true);

    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      const res = await login({
        id: user.uid,
        username: user.displayName,
        email: user.email,
        photo: user.photoURL,
        gender,
        dob,
      }).unwrap();

      if (res?.success) {
        toast.success("Login successful");
        dispatch(loginSuccess(res?.user?.user));
        navigate("/");
      } else {
        toast.error(res?.message || "Login failed");
        dispatch(loginFailure());
      }
    } catch (error) {
      toast.error("Login failed, try again");
      dispatch(loginFailure());
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 relative">
      {loader && (
        <div className="absolute inset-0 bg-black opacity-50 flex items-center justify-center z-10">
          <Loader />
        </div>
      )}

      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white rounded-2xl shadow-lg overflow-hidden relative z-0">
        {/* Left section */}
        <div className="flex flex-col justify-center items-start p-8 bg-gray-50">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Login Now</h2>
          <p className="text-gray-600">
            Sign in with Google and provide your details to get started.
          </p>
        </div>

        {/* Right section (form) */}
        <div className="p-8">
          <form className="space-y-6" onSubmit={loginHandler}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                name="gender"
                value={gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option disabled value="">
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth
              </label>
              <input
                name="dob"
                type="date"
                value={dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your date of birth"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg shadow-sm hover:bg-gray-50 transition duration-150"
            >
              <FcGoogle size={20} /> Sign in with Google
            </button>

            <p className="text-center text-sm text-gray-500">
              Already have an account? Sign in with Google again.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;

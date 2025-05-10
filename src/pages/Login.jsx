import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { auth } from "../config/firebase";
import { NewLoader } from "../components/Loader";
import { useLoginMutation } from "../redux/api/user.api";
import { loginSuccess, loginFailure } from "../redux/reducer/user.reducer";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Login = ({ user }) => {
    const [dob, setDate] = React.useState("");
    const [gender, setGender] = React.useState("");
    const [login] = useLoginMutation();
    const navigate = useNavigate();
    const dispatch = useDispatch()
    const [loader, setLoader] = React.useState(false);

    const handleChange = (e) => {
        if (e.target.name === "gender") {
            setGender(e.target.value);
        }
        if (e.target.name === "dob") {
            setDate(e.target.value);
        }
    };

    const loginHandler = async (e) => {
        if(!gender || !dob){
            toast.error("All fields are required");
            return
        }
        setLoader(true);
        e.preventDefault();
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
            dispatch(loginSuccess(res?.user?.user))

            navigate("/");
        } catch (error) {
            toast.error("error failed try again");
            loginFailure();
        } finally {
            setLoader(false);
        }
    };

    return (
        <div className="hero bg-base-200 font-montserrat height">
            {loader && <NewLoader />}
            <div className="hero-content flex-col lg:flex-row-reverse">
                <div className="text-center lg:text-left">
                    <h1 className="text-5xl font-bold">Login now!</h1>
                    <p className="py-6">
                        Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
                        excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
                        a id nisi.
                    </p>
                </div>
                <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
                    <div className="card-body">
                        <fieldset className="fieldset">
                            <label className="fieldset-label">Gender</label>
                            <select
                                onChange={handleChange}
                                name="gender"
                                id=""
                                className="border rounded px-4 py-2 outline-none focus:ring-gray-900 focus:ring-1 focus:border-gray-900"
                            >
                                <option  disabled value="">
                                    select{" "}
                                </option>
                                <option value="male">male</option>
                                <option value="female">female</option>
                                <option value="other">other</option>
                            </select>
                            <label className="fieldset-label">Data</label>
                            <input
                                onChange={handleChange}
                                name="dob"
                                type="date"
                                className="border rounded px-4 py-2 outline-none focus:ring-gray-900 focus:ring-1 focus:border-gray-900"
                                placeholder="enter your date of birth"
                            />
                            <p className="text-center ">already have an account?</p>
                            <button
                                type="submit"
                                onClick={loginHandler}
                                className="btn btn-soft mt-2"
                            >
                                {" "}
                                <FcGoogle size={20} /> sign in with google{" "}
                            </button>
                        </fieldset>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

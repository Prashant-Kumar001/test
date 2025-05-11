import React, { useState, useEffect } from "react";
import {
    AiOutlineSearch,
    AiOutlineShoppingCart,
    AiOutlineMenu,
} from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { IoLogOut, IoLogIn } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { logout } from "../redux/reducer/user.reducer";
import toast from "react-hot-toast";
import { AiOutlineDashboard } from "react-icons/ai";


const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isFetching: loader } = useSelector((state) => state.user);
    const { cart: cartItems } = useSelector((state) => state.product);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setMenuOpen(false);
                setProfileOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const logoutHandler = async () => {
        try {
            await signOut(auth);
            dispatch(logout());
            toast.success("Logged out successfully!", { position: "top-left" });
            navigate("/");
        } catch (error) {
            toast.error("Logout failed. Try again.", { position: "top-left" });
        }
        setMenuOpen(false);
        setProfileOpen(false);
    };



    const handleCartClick = () => {
        if (cartItems?.length === 0) {
            alert("you don't have any items in your cart");
        }
        navigate("/cart");
    };

    return (
        <header className="bg-white sticky top-0 z-50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="text-2xl font-bold text-cyan-500">BrandLogo</Link>

                    <button
                        className="md:hidden text-gray-600 hover:text-gray-800"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle menu"
                    >
                        <AiOutlineMenu size={24} />
                    </button>

                    <nav
                        className={`absolute md:static top-16 left-0 w-full md:w-auto bg-white md:bg-transparent z-40 md:flex md:items-center transition-all duration-300 ease-in-out ${menuOpen ? "block shadow-md" : "hidden md:block"
                            }`}
                    >
                        <ul className="flex flex-col md:flex-row items-center gap-4 md:gap-6 p-4 md:p-0 text-gray-700 font-medium">
                            <li>
                                <Link to="/" onClick={() => setMenuOpen(false)} className="hover:text-cyan-500">Home</Link>
                            </li>
                            <li>
                                <Link to="/search" onClick={() => setMenuOpen(false)} className="flex items-center gap-1 hover:text-cyan-500">
                                    <AiOutlineSearch size={18} />
                                    <span className="md:hidden">Search</span>
                                </Link>
                            </li>
                            <li className="relative">
                                <button
                                    onClick={handleCartClick}
                                    className="flex items-center gap-1 cursor-pointer hover:text-cyan-500"
                                >
                                    <AiOutlineShoppingCart size={18} />
                                    {
                                        cartItems?.length > 0 && (
                                            <span className="w-4 h-4 text-[12px] flex justify-center items-center bg-red-600 absolute top-[-9px] -right-2 text-amber-50 rounded-full">
                                                {cartItems?.length}
                                            </span>
                                        )
                                    }
                                    <span className="md:hidden">Cart</span>
                                </button>
                            </li>
                            {loader ? (
                                <li>
                                    <svg className="animate-spin h-5 w-5 text-cyan-500" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0..." />
                                    </svg>
                                </li>
                            ) : user ? (
                                <li className="relative">
                                    <button
                                        onClick={() => setProfileOpen(!profileOpen)}
                                        className="flex items-center gap-2 hover:text-cyan-500"
                                    >
                                        <FaUser size={18} />
                                    </button>

                                    <ul className={`absolute right-0  mt-2  bg-white rounded-lg shadow-lg py-3  z-50 ${profileOpen ? 'block' : 'hidden'}`}>
                                        <li>
                                            <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center px-4 py-2 hover:bg-cyan-50">
                                                <CgProfile className="text-gray-600" />
                                                <span className="ml-2">Profile</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="/orders" onClick={() => setProfileOpen(false)} className="flex items-center px-4 py-2 hover:bg-cyan-50">
                                                <AiOutlineShoppingCart className="text-gray-600" />
                                                <span className="ml-2">Orders</span>

                                            </Link>
                                        </li>
                                        {user?.role === "admin" && (
                                            <li>
                                                <Link to="/admin" onClick={() => setProfileOpen(false)} className="flex items-center px-4 py-2 hover:bg-cyan-50">
                                                    <AiOutlineDashboard />
                                                    <span className="ml-2">Dashboard</span>
                                                </Link>
                                            </li>
                                        )}
                                        <li>
                                            <button
                                                onClick={logoutHandler}
                                                className="w-full text-left px-4 py-2 flex items-center text-red-600 hover:bg-red-50"
                                            >
                                                <IoLogOut />
                                                <span className="ml-2">Logout</span>
                                            </button>
                                        </li>
                                    </ul>
                                </li>
                            ) : (
                                <li>
                                    <Link to="/login" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 hover:text-cyan-500">
                                        <IoLogIn size={18} />
                                        <span>Login</span>
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;

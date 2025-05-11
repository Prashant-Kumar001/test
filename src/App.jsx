import React, { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged } from "firebase/auth";

 

import Header from "./pages/Header";
import Footer from "./pages/Footer";
import Loader from "./components/Loader";
import { Protected } from "./components/Protected";


import { auth } from "./config/firebase";
import { loginSuccess, loginFailure } from "./redux/reducer/user.reducer";
import { getCurrentUser } from "./redux/api/user.api";


import LineChat from "./chart/LineChat";
import BarChart from "./chart/BarChart";


const Home = lazy(() => import("./pages/Home"));
const Cart = lazy(() => import("./pages/Cart"));
const Search = lazy(() => import("./pages/Search"));
const Product = lazy(() => import("./pages/Product"));
const NotFound = lazy(() => import("./pages/NotFound"));


const Login = lazy(() => import("./pages/Login"));


const Profile = lazy(() => import("./pages/Profile"));
const Shipping = lazy(() => import("./pages/Shipping"));
const Order = lazy(() => import("./pages/Order"));
const OrderDetails = lazy(() => import("./pages/Order-details"));
const Checkout = lazy(() => import("./pages/Checkout"));


const AdminHome = lazy(() => import("./admin/Home"));
const Create = lazy(() => import("./admin/Create"));
const ManageProduct = lazy(() => import("./admin/ManageProduct"));
const PieChart = lazy(() => import("./chart/PieChart"));
const Orders = lazy(() => import("./admin/Order"));
const Transaction = lazy(() => import("./admin/Transaction"));
const Users = lazy(() => import("./admin/Users"));

const AppContent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isFetching } = useSelector((state) => state.user);

  useEffect(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const data = await getCurrentUser(firebaseUser.uid);
          dispatch(loginSuccess(data.user));
        } else {
          dispatch(loginFailure());
        }
      } catch {
        dispatch(loginFailure());
        navigate("/login");
      }
    });
  }, [dispatch, navigate]);

  if (isFetching) return <Loader />;

  return (
    <>
      <Header user={user} />
      <Suspense fallback={<Loader />}>
        <main className="container mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/product/:id" element={<Product />} />

            <Route
              path="/login"
              element={
                <Protected isAuthenticated={!user}>
                  <Login />
                </Protected>
              }
            />

            <Route element={<Protected isAuthenticated={!!user} />}>
              <Route path="/profile" element={<Profile user={user} />} />
              <Route path="/checkout" element={<Shipping />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/order/:id" element={<OrderDetails />} />
              <Route path="/pay" element={<Checkout />} />
            </Route>

            <Route
              element={
                <Protected
                  isAuthenticated={!!user}
                  adminOnly
                  admin={user?.role === "admin"}
                />
              }
            >
              <Route path="/admin" element={<AdminHome />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/create" element={<Create />} />
              <Route path="/admin/manage" element={<ManageProduct />} />
              <Route path="/admin/pie" element={<PieChart />} />
              <Route path="/admin/line" element={<LineChat />} />
              <Route path="/admin/bar" element={<BarChart />} />
              <Route path="/admin/orders" element={<Orders />} />
              <Route path="/admin/transaction/:id" element={<Transaction />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </Suspense>
      <Footer />
    </>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;

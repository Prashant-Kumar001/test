import { useState, useEffect, useRef } from "react";
import Products from "../components/Products";
import {
  useGetAllProductsQuery,
  useGetCategoriesQuery,
  useGetProductsQuery,
  useGetTopReviewsQuery,
} from "../redux/api/product.api";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/product.reducer";
import toast from "react-hot-toast";
import ProductSkeleton from "../components/SkeletonCards";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import url from "../../public/b8bd4e4273cceae2889d9d259b04f732.mp4";
import RenderCategories from "../components/RenderCategories";
import { TestimonialSkeleton } from "../components/Skeleton";
import Rating from "../components/AdvancedRating";
import { PiCaretUpDown } from "react-icons/pi";



const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [cart, setCart] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [AllUserProducts, setAllUsersProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCategories, setShowCategories] = useState(false);

  const { data, isLoading, isError, error } = useGetProductsQuery();
  const { data: userProducts, isLoading: userProductsLoading, isError: userIsError, error: useError } = useGetAllProductsQuery();
  const { data: categories, isLoading: categoriesLoading, isError: categoriesIsError, error: categoriesError } = useGetCategoriesQuery();
  const { data: topReviews, isLoading: topReviewsLoading, isError: topReviewsIsError, error: topReviewsError } = useGetTopReviewsQuery();

  useEffect(() => {
    if (data?.products) setLatestProducts(data.products);
    if (userProducts?.products) setAllUsersProducts(userProducts.products);
    localStorage.setItem("cart-product", JSON.stringify(cart));
  }, [data, userProducts, cart]);

  const HandlerAddToCart = (id) => {
    const productInStore = AllUserProducts.find((item) => item._id === id);
    if (productInStore.stock === 0) return toast.error("Product is out of stock!");
    if (!productInStore) return toast.error("Selected item not found");

    const alreadyInCart = JSON.parse(localStorage.getItem("cart-product")) || [];
    const productInCart = alreadyInCart.findIndex((item) => item._id === id);
    if (productInCart > -1 && alreadyInCart[productInCart].qwt === productInStore.stock) {
      return toast.error("Maximum stock limit reached", { style: { minWidth: 400 } });
    }

    const cartItem = { ...productInStore, image: productInStore.image[0].secure_url };
    setCart((prev) => [...prev, cartItem]);
    dispatch(addToCart({ product: cartItem }));
  };

  const renderBanner = () => (
    <section id="banner" className="mx-auto w-full max-w-7xl mb-12 animate-fade-in flex flex-col md:flex-row justify-between px-4 py-8">
      <div className="w-full md:w-1/7 mb-4 md:mb-0">
        <h1 className="text-2xl font-ubuntu font-bold text-gray-800 tracking-tight">Categories</h1>
        <div className="md:hidden">
          <button
            className="text-gray-800 font-bold"
            onClick={() => setShowCategories(!showCategories)}
          >
            {showCategories ? "Hide Categories" : "Show Categories"}
          </button>
          {showCategories && (
            <div className="mt-2 flex flex-col gap-2">
              {categories?.category.map((query, index) => (
                <RenderCategories query={query} key={index} />
              ))}
            </div>
          )}
        </div>
        <div className="hidden md:block ml-2 font-poppins space-x-2 flex flex-col uppercase text-[12px] font-bold gap-3">
          {categories?.category.map((query, index) => (
            <RenderCategories query={query} key={index} />
          ))}
        </div>
      </div>
      <div className="relative flex-1 rounded-xl overflow-hidden">
        <img
          src="https://media.istockphoto.com/id/538773438/photo/close-up-of-a-digital-camera-large-copyspace.jpg?s=612x612&w=0&k=20&c=3QUB-MhJDgk8icsFOGEt7bGHAKm4d5_O0Yfiv2Gdid8="
          alt="Featured Product Banner"
          className="w-full h-80 object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-white text-4xl font-bold drop-shadow-lg">Discover Our Latest Collection</h2>
            <p className="text-white text-lg mt-2 drop-shadow-md">Shop the newest arrivals today!</p>
            <button
              className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
              onClick={() => navigate("/shop")}
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );

  const renderProductSection = ({ title, products, isLoading, isError, error }) => (
    <section className="w-full max-w-7xl mx-auto animate-fade-in mb-10 px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-ubuntu font-bold text-gray-800 tracking-tight">{title}</h1>
        <select
          className="p-2 border rounded"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option className="border-none outline-0 " value="all">All Categories</option>
          {categories?.category.map((cat) => (
            <option disabled className="uppercase text-[12px] font-bold" key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <ProductSkeleton count={4} />
      ) : isError ? (
        <div className="py-12 text-center rounded-lg shadow-inner">
          <h1 className="text-2xl text-red-600 font-semibold">Oops! Something went wrong</h1>
          <p className="text-gray-600 mt-2">{error?.data?.message || "We couldn’t load the products."}</p>
          <button
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {(selectedCategory === "all" ? products : products.filter((p) => p.category === selectedCategory))?.length > 0 ? (
            products.map((item) => (
              <Products
                key={item._id}
                imageUrl={item.image[0]}
                name={item.name}
                price={item.price}
                productId={item._id}
                handler={HandlerAddToCart}
                stock={item.stock}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-xl py-12 bg-gray-50 rounded-lg">
              No products available.
            </p>
          )}
        </div>
      )}
    </section>
  );

  const renderFullScreenBanner = () => {
    return (
      <section className="banner">
        <div className="relative overflow-hidden">
          <video src={url} autoPlay muted className="w-full" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-white text-4xl font-bold drop-shadow-lg animate-slide-up">
                Discover Our Latest Collection
              </h2>
              <p className="text-white text-lg mt-2 drop-shadow-md animate-slide-up delay-200">
                Shop the newest arrivals today!
              </p>
            </div>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2  p-4 rounded-lg shadow-lg flex items-center gap-2 animate-bounce">
            <PiCaretUpDown color="white" size={24} className="w-6 h-6 text-gray-700 dark:text-gray-200" />
          </div>
        </div>
      </section>
    );
  };

  const ourClient = () => {
    const clients = [
      { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" },
      { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
      { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
      { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/8/84/Spotify_icon.svg" },
      { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png" },
      { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
    ];
    return (
      <section className="py-16 bg-gray-50">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800">Our Clients</h2>
          <p className="mt-2 text-gray-500">
            Trusted by industry leaders worldwide
          </p>
        </div>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
          {clients.map((client, index) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex justify-center items-center h-24"
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-16  hover:grayscale-0 transition duration-300 ease-in-out"
              />
            </motion.div>
          ))}
        </div>
      </section>
    );
  };


  const renderTestimonials = () => (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
      <h2 className="text-4xl font-extrabold text-gray-800 dark:text-gray-100 text-center">
        What&nbsp;Our&nbsp;Customers&nbsp;Say
      </h2>

      <div className="max-w-6xl mx-auto mt-12 px-4">
        {topReviewsError ? (
          <p className="text-center text-red-500 font-medium">
            Failed to load reviews. Please try again later.
          </p>
        ) : topReviewsLoading ? (
          <TestimonialSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
            {topReviews?.reviews?.map((t) => (
              <motion.article
                key={t._id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="
                group relative bg-white/90 dark:bg-gray-800/70
                rounded-3xl p-8 shadow-lg ring-1 ring-gray-100 dark:ring-gray-700
                hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300
              "
              >
                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                  className="absolute -top-6 left-6 h-12 w-12 text-gray-200 dark:text-gray-600 group-hover:text-gray-300"
                >
                  <path d="M7 18h4V9H5v6a3 3 0 0 0 2 3Zm10 0h4V9h-6v6a3 3 0 0 0 2 3Z" />
                </svg>
                <p className="relative text-gray-700 dark:text-gray-200 italic leading-relaxed">
                  “{t.comment}”
                </p>
                <div className="mt-6 flex items-center justify-between">
                  {typeof Rating !== "undefined" ? (
                    <Rating value={t.rating} showLabel={false} size="text-lg" />
                  ) : (
                    <Stars value={t.rating} />
                  )}
                  <div className="flex items-center gap-2">
                    <img
                      src={t.user?.photo || "https://via.placeholder.com/80?text=👤"}
                      alt={t.user?.username || "Anonymous user"}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-gray-200 dark:ring-gray-600"
                    />
                    <div className="leading-tight">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {t.user?.username || "Anonymous"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div>
      {renderBanner()}
      {renderProductSection({
        title: "Latest Products",
        products: latestProducts,
        isLoading,
        isError,
        error,
      })}
      {renderProductSection({
        title: "Products",
        products: AllUserProducts,
        isLoading: userProductsLoading,
        isError: userIsError,
        error: useError,
      })}
      {renderTestimonials()}
      {renderFullScreenBanner()}
      {ourClient()}
      {cart.length > 0 && (
        <div className="fixed bottom-6 right-6 p-6 rounded-xl shadow-2xl border border-gray-200 animate-slide-up">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Cart Items: <span className="text-indigo-600">{cart.length}</span>
            </p>
            <p className="text-sm font-semibold text-gray-800 ml-4">
              Total: <span className="text-indigo-600">${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}</span>
            </p>
          </div>
          <button
            aria-label="View shopping cart"
            onClick={() => navigate("/cart")}
            className="mt-3 cursor-pointer w-full px-4 py-2 bg-pink-600 text-white rounded-md hover:bg-pink-700 transition-colors duration-300 text-sm"
          >
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
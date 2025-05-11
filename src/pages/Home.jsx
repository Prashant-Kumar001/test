import  { useState, useEffect } from "react";
import Products from "../components/Products";
import { useGetAllProductsQuery, useGetProductsQuery } from "../redux/api/product.api";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/reducer/product.reducer";
import toast from "react-hot-toast"
import ProductSkeleton from "../components/SkeletonCards";

const Home = () => {
 

  const { data, isLoading, isError, error } = useGetProductsQuery();
  const { data: userProducts, isLoading: userProductsLoading, isError: userIsError, error: useError } = useGetAllProductsQuery();


  const [cart, setCart] = useState([]);
  const [latestProducts, setLatestProducts] = useState([]);
  const [AllUserProducts, setAllUsersProducts] = useState([]);


  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.products) {
      setLatestProducts(data.products);
    }
    if (userProducts?.products) {
      setAllUsersProducts(userProducts.products);
    }
  }, [data, userProducts]);

  

  const HandlerAddToCart = (id) => {

    const productInStore = AllUserProducts.find((item => item._id === id))

    if(productInStore.stock === 0) {
      toast.error("product is out of stock !")
      return 0
    }

    if (!productInStore) {
      return toast.error("selected item not found");
    }


    const alreadyInCart =
      JSON.parse(localStorage.getItem("cart-product")) || [];
    const productInCart = alreadyInCart?.findIndex((item) => item._id === id);

    if (productInCart > -1) {
      const product = alreadyInCart[productInCart];

      if (product.qwt === product.stock) {
        return toast.error("you have reached the maximum stock limit", {
          style: {
            minWidth: 400,
          },
        });
      }
    }

    const cartItem = {
      ...productInStore,
    };

    setCart((prev) => [...prev, cartItem]);

    dispatch(addToCart({ product: cartItem }));
  };

  const renderBanner = () => (
    <section id="banner" className="mb-12 animate-fade-in">
      <div className="relative rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300">
        <img
          src="https://media.istockphoto.com/id/538773438/photo/close-up-of-a-digital-camera-large-copyspace.jpg?s=612x612&w=0&k=20&c=3QUB-MhJDgk8icsFOGEt7bGHAKm4d5_O0Yfiv2Gdid8="
          alt="Featured Product Banner"
          className="w-full h-80 object-cover transition-transform duration-500 hover:scale-110"
        />
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
      </div>
    </section>
  );

const renderLatestProductsSection = () => {
  return (
    <section id="latest-products" className="animate-fade-in mb-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-poppins font-bold text-gray-800 tracking-tight">
          Latest Products
        </h1>
        <button className="px-2 py-2 text-[12px] bg-indigo-700 btn btn-sm text-white rounded-md hover:bg-indigo-800 transition-all duration-300 hover:shadow-md">
          View More
        </button>
      </div>

      {isLoading ? (
        <ProductSkeleton count={4} />
      ) : isError ? (
        <div className="py-12 text-center bg-gray-100 rounded-lg shadow-inner">
          <h1 className="text-2xl text-red-600 font-semibold ">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mt-2">
            {error?.data?.message || "We couldn’t load the products right now."}
          </p>
          <button
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {latestProducts?.length > 0 ? (
            latestProducts.map((item) => (
              <Products
                key={item._id}
                imageUrl={item.image}
                name={item.name}
                price={item.price}
                productId={item._id}
                handler={HandlerAddToCart}
                stock={item.stock}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-xl py-12 bg-gray-50 rounded-lg">
              No products available at the moment.
            </p>
          )}
        </div>
      )}
    </section>
  );
};

const renderMidProductSection = () => {
  return (
    <section id="mid-products" className="animate-fade-in mt-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-poppins font-bold text-gray-800 tracking-tight">
          Products
        </h1>
      </div>

      {userProductsLoading ? (
        <ProductSkeleton count={6} />
      ) : userIsError ? (
        <div className="py-12 text-center bg-gray-100 rounded-lg shadow-inner">
          <h1 className="text-2xl text-red-600 font-semibold ">
            Oops! Something went wrong
          </h1>
          <p className="text-gray-600 mt-2">
            {useError?.data?.message || "We couldn’t load the products right now."}
          </p>
          <button
            className="mt-4 px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-300"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {AllUserProducts?.length > 0 ? (
            AllUserProducts.map((item) => (
              <Products
                key={item._id}
                imageUrl={item.image}
                name={item.name}
                price={item.price}
                productId={item._id}
                handler={HandlerAddToCart}
                stock={item.stock}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500 text-xl py-12 bg-gray-50 rounded-lg">
              No products available at the moment.
            </p>
          )}
        </div>
      )}
    </section>
  );
};



  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50 min-h-screen">
      {renderBanner()}
      {renderLatestProductsSection()}
      {renderMidProductSection()}
      {cart.length > 0 && (
        <div className="fixed  bottom-6 right-6 bg-white p-6 rounded-xl shadow-2xl border border-gray-200 animate-slide-up">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-800">
              Cart Items: <span className="text-indigo-600">{cart.length}</span>
            </p>
            <p className="text-sm font-semibold text-gray-800 ml-4">
              Total:{" "}
              <span className="text-indigo-600">
                ${cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
              </span>
            </p>
          </div>
          <button className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 text-sm">
            View Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoFilter, IoClose, IoCart } from "react-icons/io5";
import {
  useGetCategoriesQuery,
  useGetSearchProductQuery,
} from "../redux/api/product.api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../redux/reducer/product.reducer";
import { useDispatch, useSelector } from "react-redux";
import SkeletonCards from "../components/SkeletonCards";
import { useSearchParams } from "react-router-dom";

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

const Search = () => {
  const navigate = useNavigate();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const query = searchParams.get("category");

  useEffect(() => {
    if (query) {
      setCategory(query)
    }
    return () => {
      setCategory('')
    };
  }, [query])


  const dispatch = useDispatch();
  const { cart: cartList } = useSelector((state) => state.product);

  const {
    data: categories,
    isLoading: isLoadingCategories,
    isError: isErrorCategories,
    error: errorCategories,
  } = useGetCategoriesQuery();

  const [category, setCategory] = useState("");
  const [maxRange, setMaxRange] = useState(1000000);
  const [minRange, setMinRange] = useState(0);
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [hasPrevPage, setHasPrevPage] = useState(false);

  const debouncedPriceRange = useDebounce(priceRange, 500);
  const debouncedSearch = useDebounce(search, 500);

  const { data, isLoading, isError, error } = useGetSearchProductQuery({
    search: debouncedSearch,
    price: debouncedPriceRange,
    category,
    sort: sortBy,
    page,
  });

  const handleNextPage = () => {
    if (hasNextPage) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (hasPrevPage) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const addToCartHandler = (id) => {
    const productInStore = data?.products.find((item) => item._id === id);

    if (!productInStore) {
      return toast.error("selected item not found");
    }

    const alreadyInCart =
      JSON.parse(localStorage.getItem("cart-product")) || [];
    const productInCart = alreadyInCart?.findIndex((item) => item._id === id);

    if (productInCart > -1) {
      const product = alreadyInCart[productInCart];

      if (product.quantity === product.stock) {
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

    dispatch(addToCart({ product: cartItem }));

    // setCart((prev) => {
    //   const isPresent = prev.findIndex((item) => item._id === productInStore._id);
    //   if (isPresent > -1) {
    //     return prev.map((item) =>
    //       item._id === productInStore._id ? { ...item, qwt: item.qwt + 1 } : item
    //     );
    //   }
    //   return [...prev, { ...productInStore, qwt: 1 }];
    // });
  };

  useEffect(() => {
    if (data?.products) {
      const prices = data.products.map((p) => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setMinRange(min);
      setMaxRange(max);
      setTotalPages(data?.pagination?.totalPages || 1);
      setHasNextPage(data?.pagination?.hasNextPage || false);
      setHasPrevPage(data?.pagination?.hasPrevPage || false);
    }
  }, [data]);

  const resetFilters = () => {
    setCategory("");
    setPriceRange(0);
    setSortBy("");
    setSearch("");
    setPage(1);
  };

  const removeFilter = (filterKey) => {
    switch (filterKey) {
      case "category":
        setCategory("");
        break;
      case "priceRange":
        setPriceRange(0);
        break;
      case "sortBy":
        setSortBy("");
        break;
      case "search":
        setSearch("");
        break;
      default:
        break;
    }
    setPage(1);
  };

  const appliedFilters = [];
  if (category)
    appliedFilters.push({ key: "category", label: `Category: ${category}` });
  if (priceRange > 0)
    appliedFilters.push({
      key: "priceRange",
      label: `Max Price: $${priceRange}`,
    });
  if (sortBy)
    appliedFilters.push({
      key: "sortBy",
      label: `Sort: ${sortBy.replace(/([A-Z])/g, " $1").trim()}`,
    });
  if (search)
    appliedFilters.push({ key: "search", label: `Search: ${search}` });

  return (
    <div className=" font-montserrat  py-6 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="md:hidden flex justify-between items-center mb-4">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
          >
            <IoFilter size={20} />
          </button>
        </div>

        {isFilterOpen && (
          <motion.aside
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white rounded-xl p-4 mb-6 overflow-hidden"
          >
            <FilterSection
              category={category}
              setCategory={setCategory}
              maxRange={maxRange}
              minRange={minRange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              search={search}
              setSearch={setSearch}
              categories={categories?.category || []}
              isLoadingCategories={isLoadingCategories}
              isErrorCategories={isErrorCategories}
              errorCategories={errorCategories}
            />
          </motion.aside>
        )}

        <div className="flex flex-col md:flex-row gap-6">
          <motion.aside
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden md:block border border-gray-100 w-full md:w-72 bg-white rounded-2xl  p-6 sticky top-24 h-fit"
          >
            <FilterSection
              category={category}
              setCategory={setCategory}
              maxRange={maxRange}
              minRange={minRange}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              sortBy={sortBy}
              setSortBy={setSortBy}
              search={search}
              setSearch={setSearch}
              categories={categories?.category || []}
              isLoadingCategories={isLoadingCategories}
              isErrorCategories={isErrorCategories}
              errorCategories={errorCategories}
            />
          </motion.aside>

          <div className="flex-1 relative">
            <div className="flex justify-between items-center relative  mb-4">
              {cartList.length > 0 && (
                <button
                  className="p-2 absolute rounded-full bg-indigo-600 text-white cursor-pointer hover:bg-indigo-700 transition-colors duration-200"
                  onClick={() => navigate("/cart")}
                >
                  <IoCart size={20} />
                </button>
              )}
            </div>

            {appliedFilters.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2  ">
                  Applied Filters:
                </h3>
                <div className="flex flex-wrap gap-2">
                  {appliedFilters.map((filter) => (
                    <motion.div
                      key={filter.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium shadow-sm"
                    >
                      {filter.label}
                      <button
                        onClick={() => removeFilter(filter.key)}
                        className="ml-2 text-indigo-600 hover:text-red-600 transition-colors"
                      >
                        <IoClose size={14} />
                      </button>
                    </motion.div>
                  ))}
                  <button
                    onClick={resetFilters}
                    className="ml-2 px-3 py-1 bg-red-500 text-white rounded-full text-sm font-medium hover:bg-red-600 transition-colors shadow-sm"
                  >
                    Reset All
                  </button>
                </div>
              </div>
            )}
            <div className="overflow-hidden rounded-lg">
              <div className="h-[70vh]  overflow-auto custom-scrollbar">
                {isLoading ? (
                  <SkeletonCards count={4} />
                ) : isError ? (
                  <div className="flex justify-center items-center h-72 bg-white rounded-2xl shadow-lg p-6">
                    <p className="text-red-600 text-xl font-semibold">
                      Error: {error?.message || "Something went wrong"}
                    </p>
                  </div>
                ) : !data?.products || data?.products.length === 0 ? (
                  <div className="flex justify-center items-center h-72 bg-white rounded-2xl shadow-lg p-6">
                    <p className="text-gray-600 text-xl font-semibold">
                      No products found
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 p-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {data?.products?.map((product) => (
                      <motion.div
                        key={product._id}
                        whileTap={{ scale: 0.97 }}
                        className="bg-white p-2 flex md:flex-col items-center justify-center rounded-xl  hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                      >
                        <div className="relative w-[50%] md:w-full md:flex justify-center">
                          <Link to={`/product/view/${product._id}`}>
                            <img
                              src={product.image[0].secure_url}
                              alt={product.name}
                              className=" h-40 object-cover  "
                            />
                          </Link>
                          {product.stock === 0 && (
                            <span className="absolute top-2 right-1 bg-red-500 text-white text-[10px] font-semibold px-1 py-1 rounded-full shadow-sm">
                              Sold Out
                            </span>
                          )}
                          {product.stock > 0 && product.stock < 5 && (
                            <span className="absolute top-2 right-1 bg-yellow-400 text-gray-800 text-[10px] font-semibold px-1 py-1 rounded-full shadow-sm">
                              Low Stock
                            </span>
                          )}
                        </div>
                        <div className="space-y-1 flex flex-col h-full justify-center  items-center md:items-center md:w-full flex-1">
                          <h3 className="text-[12px] md:text-[14px] font-bold text-gray-900 truncate">
                            {product.name.length > 20
                              ? `${product.name.slice(0, 20)}...`
                              : `${product.name}`}
                          </h3>
                          <p className="text-sm font-medium text-indigo-600">
                            ${product.price.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {product.stock > 0
                              ? `${product.stock} in stock`
                              : "Out of stock"}
                          </p>
                          {cartList
                            .map((item) => item._id)
                            .includes(product._id) ? (
                            <button
                              onClick={() => navigate("/cart")}
                              className="cursor-pointer bg-pink-600 text-white uppercase text-[12px] font-bold px-4 py-2 rounded-lg shadow-md hover:bg-pink-700 transition-colors duration-200"
                            >
                              go to cart
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCartHandler(product._id)}
                              className="cursor-pointer uppercase text-[12px] font-bold bg-transparent text-black px-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200"
                            >
                              Add to Cart
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full mt-6 flex justify-center items-center gap-3">
              <motion.button
                onClick={handlePrevPage}
                disabled={!hasPrevPage}
                whileHover={{ scale: !hasPrevPage ? 1 : 1.05 }}
                whileTap={{ scale: !hasPrevPage ? 1 : 0.95 }}
                className={`px-4 py-2 rounded-lg text-white font-medium shadow-md transition-all duration-200 ${hasPrevPage
                    ? "bg-gray-600 hover:bg-gray-700"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                -
              </motion.button>
              <span className="text-lg font-semibold text-gray-800">
                {page} / {totalPages}
              </span>
              <motion.button
                onClick={handleNextPage}
                disabled={!hasNextPage}
                whileHover={{ scale: !hasNextPage ? 1 : 1.05 }}
                whileTap={{ scale: !hasNextPage ? 1 : 0.95 }}
                className={`px-6 py-2 rounded-lg text-white font-medium shadow-md transition-all duration-200 ${hasNextPage
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                  }`}
              >
                +
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterSection = ({
  category,
  maxRange,
  minRange,
  priceRange,
  sortBy,
  search,
  setCategory,
  setPriceRange,
  setSortBy,
  setSearch,
  categories,
  isLoadingCategories,
  isErrorCategories,
  errorCategories,
}) => {
  return (
    <>
      <div className="space-y-8">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Sort By
          </label>
          <select
            onChange={(e) => setSortBy(e.target.value)}
            value={sortBy}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 hover:bg-white "
          >
            <option value="">Name (A-Z)</option>
            <option value="asc">price: low to high</option>
            <option value="dsc">price: high to low</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Price: ${priceRange}
          </label>
          <input
            type="range"
            min={minRange}
            max={maxRange}
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full h-2 cursor-pointer bg-gray-200 rounded-lg accent-indigo-600"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-3">
            <span>${minRange}</span>
            <span>${maxRange}</span>
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Category
          </label>
          {isLoadingCategories ? (
            <div className="w-full h-10 bg-gray-200 rounded-lg animate-pulse"></div>
          ) : isErrorCategories ? (
            <div className="w-full text-center">
              <span className="text-red-600 text-sm font-semibold">
                {errorCategories?.message || "Error loading categories"}
              </span>
            </div>
          ) : (
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white "
            >
              <option value="">All</option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Search
          </label>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            type="search"
            className="w-full px-4 py-1 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 bg-gray-50 hover:bg-white "
          />
        </div>
      </div>
    </>
  );
};

export default Search;

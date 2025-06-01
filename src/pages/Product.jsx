import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  useDeleteReviewMutation,
  useGetProductsReviewsQuery,
  useGetSingleProductQuery,
  useWriteReviewMutation,
} from "../redux/api/product.api";
import { addToCart } from "../redux/reducer/product.reducer";
import { motion } from "framer-motion";
import {
  FaCartPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaTags,
} from "react-icons/fa";
import { TfiWrite } from "react-icons/tfi";
import Rating from "../components/AdvancedRating";
import ReviewCard from "../components/ReviewCard";
import { SingleCardSkeleton } from "../components/SkeletonCards";
import ReviewDialog from "../dialog/ReviewDialog";

const Product = () => {
  useEffect(() => window.scrollTo(0, 0), []);

  const { cart } = useSelector((state) => state.product);
  const { user } = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [writeReviewQuery] = useWriteReviewMutation();
  const [deleteReviewQuery] = useDeleteReviewMutation();

  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
  } = useGetSingleProductQuery(id);


  const {
    data: reviewData,
    isLoading: isReviewLoading,
    isError: isReviewError,
    error: reviewError,
  } = useGetProductsReviewsQuery(id, { skip: !id });

  useEffect(() => {
    if (!isProductLoading && (isProductError || !productData?.product)) {
      navigate("/404", { replace: true });
    }
  }, [isProductLoading, isProductError, productData, navigate]);

  const handleAddToCart = () => {
    const alreadyInCart =
      JSON.parse(localStorage.getItem("cart-product")) || [];
    const productIdx = alreadyInCart.findIndex((item) => item._id === id);

    if (
      productIdx > -1 &&
      alreadyInCart[productIdx].quantity >= alreadyInCart[productIdx].stock
    ) {
      return toast.error("Maximum stock limit reached", {
        style: { minWidth: 400 },
      });
    }

    dispatch(
      addToCart({
        product: {
          ...productData.product,
          image: productData.product.image[0].secure_url,
        },
      })
    );
    toast.success("Added to cart!", { duration: 2000 });
  };

  const goToCart = () => navigate("/cart");

  if (isProductLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <SingleCardSkeleton />
      </div>
    );
  }

  const { name, description, price, stock, image, ratings, numOfReviews, category } =
    productData.product;
  const isInCart = cart.some((item) => item._id === id);

  const writeReview = () => {
    setIsReviewOpen(true);
  }

  const handleReviewSubmit = (data) => {
    writeReviewQuery({
      id: user._id,
      data,
      productId: id
    })
      .unwrap()
      .then((data) => {
        if (data?.success) {
          toast.success("Review submitted successfully");
          setIsReviewOpen(false);
        }
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to submit review");
      });
  }
  const handleReviewDelete = (reviewId) => {
    deleteReviewQuery({ id: reviewId, authorId: user._id })
      .unwrap()
      .then((data) => {
        if (data?.success) {
          toast.success("Review deleted successfully");
        }
      })
      .catch((error) => {
        toast.error(error?.data?.message || "Failed to delete review");
      });
  }


  return (
    <div className="flex bg-white min-h-screen justify-center py-6 px-4 sm:px-6 lg:px-4">
      <div className="max-w-6xl w-full  p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 sm:overflow-y-auto overflow-x-auto md:overflow-hidden sm:max-h-[400px]">
              {image.map((img, index) => (
                <img
                  key={index}
                  src={img.secure_url}
                  alt={`Thumbnail ${index}`}
                  className={`w-16 h-16 object-cover rounded-md cursor-pointer ${selectedImage === index
                    ? "border-indigo-600 border-2"
                    : "border-gray-300"
                    }`}
                  onClick={() => setSelectedImage(index)}
                />
              ))}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <a
                href={image[selectedImage]?.secure_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <motion.img
                  key={selectedImage}
                  src={image[selectedImage]?.secure_url}
                  alt={`Product ${name}`}
                  className="w-full max-w-[400px] h-[400px] object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </a>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FaTags className="text-pink-600" /> {name}
            </h1>

            <p className="text-gray-600 text-base leading-relaxed">
              {description}
            </p>

            <div className="flex items-center gap-4">
              <span className="text-gray-500  text-sm bg-cyan-100 px-2.5 py-0.5 rounded-full">{`${category}`}</span>

              <span className="text-2xl font-semibold text-indigo-600">
                ${price.toFixed(2)}
              </span>
              <span className="text-sm text-gray-500 line-through">
                ${(price * 1.2).toFixed(2)}
              </span>
              <span className="bg-indigo-100 text-indigo-700 text-xs font-medium px-2.5 py-0.5 rounded-full">
                20% OFF
              </span>
            </div>

            <em>
              <Rating value={ratings} showLabel={false} />
              <span className="text-gray-500 text-sm">
                {numOfReviews} reviews
              </span>
            </em>

            <div className="text-base flex items-center gap-2">
              {stock > 0 ? (
                <>
                  <FaCheckCircle className="text-green-600" />
                  <span className="text-green-600">{stock} available</span>
                </>
              ) : (
                <>
                  <FaTimesCircle className="text-rose-600" />
                  <span className="text-rose-600">Out of stock</span>
                </>
              )}
            </div>

            <div className="flex flex-col gap-4 ">
              {stock === 0 ? (
                <button
                  disabled
                  className="w-full py-3 bg-gray-300 text-gray-600 rounded-xl cursor-not-allowed"
                >
                  Out of Stock
                </button>
              ) : isInCart ? (
                <button
                  onClick={goToCart}
                  className="w-full py-3 bg-transparent text-red rounded-xl border-2 border-blue-600 hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  <FaCartPlus /> Go to Cart
                </button>
              ) : (
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-transparent text-black rounded-xl border-2 border-blue-600 hover:bg-gray-100 flex items-center justify-center gap-2"
                >
                  <FaCartPlus /> Add to Cart
                </button>
              )}
            </div>
          </div>
        </div>

        <section className="mt-12 ">
          <div className="flex justify-end mb-2">
            <button onClick={writeReview} className="mr-3" >
              <TfiWrite size={20} />
            </button>
          </div>

          {isReviewLoading ? (
            <div className="rounded-lg space-y-7">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-full bg-gray-300 animate-pulse rounded"
                />
              ))}
            </div>
          ) : isReviewError ? (
            <p className="text-red-500">
              Error loading reviews:{" "}
              {reviewError?.data?.message ?? "Unknown error"}
            </p>
          ) : reviewData?.reviews?.length ? (
            <div className="rounded-2xl overflow-hidden">
              <div className="flex gap-4 overflow-x-scroll custom-scrollbar">
                {
                  reviewData.reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} onDelete={handleReviewDelete} userId={user._id} />
                  ))
                }
              </div>
            </div>
          ) : (
            <p className="text-gray-600">No reviews yet</p>
          )}
        </section>
      </div>
      <ReviewDialog
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onSubmit={handleReviewSubmit}
        reviews={reviewData?.reviews}
        userID={user?._id}
      />
    </div>
  );
};

export default Product;

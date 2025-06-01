import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

const ReviewDialog = ({ isOpen, onClose, onSubmit, reviews, userID }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");


  useEffect(() => {
    if (reviews && userID) {
      const userReview = reviews.find(review => review.user._id === userID);
      if (userReview) {
        setRating(userReview.rating);
        setComment(userReview.comment);
      } else {
        setRating(0);
        setComment("");
      }
    }
  }, [reviews, userID]);






  const handleSubmit = () => {
    if (!rating || !comment.trim()) {
      return toast.error("Please fill all fields");
    }
    
    onSubmit({ rating, comment });
    setComment("");
    setRating(0);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black opacity-50" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 space-y-4 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-gray-800">
            Submit a Review
          </Dialog.Title>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  onClick={() => setRating(star)}
                  className={`cursor-pointer text-2xl ${rating >= star ? "text-yellow-500" : "text-gray-300"
                    }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              rows={4}
              type="text"
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your thoughts..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-md bg-gray-200 hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm rounded-md bg-cyan-600 text-white hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default ReviewDialog;

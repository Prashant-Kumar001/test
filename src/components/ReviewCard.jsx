import { format } from "date-fns";
import Rating from "./AdvancedRating";
import { MdDelete } from "react-icons/md";

const ReviewCard = ({ review, onDelete, userId }) => {
    if (!review) return null;

    const { rating, comment, user, createdAt } = review;

    return (
        <div className="bg-gray-100 rounded-xl p-6 w-full min-w-lg font-poppins tracking-wider relative">
            {
                userId === user?._id && (
                    <button
                        onClick={() => onDelete(review._id)}
                        className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                    >
                        <MdDelete size={20} />
                    </button>
                )
            }
            <div className="flex items-center mb-3">
                <Rating value={rating} showLabel={false} size="text-sm" />
            </div>
            <p className="text-gray-900 text-[14px] mb-2">{comment}</p>
            <div className="flex items-center jus mt-1 gap-2">
                <img
                    src={user?.avatar?.secure_url}
                    alt={user?.username}
                    className="w-8 h-8 rounded-full mr-2"
                />
                <p className="text-blue-400 text-[11px] ">{user?.username}</p>
            </div>
        </div>
    );
};

export default ReviewCard;

import { FiEdit2 } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import ProductEditForm from "../components/ProductEditForm";
import { OrderSkeleton } from "../components/SkeletonCards";
import { useSelector } from "react-redux";
import { useGetAllAdminProductsQuery } from "../redux/api/product.api";

const ManageProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const { user } = useSelector(state => state.user)

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAllAdminProductsQuery({ userId: user._id });

  const handleUpdate = (id) => {
    navigate(`/admin/manage?product=${id}`);
  };

  if (productId) {
    return (
      <AdminLayout>
        <ProductEditForm productId={productId} />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>


      {isLoading ? (
        <>
          {[...Array(5)].map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </>
      ) : isError ? (
        <div className="bg-white p-8 rounded-lg text-center shadow-md">
          <h2 className="text-xl font-semibold text-red-600">
            Failed to Load Products
          </h2>
          <p className="text-gray-600 mt-2">
            {error?.data?.message || "Something went wrong."}
          </p>
          <button
            onClick={refetch}
            className="mt-4 bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      ) : data?.products?.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-auto max-h-[560px] ">
            <table className="w-full min-w-[640px] divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10 font-ubuntu">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-montserrat">
                {data.products.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={item.image[0].secure_url}
                        alt={item.name}
                        className="w-12 h-12 object-contain rounded-md"
                      />
                    </td>
                    <td className="px-6 py-4 text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-gray-700">₹{item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${item.stock > 0
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                          }`}
                      >
                        {item.stock > 0 ? item.stock : "Out of Stock"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 capitalize">{item.category}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleUpdate(item._id)}
                        className="p-2 text-indigo-600 hover:bg-indigo-100 rounded transition"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-700 text-lg font-medium">No Products Found</p>
          <p className="text-gray-500 mt-1">Add a product to get started!</p>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageProduct;

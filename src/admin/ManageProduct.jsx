import { useGetAllProductsQuery } from "../redux/api/product.api";
import { FiEdit2 } from "react-icons/fi";
import { useNavigate, useSearchParams } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import ProductEditForm from "../components/ProductEditForm";
import { OrderSkeleton } from "../components/SkeletonCards";
import { FaPlus } from "react-icons/fa6";

const ManageProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");

  const { data, isLoading, isError, error } = useGetAllProductsQuery();

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
      <>
      <div className="flex justify-between  mb-4">
          <h2 className="text-2xl font-semibold">Products</h2>
          <button className="cursor-pointer"  onClick={() => navigate("/admin/create")}>
             <FaPlus size={22} />
          </button>
      </div>
      
        {isLoading ? (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : isError ? (
          <div className="bg-white p-8 rounded-lg text-center shadow-md">
            <h2 className="text-xl font-semibold text-red-600">
              Failed to Load Users
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
        ) : (
          <>
            {data?.products?.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto max-h-[560px] overflow-y-auto custom-scrollbar">
                  <table className="min-w-full divide-y divide-gray-200 text-sm">
                    <thead className="bg-gray-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                          Image
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                          Stock
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {data.products.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <img
                              src={`${import.meta.env.VITE_SERVER}/${item.image.replace(
                                /\\/g,
                                "/"
                              )}`}
                              alt={item.name}
                              className="w-12 h-12 object-contain rounded-md"
                            />
                          </td>
                          <td className="px-6 py-4 text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 text-gray-700">
                            ₹{item.price.toFixed(2)}
                          </td>
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
                          <td className="px-6 py-4 text-gray-600 capitalize">
                            {item.category}
                          </td>
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
                <p className="text-gray-700 text-lg font-medium">
                  No Products Found
                </p>
                <p className="text-gray-500 mt-1">
                  Add a product to get started!
                </p>
              </div>
            )}
          </>
        )}
      </>
    </AdminLayout>
  );
};

export default ManageProduct;

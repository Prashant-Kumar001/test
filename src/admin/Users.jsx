import React, { useEffect, useState } from "react";
import { useAllUsersQuery, useDeleteUserMutation } from "../redux/api/user.api";
import { useSelector } from "react-redux";
import AdminLayout from "./AdminLayout";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";

const Users = () => {
  const { user } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const { data, isLoading, isError, error, refetch } = useAllUsersQuery({
    admin: user._id,
  });
  const [deleteUser] = useDeleteUserMutation();
  const { users } = data || {};

  const handleDelete = async (userId) => {
    try {
      setLoading(true);
      await deleteUser({ userId, admin: user._id }).unwrap();
      toast.success("User deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <AdminLayout>
      <>
        <h2 className="text-2xl font-bold mb-6"> Users</h2>

        {isLoading ? (
          <div className="rounded-lg space-y-7">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-8 w-full bg-gray-300 animate-pulse rounded"
              />
            ))}
          </div>
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
        ) : users?.length === 0 ? (
          <div className="text-gray-600 bg-white p-6 rounded shadow">
            No users found.
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto max-h-[560px] overflow-y-auto custom-scrollbar">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead className="bg-gray-100 text-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left">Photo</th>
                    <th className="px-6 py-4 text-left">Username</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Gender</th>
                    <th className="px-6 py-4 text-left">DOB</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {users?.map((u) => (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 transition duration-200"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={u.photo || "https://via.placeholder.com/40"}
                          alt={u.username || "User Photo"}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-800">
                        {u.username}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{u.email}</td>
                      <td className="px-6 py-4 capitalize">{u.gender}</td>
                      <td className="px-6 py-4">
                        {new Date(u.dob).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 capitalize">{u.role}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            u.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {u.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          disabled={loading}
                          title="Delete"
                          onClick={() => handleDelete(u._id)}
                          className="flex items-center gap-1 text-red-500 hover:text-red-700 transition text-sm"
                        >
                          <FiTrash2 size={16} />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    </AdminLayout>
  );
};

export default Users;

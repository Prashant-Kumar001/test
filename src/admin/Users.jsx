import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { FiEdit2 } from "react-icons/fi";
import AdminLayout from "./AdminLayout";
import { useAllUsersQuery, useDeleteUserMutation } from "../redux/api/user.api";
import UserEditDialog from "../dialog/UserEditDialog";

const Users = () => {
  const { user } = useSelector((state) => state.user);
  const [openEditDialog, setOpenDialog] = useState(false);

  const {
    data,
    isLoading: isFetching,
    isError,
    error,
    refetch,
  } = useAllUsersQuery({ admin: user?._id }, { skip: !user?._id });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const [deletingId, setDeletingId] = useState(null);

  const users = useMemo(() => data?.users ?? [], [data]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "—";

  const badgeClass = (active) =>
    `inline-block px-2 py-1 text-xs font-semibold rounded-full ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
    }`;

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      setDeletingId(id);
      await deleteUser({ userId: id, admin: user._id }).unwrap();
      toast.success("User deleted successfully!");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (data) => {
    console.log(data);
  };

  return (
    <AdminLayout>
      {isFetching && (
        <div className="rounded-lg space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-full bg-gray-300 animate-pulse rounded"
            />
          ))}
        </div>
      )}

      {isError && !isFetching && (
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
      )}

      {!isFetching && users.length === 0 && (
        <div className="text-gray-600 bg-white p-6 rounded shadow">
          No users found.
        </div>
      )}

      {users.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto max-h-[560px] overflow-y-auto custom-scrollbar">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-gray-700 font-ubuntu">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Photo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Username
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DOB
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white font-montserrat">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <img
                        src={u.photo || "https://via.placeholder.com/40"}
                        alt={u.username || "User"}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-800">
                      {u.username}
                    </td>
                    <td className="px-6 py-4 text-gray-600">{u.email}</td>
                    <td className="px-6 py-4 capitalize">{u.gender}</td>
                    <td className="px-6 py-4">{u.age}</td>
                    <td className="px-6 py-4 capitalize">{u.role}</td>
                    <td className="px-6 py-4">
                      <span className={badgeClass(u.status)}>
                        {u.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4  gap-3">
                      <div className="flex gap-3">
                        <button
                          disabled={isDeleting && deletingId === u._id}
                          title="Delete"
                          onClick={() => handleDelete(u._id)}
                          className=" items-center gap-1 text-red-500 hover:text-red-700 transition text-sm disabled:opacity-50"
                        >
                          {isDeleting && deletingId === u._id ? (
                            "Deleting…"
                          ) : (
                            <>
                              <FiTrash2 size={16} />
                            </>
                          )}
                        </button>
                        <button
                          disabled={isDeleting && deletingId === u._id}
                          title="edit"
                          // onClick={() => setOpenDialog((prev) => !prev)}
                          onClick={() => alert("oops currently this feature not exit")}
                          className="flex items-center gap-1 text-blue-500 hover:text-blue-700 transition text-sm disabled:opacity-50"
                        >
                          <FiEdit2 size={16} />
                        </button>
                        <UserEditDialog
                          isOpen={openEditDialog}
                          onClose={() => setOpenDialog((prev) => !prev)}
                          onSubmit={handleEdit}
                          user={u.id}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Users;

import React from "react";

const Profile = ({ user }) => {
    return (
        <div className=" min-h-screen p-6 w-full max-w-5xl mx-auto  flex flex-col items-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-12 tracking-tight capitalize">
                Your Profile
            </h1>

            <div className="bg-white w-full max-w-2xl rounded-xl shadow-lg p-8 flex flex-col items-center space-y-6 font-montserrat">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-cyan-500">
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Profile"
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <span className="text-3xl font-semibold text-gray-500">
                            {user?.username?.charAt(0).toUpperCase() || "U"}
                        </span>
                    )}
                </div>

                <div className="w-full space-y-4 text-gray-700">
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-lg w-32">Name:</span>
                        <span className="text-lg">{user?.username || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-lg w-32">Email:</span>
                        <span className="text-lg">{user?.email || "Not provided"}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-lg w-32">Date of Birth:</span>
                        <span className="text-lg">
                            {user?.dob
                                ? new Date(user.dob).toLocaleDateString()
                                : "Not provided"}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="font-semibold text-lg w-32">Gender:</span>
                        <span className="text-lg capitalize">
                            {user?.gender || "Not provided"}
                        </span>
                    </div>
                </div>

                <button className="mt-6 bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700 transition-colors duration-200 shadow-md">
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
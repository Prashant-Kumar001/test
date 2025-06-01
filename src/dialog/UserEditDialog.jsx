import { useEffect, useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaStar } from "react-icons/fa";
import toast from "react-hot-toast";

const UserEditDialog = ({ isOpen, onClose, onSubmit, user }) => {
    const [email, setEmail] = useState("");
    const [photo, setPhoto] = useState("");
    const [dob, setDob] = useState("");

    useEffect(() => {
        if (user) {
            setEmail(user.email)
            setPhoto(user.photo)
            setDob(user.dob)
        }
    }, [user]);


    const handleSubmit = () => {
        if (!email || !dob || photo) {
            return toast.error("Please fill all fields");
        }
        onSubmit({ email, photo, dob });
        setEmail("");
        setPhoto("");
        setDob("");
        onClose();
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black opacity-50" aria-hidden="true" />

            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-xl bg-white p-6 space-y-4 shadow-xl">
                    <Dialog.Title className="text-lg font-semibold text-gray-800">
                        Edit, User
                    </Dialog.Title>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <input
                            type="text"
                            placeholder={email ? email : 'enter new email'}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            dob
                        </label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            placeholder={dob ? dob : 'dob'}
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
                            className="px-4 py-2 text-sm rounded-md bg-cyan-600 text-white hover:bg-cyan-700"
                        >
                            Submit
                        </button>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
};

export default UserEditDialog;

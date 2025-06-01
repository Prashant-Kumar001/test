import React from 'react';
import { motion } from 'framer-motion';


const TestimonialSkeleton = ({ count }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(count)].map((_, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-6 rounded-lg shadow-md"
            >
                <p className="text-gray-600 italic">Loading...</p>
                <p className="mt-4 font-semibold text-gray-800">Loading...</p>
            </motion.div>
        ))}
    </div>
);

export {
    TestimonialSkeleton
}
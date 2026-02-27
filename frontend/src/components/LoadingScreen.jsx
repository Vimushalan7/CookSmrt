import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

export default function LoadingScreen() {
    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white dark:bg-gray-900 overflow-hidden"
        >
            <div className="relative mb-12">
                {/* Outer pulsing ring */}
                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute inset-0 bg-orange-500 rounded-full blur-3xl opacity-20"
                />

                {/* Logo Image (Larger) */}
                <motion.img
                    src="/logo.png"
                    alt="CookSmrt Logo"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="w-56 h-56 relative z-10 object-contain drop-shadow-2xl"
                />
            </div>

            {/* Loading Text / Label */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col items-center"
            >
                <h2 className="text-3xl font-black gradient-text tracking-tight">CookSmrt</h2>
                <div className="mt-6 flex gap-1.5">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                            className="w-2.5 h-2.5 rounded-full bg-orange-500"
                        />
                    ))}
                </div>
            </motion.div>

            {/* Bottom Animation Area: Cart on a Line */}
            <div className="absolute bottom-16 w-full">
                {/* The Track (Line) */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800" />

                {/* The Moving Cart */}
                <motion.div
                    initial={{ x: "-120px" }}
                    animate={{ x: "100vw" }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-1 text-orange-500"
                >
                    <div className="relative">
                        <ShoppingCart size={40} />
                        {/* Subtle steam/motion effect */}
                        <motion.div
                            animate={{ opacity: [0, 1, 0, 0], scale: [0.5, 1, 1.2, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="absolute -top-2 left-1 w-2 h-2 rounded-full bg-orange-200 blur-sm"
                        />
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}

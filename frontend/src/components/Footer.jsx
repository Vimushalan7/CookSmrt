import { useTheme } from '../context/ThemeContext';

export default function Footer() {
    const { dark } = useTheme();

    return (
        <footer className={`py-12 px-4 mt-20 border-t ${dark ? 'bg-gray-900 border-gray-800' : 'bg-orange-50/30 border-orange-100'}`}>
            <div className="max-w-7xl mx-auto text-center">
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2">
                        Cook <span className="gradient-text">Smrt</span> 🍳
                    </h3>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Elevating your home cooking experience with AI-powered suggestions and traditional recipes.
                    </p>
                </div>

                <div className="pt-8 border-t border-gray-200/10 inline-block w-full">
                    <div className="text-sm font-medium text-gray-600 dark:text-gray-400 space-y-2">
                        <p>© {new Date().getFullYear()} CookSmrt AI. All rights reserved.</p>
                        <p className="opacity-75">Made with ❤️ for food lovers everywhere.</p>
                        <p className="text-orange-500 font-semibold mt-4 pt-2 border-t border-orange-100 dark:border-gray-800 inline-block px-4">
                            this website is create by Vimushalan, Prasanna Ramana, Harshavardhan, SaiKumar, Tamilarasan
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

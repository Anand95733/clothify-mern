export function Footer() {
    return (
        <footer className="bg-slate-900 text-white py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4">Clothify</h3>
                        <p className="text-slate-400">Premium clothing for the modern individual.</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Links</h4>
                        <ul className="space-y-2 text-slate-400">
                            <li><a href="/" className="hover:text-white">Home</a></li>
                            <li><a href="/cart" className="hover:text-white">Cart</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact</h4>
                        <p className="text-slate-400">support@clothify.com</p>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
                    © {new Date().getFullYear()} Clothify. All rights reserved.
                </div>
            </div>
        </footer>
    );
}

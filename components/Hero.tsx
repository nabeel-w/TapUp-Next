export default function Hero() {
    return (
        <section className="bg-gray-900 text-white py-20">
            <div className="container mx-auto px-6 text-center">
                <h1 className="text-5xl font-extrabold mb-6 leading-tight">
                    Effortless File Upload and Organization
                </h1>
                <p className="text-xl mb-8">
                    Manage your files with ease. Drag-and-drop support, automated tagging, and customizable categorization—all in one place.
                </p>
                <div className="flex justify-center gap-8">
                    <a
                        href="#"
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg text-lg transition duration-300"
                    >
                        Get Started
                    </a>
                    <a
                        href="#features"
                        className="inline-block border-2 border-indigo-600 hover:bg-indigo-600 hover:text-white text-indigo-600 font-semibold py-3 px-6 rounded-lg text-lg transition duration-300"
                    >
                        Learn More
                    </a>
                </div>
            </div>
        </section>
    );
}
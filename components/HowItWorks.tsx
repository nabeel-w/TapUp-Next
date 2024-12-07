export default function HowItWorks() {
    return (
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">How It Works</h2>
          <div className="flex flex-col sm:flex-row justify-center gap-12">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full sm:w-1/3">
              <h3 className="text-2xl font-semibold mb-4">Upload Your Files</h3>
              <p>
                Simply drag-and-drop your files or use the upload button to add your files to TapUp.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full sm:w-1/3">
              <h3 className="text-2xl font-semibold mb-4">Organize and Tag</h3>
              <p>
                Categorize your files into custom folders and let TapUp auto-tag them for easy retrieval.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg w-full sm:w-1/3">
              <h3 className="text-2xl font-semibold mb-4">Access Anytime</h3>
              <p>
                Your files are securely stored, and you can access them from anywhere, at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
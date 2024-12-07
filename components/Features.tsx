export default function Features() {
    return (
      <section className="bg-gray-900 text-white py-16" id="features">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Multiple File Formats</h3>
              <p>
                Upload various file types including documents, images, videos, and more. TapUp supports it all.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Drag-and-Drop Uploading</h3>
              <p>
                Easily upload your files with a simple drag-and-drop interface or use the upload button.
              </p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Automated Tagging</h3>
              <p>
                Our intelligent tagging system automatically tags your files based on content and metadata.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
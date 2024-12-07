interface KeyModalProps{
    keyName: string;
    setKeyName: (name:string)=>void;
    setIsModalOpen: (open:boolean)=>void;
    generateApiKey: ()=>void;
}

export default function KeyModal({ keyName, setKeyName, setIsModalOpen, generateApiKey }:KeyModalProps){

    return(
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-2xl font-bold mb-4">Enter Key Name</h2>
            <input
              type="text"
              value={keyName}
              onChange={(e) => setKeyName(e.target.value)}
              placeholder="Key Name"
              className="w-full px-4 py-2 mb-4 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:border-blue-600"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-all"
              >
                Cancel
              </button>
              <button
                onClick={generateApiKey}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all"
              >
                Generate
              </button>
            </div>
          </div>
        </div>
    );
}
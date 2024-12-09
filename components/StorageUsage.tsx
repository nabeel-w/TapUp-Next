export default function StorageUsage() {
  // Static data for demonstration purposes
  const totalStorage = 10; // in GB
  const usedStorage = 6;   // in GB
  const remainingStorage = totalStorage - usedStorage;

  const usagePercentage = (usedStorage / totalStorage) * 100;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 pt-16">
      <div className="bg-gray-800 rounded-lg shadow-lg p-8 w-96">
        <h2 className="text-2xl font-semibold text-center mb-6">Storage Usage</h2>

        {/* Storage info */}
        <div className="flex justify-between mb-4">
          <span className="text-gray-400">Used:</span>
          <span>{usedStorage} GB</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-400">Total:</span>
          <span>{totalStorage} GB</span>
        </div>
        <div className="flex justify-between mb-6">
          <span className="text-gray-400">Remaining:</span>
          <span>{remainingStorage} GB</span>
        </div>

        {/* Progress bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-gray-400">Storage Usage</span>
            <span>{Math.round(usagePercentage)}%</span>
          </div>
          <div className="flex mb-4">
            <div className="w-full bg-gray-700 rounded-full">
              <div
                className="bg-blue-500 text-xs font-semibold text-blue-100 text-center p-0.5 leading-none rounded-l-full"
                style={{ width: `${usagePercentage}%` }}
              >
                {/* Empty space for the progress */}
              </div>
            </div>
          </div>
          {/* Remaining space indicator */}
          <div className="flex justify-between text-xs text-gray-400">
            <span>0 GB</span>
            <span>{totalStorage} GB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

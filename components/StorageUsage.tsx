import { useUserPlan } from "@/context/userPlanContext";

export default function StorageUsage() {
  const { userPlan, loading, error } = useUserPlan();

  if (loading) {
    return (
      <div className="bg-gray-900 text-white p-4 flex justify-center">
        <p className="bg-gray-800 px-4 py-2 rounded-md shadow-md">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900 text-white p-4 flex justify-center">
        <p className="text-red-500 bg-gray-800 px-4 py-2 rounded-md shadow-md">Error: {error}</p>
      </div>
    );
  }

  const totalStorage = userPlan?.storageSize ?? 10; // in GB
  const usedStorage = parseFloat(userPlan?.storageUsed ?? "6"); // in GB
  const remainingStorage = (totalStorage - usedStorage).toFixed(2);
  const usagePercentage = ((usedStorage / totalStorage) * 100).toFixed(2);

  return (
    <div className="bg-gray-900 text-white p-4 flex flex-col items-center">
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Storage Usage</h2>

        <div className="flex justify-between mb-4">
          <span className="text-gray-400">Used:</span>
          <span>{usedStorage.toFixed(2)} GB</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-400">Total:</span>
          <span>{totalStorage.toFixed(2)} GB</span>
        </div>
        <div className="flex justify-between mb-6">
          <span className="text-gray-400">Remaining:</span>
          <span>{remainingStorage} GB</span>
        </div>

        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <span className="text-gray-400">Storage Usage</span>
            <span>{usagePercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full">
            <div
              className="bg-blue-500 text-xs font-semibold text-blue-100 text-center p-0.5 leading-none rounded-l-full"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

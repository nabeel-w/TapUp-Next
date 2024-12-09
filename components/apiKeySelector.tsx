import { useApiKeyContext } from "@/context/apiKeyContext";

const ApiKeySelector = () => {
  const { apiKeys, activeApiKey, setActiveApiKey } = useApiKeyContext();

  return (
    <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md max-w-sm mx-auto mb-4">
      <h2 className="text-lg font-semibold mb-4">Active API Key:</h2>
      <div className="mb-4">
        <span className="block text-sm text-gray-400">Currently selected API Key: {activeApiKey ? `**** **** **** ${activeApiKey.slice(-4)}` : "None"}</span>
      </div>
      <select
        onChange={(e)=>setActiveApiKey(e.target.value)}
        value={activeApiKey || ""}
        className="w-full p-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select API Key</option>
        {apiKeys.map((key) => (
          <option key={`${key.key}${key.name}`} value={key.key} onClick={()=>setActiveApiKey(key.key)}>
            {key.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ApiKeySelector;

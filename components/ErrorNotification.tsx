import { AiOutlineCloseCircle } from 'react-icons/ai';

const ErrorNotification = ({ message, setError }: { message: string, setError: (error: string|null)=>void}) => {
  return (
    <div className="fixed bottom-5 right-5 bg-gray-800 text-white p-4 rounded-lg shadow-md flex items-center space-x-4" onClick={()=>setError(null)}>
      <AiOutlineCloseCircle className="text-red-500 text-2xl" />
      <div>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
};

export default ErrorNotification;

import { AiOutlineCheckCircle } from 'react-icons/ai';
import CircularProgress from '@mui/material/CircularProgress';

const UploadProgress = ({ progress, setProgress }: { progress: number, setProgress: (prog: number|null)=> void }) => {
    const isComplete = progress === 100
    return (
        <div className="fixed bottom-5 right-5 bg-gray-800 text-white p-4 rounded-lg shadow-md flex items-center space-x-4" onClick={()=>setProgress(null)}>
            {!isComplete ? (
                <>
                    <div className="relative w-10 h-10">
                        <div className="absolute inset-0 rounded-full border-4 border-gray-600"></div>
                        <CircularProgress variant="determinate" value={progress} />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs">{progress}%</span>
                        </div>
                    </div>
                    <div>
                        <p className="text-sm">Uploading...</p>
                    </div>
                </>
            ) : (
                <>
                    <AiOutlineCheckCircle className="text-green-500 text-2xl" />
                    <div>
                        <p className="text-sm">Upload Complete</p>
                    </div>
                </>
            )}
        </div>
    );

};

export default UploadProgress;

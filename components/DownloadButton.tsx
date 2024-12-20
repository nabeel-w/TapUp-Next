'use client'

interface DownloadButtonProps {
    fileName: string
}

export default function DownloadButton({ fileName }: DownloadButtonProps) {
    const downloadFile = async () => {
        try {
            const res = await fetch('/api/generate-download-url', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName }),
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.status}`);
            }
            const { url } = await res.json();

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch the file');
            }

            const blob = await response.blob();
            const urlFile = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = urlFile;
            a.download = fileName.split('/')[1]; // Specify the file name
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            // Revoke the object URL to free up memory
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to fetch download File:', error);
            return null;
        }
    }

    return (
        <div className="mb-6 ms-2">
            <button
                onClick={downloadFile}
                className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg shadow hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                Download File
            </button>
        </div>
    )
}

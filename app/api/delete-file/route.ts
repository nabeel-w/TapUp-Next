import { bucket } from '@/lib/bucket';
import processApiKey from '@/utils/processApiKey';
import { NextRequest, NextResponse } from 'next/server';
import { DeleteFileOptions } from '@google-cloud/storage'


const deleteFile = async (req: NextRequest) => {
    const { fileName }:{ fileName: string } = await req.json();
    if (!fileName) return new NextResponse(JSON.stringify({ message: 'fileName is required' }), { status: 400 });
    const apiKey: string | null = req.headers.get('x-api-key');
    if (!apiKey) return new NextResponse(JSON.stringify({ err: 'API Key is required' }), { status: 401 })
    const userId = await processApiKey(apiKey);
    if (!userId) return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });
    const DeleteOptions: DeleteFileOptions = { ignoreNotFound: false }

    try {
        await bucket.file(`${userId}/${fileName}`).delete(DeleteOptions);
        return new NextResponse(JSON.stringify({ message: 'File Deleted successfully' }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: 'Failed to delete file', error }), { status: 500 });
    }
}

export { deleteFile as POST }
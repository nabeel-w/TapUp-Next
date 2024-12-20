import { bucket } from "@/lib/bucket";
import { GetSignedUrlConfig } from "@google-cloud/storage";
import { NextRequest, NextResponse } from "next/server";

const generateDownloadUrl = async (req: NextRequest) => {
    const { fileName } = await req.json();
    const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };
    try {
        const [url] = await bucket.file(fileName).getSignedUrl(options);
        return new NextResponse(JSON.stringify({ url }), { status: 200 });
    } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: 'Failed to generate download URL', error }), { status: 500 });
    }
}

export { generateDownloadUrl as POST }
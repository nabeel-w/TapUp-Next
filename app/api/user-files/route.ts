import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { fileMetaData } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";

interface MetaData {
    objectId: string; // Unique identifier for the file
    name: string; // File name with the path
    generation: bigint; // Unique identifier for the version of the file
    metageneration: bigint; // Version of metadata for the file
    contentType: string; // MIME type of the file
    md5Hash: string; // MD5 hash of the file content
    selfLink: string; // URL to access file metadata
    mediaLink: string; // URL to download the file
    timeCreated: string; // Timestamp when the file was created (ISO 8601 format)
    updated: string; // Timestamp when the file metadata was last updated (ISO 8601 format)
    size: bigint; // Size of the file in bytes
    ownerId: string; // Identifier for the owner of the file
};

const jsonBigIntReplacer = (key, value) => {
    return typeof value === "bigint" ? value.toString() : value;
};


const getUserFiles = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId === 'undefined' || typeof userId !== 'string') {
        return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });
    }

    try {
        const cacheKey = `file_meta_data_tap-up-bucket/${userId}*`;
        const keys = await redis.keys(cacheKey);
        if(keys.length !== 0){
            const filesDataPromises = keys.map(async (key) => {
                const data: MetaData | null = await redis.get(key);
                return data || {} as MetaData;
            });
            const filesData = await Promise.all(filesDataPromises);
            return new NextResponse(JSON.stringify(filesData, jsonBigIntReplacer), { status: 200 });
        }
        const files = await db.select().from(fileMetaData).where(eq(fileMetaData.ownerId, userId));
        files.forEach(async file => await redis.set(`file_meta_data_${file.objectId}`, JSON.stringify(file, jsonBigIntReplacer)))
        return new NextResponse(JSON.stringify(files, jsonBigIntReplacer), { status: 200 });

    } catch (error) {
        console.error('Error fetching user files:', error);
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
}

export { getUserFiles as GET }
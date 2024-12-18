import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { fileTags } from "@/lib/schema";

interface FileTags {
    tags: string[];
    userId: string;
    objectId: string;
}

const getUserFilesTags = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId === 'undefined' || typeof userId !== 'string') {
        return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });
    }
    try {
        const fileTagsKeys = `objectTags_tap-up-bucket/${userId}*`;
        const keys = await redis.keys(fileTagsKeys);
        if (keys.length !== 0) {
            const filesDataPromises = keys.map(async (key) => {
                const data: FileTags | null = await redis.get(key);
                return data || {} as FileTags;
            });
            const filesData = await Promise.all(filesDataPromises);
            return new NextResponse(JSON.stringify(filesData), { status: 200 });
        }
        const fileTagsData = await db.select().from(fileTags).where(eq(fileTags.ownerId, userId));
        fileTagsData.forEach(async tags=>await redis.set(`objectTags_${tags.objectId}`, JSON.stringify(tags)));
        return new NextResponse(JSON.stringify(fileTagsData), { status: 200 });

    } catch (error) {
        console.error('Error fetching user files:', error);
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
}

export { getUserFilesTags as GET }
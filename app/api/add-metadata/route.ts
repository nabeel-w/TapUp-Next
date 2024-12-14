import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { subscriptions, userSubscriptions } from "@/lib/schema";

interface MetaData {
    objectId: string; // Unique identifier for the file
    name: string; // File name with the path
    generation: bigint; // Unique identifier for the version of the file
    metageneration: bigint; // Version of metadata for the file
    contentType: string; // MIME type of the file
    md5hash: string; // MD5 hash of the file content
    selfLink: string; // URL to access file metadata
    mediaLink: string; // URL to download the file
    timeCreated: string; // Timestamp when the file was created (ISO 8601 format)
    updated: string; // Timestamp when the file metadata was last updated (ISO 8601 format)
    size: bigint; // Size of the file in bytes
    ownerId: string; // Identifier for the owner of the file
}

interface userPlan {
    subscriptionName: string;
    storageSize: number;
    storageUsed: string;
    startDate: Date;
    endDate: Date | null;
};

const pubSubToken = process.env.PUBSUB_JOB_SECRET;

const setMetaData = async (req: NextRequest) => {
    const token = req.headers.get('x-pubsub-token');
    if (!token)
        return new NextResponse(JSON.stringify({ err: "Missing Pub/Sub Token" }), { status: 400 });
    if (token !== pubSubToken)
        return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });

    const { fileMetaData }: { fileMetaData: MetaData } = await req.json();
    if (!fileMetaData) return new NextResponse(JSON.stringify({ err: "Invalid request" }), { status: 400 });
    const fileSizeInGB = Number(fileMetaData.size) / (1024 * 1024 * 1024);
    try {
        const userPlanCache: userPlan | null = await redis.get(`userPlan_${fileMetaData.ownerId}`);
        if (!userPlanCache) {
            const userPlan = await db
                .select({
                    subscriptionName: subscriptions.name,
                    storageSize: subscriptions.storageSize,
                    storageUsed: userSubscriptions.storageUsed,
                    startDate: userSubscriptions.startDate,
                    endDate: userSubscriptions.endDate,
                })
                .from(userSubscriptions)
                .innerJoin(
                    subscriptions,
                    eq(subscriptions.id, userSubscriptions.subscriptionId)
                )
                .where(eq(userSubscriptions.userId, fileMetaData.ownerId));
            if (!userPlan.length) {
                return new NextResponse(JSON.stringify({ error: 'User plan not found' }), { status: 404 });
            }
            userPlan[0].storageUsed = (parseFloat(userPlan[0].storageUsed) + fileSizeInGB).toFixed(2);
            await redis.set(`file_meta_data_${fileMetaData.objectId}`, JSON.stringify(fileMetaData));
            await redis.set(`userPlan_${fileMetaData.ownerId}`, JSON.stringify(userPlan[0]));
            await db.update(userSubscriptions).set({ storageUsed: userPlan[0].storageUsed }).where(eq(userSubscriptions.userId, fileMetaData.ownerId));
        }
        else {
            userPlanCache.storageUsed = (parseFloat(userPlanCache.storageUsed) + fileSizeInGB).toFixed(2);
            await redis.set(`file_meta_data_${fileMetaData.objectId}`, JSON.stringify(fileMetaData));
            await redis.set(`userPlan_${fileMetaData.ownerId}`, JSON.stringify(userPlanCache));
            await db.update(userSubscriptions).set({ storageUsed: userPlanCache.storageUsed }).where(eq(userSubscriptions.userId, fileMetaData.ownerId));
        }
        return new NextResponse(JSON.stringify({ msg: 'MetaData Saved successfully' }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
}

export { setMetaData as POST };
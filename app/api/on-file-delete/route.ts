import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { fileMetaData, subscriptions, userSubscriptions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

const pubSubToken = process.env.PUBSUB_JOB_SECRET;

const deleteMetaData = async (req: NextRequest) => {

    const token = req.headers.get('x-pubsub-token');

    if (!token)
        return new NextResponse(JSON.stringify({ err: "Missing Pub/Sub Token" }), { status: 400 });
    if (token !== pubSubToken)
        return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });

    const { objectId, fileSize, ownerId } = await req.json();
    if (!objectId) return new NextResponse(JSON.stringify({ err: "Invalid request" }), { status: 400 });
    const fileSizeInGB = Number(fileSize) / (1024 * 1024 * 1024);
    try {
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
            .where(eq(userSubscriptions.userId, ownerId));
        if (!userPlan.length) {
            return new NextResponse(JSON.stringify({ error: 'User plan not found' }), { status: 404 });
        }
        userPlan[0].storageUsed = (parseFloat(userPlan[0].storageUsed) - fileSizeInGB).toFixed(2);
        await redis.unlink(`file_meta_data_${objectId}`);
        await redis.set(`userPlan_${ownerId}`, JSON.stringify(userPlan[0]));
        await db.update(userSubscriptions).set({ storageUsed: userPlan[0].storageUsed }).where(eq(userSubscriptions.userId, ownerId));
        await db.delete(fileMetaData).where(eq(fileMetaData.objectId, objectId));

        return new NextResponse(JSON.stringify({ message: 'File MetaData removed' }), { status: 200 });

    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }

}

export { deleteMetaData as POST }
import { GetSignedUrlConfig } from '@google-cloud/storage';
import { bucket } from '@/lib/bucket';
import mime from 'mime-types';
import { redis } from '@/lib/redis';
import { db } from '@/lib/db';
import { subscriptions, userSubscriptions } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import processApiKey from '@/utils/processApiKey';


interface userPlan {
    subscriptionName: string;
    storageSize: number;
    storageUsed: string;
    startDate: Date;
    endDate: Date | null;
};

interface UploadUrlParameters{
    fileName: string;
    fileSize: number;
}

function getContentType(fileName: string) {
    return mime.lookup(fileName) || 'application/octet-stream';
}

function gbToBytes(gb: number) {
    if (isNaN(gb) || gb < 0) {
        throw new Error("Input must be a non-negative number.");
    }
    const bytesInGB = 1024 ** 3; // 1 GB = 1024 * 1024 * 1024 bytes
    return gb * bytesInGB;
}

const generateUploadUrl = async (req: NextRequest) => {
    const { fileName, fileSize }: UploadUrlParameters = await req.json();
    const apiKey: string | null = req.headers.get('x-api-key');
    if(!apiKey) return new NextResponse(JSON.stringify({ err: 'API Key is required' }), { status: 401 })
    const userId = await processApiKey(apiKey);
    if (!userId) return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });

    const file = bucket.file(`${userId}/${fileName}`);
    const contentType = getContentType(fileName);
    const options: GetSignedUrlConfig = {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        contentType,
    };

    try {
        const userPlanCache: userPlan | null = await redis.get(`userPlan_${userId}`)
        let remainingStorage;
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
            .where(eq(userSubscriptions.userId, userId));
          if (!userPlan.length) return new NextResponse(JSON.stringify({ error: 'User plan not found' }), { status : 400 });
          remainingStorage = gbToBytes(userPlan[0].storageSize - parseFloat(userPlan[0].storageUsed));
        }
        else 
          remainingStorage = gbToBytes(userPlanCache.storageSize - parseFloat(userPlanCache.storageUsed));
        if (fileSize > remainingStorage) return new NextResponse(JSON.stringify({ error: 'Not enough storage' }), { status: 401 });
        // Generate the signed URL
        const [url] = await file.getSignedUrl(options);
        return new NextResponse(JSON.stringify({ url, contentType }), { status: 200 });
      } catch (error) {
        console.error(error);
        return new NextResponse(JSON.stringify({ message: 'Failed to generate upload URL', error }), { status: 500 });
      }
}

export { generateUploadUrl as POST }
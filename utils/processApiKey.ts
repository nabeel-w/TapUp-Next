import { db } from "@/lib/db";
import { apiKeys } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { redis } from "@/lib/redis";


export default async function processApiKey(apiKey: string) {
    try {
        const userCacheId: string | null = await redis.get(`userKey_${apiKey}`);
        if (!userCacheId) {
            const user = await db.select().from(apiKeys).where(eq(apiKeys.apiKey, apiKey));
            if (user.length === 0) {
                throw new Error('Invalid API key');
            }

            await redis.set(`userKey_${apiKey}`, user[0].userId);
            return user[0].userId;
        }
        else{
            return userCacheId
        }

    } catch (error: unknown) {
        if(error instanceof Error){
            console.error('Error in processing API key:', error);
            throw new Error('Error in processing API key:', error);
        }
        else{
            console.error('Unknown Error in processing API key:', error);
            throw new Error('Unknown Error in processing API key:');
        }
    }
}
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { subscriptions, userSubscriptions } from "@/lib/schema";
import { redis } from "@/lib/redis";

interface userPlan {
    subscriptionName: string;
    storageSize: number;
    storageUsed: string;
    startDate: Date;
    endDate: Date | null;
};

const getUserPlan = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (userId === 'undefined' || typeof userId !== 'string') {
        return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });
    }

    try {
        // Fetch user plan data
        const userPlanCache: userPlan | null = await redis.get(`userPlan_${userId}`);
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

            if (!userPlan.length) {
                return new NextResponse(JSON.stringify({ error: 'User plan not found' }), { status: 404 });
            }

            await redis.set(`userPlan_${userId}`, JSON.stringify(userPlan[0]));
            return new NextResponse(JSON.stringify(userPlan[0]), { status: 200 });
        }
        else{
            return new NextResponse(JSON.stringify(userPlanCache), { status: 200 });
        }
    } catch (error) {
        console.error('Error fetching user plan:', error);
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
}

export { getUserPlan as GET }
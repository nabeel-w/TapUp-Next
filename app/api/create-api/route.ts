import { NextRequest, NextResponse } from "next/server";
import { apiKeys } from "@/lib/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

const newApiKey = async (req: NextRequest) => {
    const { userId, keyName } = await req.json();
    if (!userId) return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });
    try {
        const apiKey = `sk-${Math.random().toString(36).substr(2, 16)}-${Date.now()}`;
        const result = await db.insert(apiKeys).values({
            apiKey,
            name: keyName,
            createdAt: new Date(),
            userId,
        }).returning();
        return new NextResponse(JSON.stringify({ result:result[0], msg: "New API key created" }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
}

const deleteKey = async (req: NextRequest) => {
    const { apiKey, userId } = await req.json();
    if (!userId) return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });
    try {
        await db.delete(apiKeys).where(eq(apiKeys.apiKey, apiKey));

        return new NextResponse(JSON.stringify({ msg: "API Key deleted" }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
}

const getAllKeys = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });
    }

    try {
        const result = await db.select().from(apiKeys).where(eq(apiKeys.userId, userId));

        return new NextResponse(JSON.stringify({ result }), { status: 200 });
    } catch (error) {
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
};


export { newApiKey as POST, deleteKey as DELETE, getAllKeys as GET };
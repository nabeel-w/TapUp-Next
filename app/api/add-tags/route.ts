import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";

const pubSubToken = process.env.PUBSUB_JOB_SECRET;

const addTags = async (req: NextRequest) => {
    const token = req.headers.get('x-pubsub-token');
    if (!token)
        return new NextResponse(JSON.stringify({ err: "Missing Pub/Sub Token" }), { status: 400 });
    if (token !== pubSubToken)
        return new NextResponse(JSON.stringify({ err: "Unauthorised request" }), { status: 400 });
    const { fileTags, objectId } = await req.json();
    const ownerId = objectId.split("/")[1];
    if(!fileTags || !objectId)
        return new NextResponse(JSON.stringify({ err: "Parameters Missing" }), { status: 400 });
    try {
        await redis.set(`objectTags_${objectId}`, JSON.stringify({ tags: fileTags, userId: ownerId, objectId: objectId })); 
        return new NextResponse(JSON.stringify({ message: 'Tags Saved Successfully' }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
}

export { addTags as POST }
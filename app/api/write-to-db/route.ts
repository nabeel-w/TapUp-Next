import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { fileMetaData, fileTags } from "@/lib/schema";
import { NextRequest, NextResponse } from "next/server";

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
};

interface objectTags {
    tags: string[];
    userId: string;
    objectId: string;
}

const PROCESSED_KEYS_SET = 'processed_file_meta_data_keys';
const PROCESSED_TAGS_SET = 'processed_object_tags';

const insertToDb = async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    try {
        const keys = await redis.keys('file_meta_data_*');
        await insertKeysToDb();

        if (keys.length === 0) {
            console.log('No file meta data or userPlan data found in cache');
            return new NextResponse(JSON.stringify({ msg: 'No new data to process' }), { status: 200 });
        }

        const processedKeys = await redis.smembers(PROCESSED_KEYS_SET);
        let keysToProcess: string[];
        if (processedKeys.length !== 0) {
            keysToProcess = keys.filter(key => !processedKeys.includes(key));
        }
        else {
            keysToProcess = keys;
        }

        if (keysToProcess.length === 0) {
            console.log('No new file meta data to process');
            return new NextResponse(JSON.stringify({ msg: 'No new data to process' }), { status: 200 });
        }

        const fileMetaDataPromises = keysToProcess.map(async (key) => {
            const data: MetaData | null = await redis.get(key);
            return data || {} as MetaData;
        });

        // Wait for all metadata to be fetched
        const allFileMetaData = await Promise.all(fileMetaDataPromises);

        const bulkInsertData = allFileMetaData.map((fileMetaData) => ({
            objectId: fileMetaData.objectId,
            name: fileMetaData.name,
            generation: fileMetaData.generation, // Drizzle might need it to be a string if BigInt is stored as string
            metageneration: fileMetaData.metageneration, // Same for metageneration
            contentType: fileMetaData.contentType,
            md5hash: fileMetaData.md5hash,
            selfLink: fileMetaData.selfLink,
            mediaLink: fileMetaData.mediaLink,
            timeCreated: fileMetaData.timeCreated,
            updated: fileMetaData.updated,
            size: fileMetaData.size, // Convert to string for BigInt
            ownerId: fileMetaData.ownerId,
        }));

        try {
            await db.insert(fileMetaData).values(bulkInsertData);
            keysToProcess.forEach(async key => await redis.sadd(PROCESSED_KEYS_SET, key))
            console.log('Bulk insertion completed successfully');

            return new NextResponse(JSON.stringify({ msg: 'Bulk insertion completed successfully' }), { status: 200 });
        } catch (error) {
            console.error('Error during bulk insertion:', error);
            return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
        }

    } catch (error) {
        console.error('Error inserting file metadata into DB:', error);
        return new NextResponse(JSON.stringify({ err: `Server Error: ${error}` }), { status: 500 });
    }
}

const insertKeysToDb = async () => {
    const tagKeys = await redis.keys('objectTags_*');
    if (tagKeys.length === 0) return;
    const processedTagKeys = await redis.smembers(PROCESSED_TAGS_SET);
    let keysToProcess: string[];
    if (processedTagKeys.length !== 0) {
        keysToProcess = tagKeys.filter(key => !processedTagKeys.includes(key));
    }
    else {
        keysToProcess = tagKeys;
    }
    if (keysToProcess.length === 0) return;

    const objectTagsPromise = keysToProcess.map(async (key) => {
        const data: objectTags | null = await redis.get(key);
        return data || {} as objectTags;
    });

    const allObjectTagData = await Promise.all(objectTagsPromise);
    const bulkInsertKeyData = allObjectTagData.map(key => {
        return {
            objectId: key.objectId,
            ownerId: key.userId,
            tags: key.tags,
        }
    });
    try {
        await db.insert(fileTags).values(bulkInsertKeyData);
        keysToProcess.forEach(async key => await redis.sadd(PROCESSED_TAGS_SET, key))
        return;
    } catch (error) {
        console.log(error);
        return;
    }
}

export { insertToDb as GET }
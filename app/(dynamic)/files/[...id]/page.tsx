import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { redis } from '@/lib/redis';
import { fileMetaData, fileTags } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import DisplayFile from '@/components/DisplayFile';

interface Metadata {
    objectId: string;
    name: string;
    generation: bigint;
    metageneration: bigint;
    contentType: string;
    md5hash: string;
    selfLink: string;
    mediaLink: string;
    timeCreated: string;
    updated: string;
    size: bigint;
    ownerId: string;
    permission: string | null;
}

interface ObjectTags {
    tags: string[];
    ownerId: string;
    objectId: string;
}



async function getFileMetadata(id: string): Promise<Metadata> {
    const MetaData: Metadata | null = await redis.get(`file_meta_data_${id}`);
    if (!MetaData) {
        const fileMetaDataDb = await db.select().from(fileMetaData).where(eq(fileMetaData.objectId, id));
        if (fileMetaDataDb.length > 0)
            return fileMetaDataDb[0]
        else notFound();
    }
    else return MetaData;
}

async function getFileTags(id: string): Promise<ObjectTags> {
    const tags: ObjectTags | null = await redis.get(`objectTags_${id}`)
    if (!tags) {
        const fileTagsData = await db.select().from(fileTags).where(eq(fileTags.objectId, id));
        if (fileTagsData.length > 0)
            return fileTagsData[0];
        else
            return { tags: [], ownerId: '', objectId: id }
    }
    else return tags;
}

export default async function FilePage({ params }: { params: Promise<{ id: string[] }> }) {
    const id = (await params).id;
    const objectId = decodeURIComponent(`${id[0]}/${id[1]}/${id[2]}/${id[3]}`);
    const metadata = await getFileMetadata(objectId);
    const tags = await getFileTags(objectId);

    return (
        <DisplayFile metadata={metadata} tags={tags}/>
    )
}


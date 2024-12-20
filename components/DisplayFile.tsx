'use client'
import { useSession } from "next-auth/react";
import DownloadButton from "./DownloadButton";
import Link from "next/link";


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

interface DisplayFileProps {
    metadata: Metadata;
    tags: ObjectTags;
}

const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';

    const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
    const sizeIndex = Math.floor(Math.log(bytes) / Math.log(1024));

    const size = (bytes / Math.pow(1024, sizeIndex)).toFixed(2); // Limiting to 2 decimal places
    return `${size} ${units[sizeIndex]}`;
};

export default function DisplayFile({ metadata, tags }: DisplayFileProps) {
    const { data: session, status } = useSession()

    if (status === "loading") {
        return (
            <div className="relative top-4 left-4  h-full">
                <p className="text-white bg-gray-800 px-4 py-2 rounded-md shadow-md">Loading...</p>
            </div>
        )
    }

    const isAuthorized = session?.user.id === metadata.name.split('/')[0] || metadata.permission === 'public'
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-gray-900 relative mx-auto mt-10">
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                    <h2 className="text-2xl font-bold mb-4 text-white">Not Authorized</h2>
                    <p className="text-gray-300 mb-4">Sorry, you don&apos;t have permission to access this page.</p>
                    <Link href="/home" className="text-blue-400 hover:text-blue-300 underline">
                        Return to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">File Details</h1>
                <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
                    {tags.tags.length > 0 && (
                        <div className="bg-gray-800 rounded-lg shadow-lg p-4 mb-10">
                            <h2 className="text-xl font-semibold mb-4">Tags</h2>
                            <div className="flex flex-wrap gap-2 ms-4">
                                {tags.tags.map((tag, index) => (
                                    <span key={index} className="px-3 py-1 bg-blue-600 text-xs rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    <h2 className="text-2xl font-semibold mb-4">Metadata</h2>
                    <DownloadButton fileName={metadata.name} />
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Object ID</dt>
                            <dd className="mt-1 text-sm">{metadata.objectId}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Name</dt>
                            <dd className="mt-1 text-sm">{metadata.name.split('/')[1]}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Generation</dt>
                            <dd className="mt-1 text-sm">{metadata.generation.toString()}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Metageneration</dt>
                            <dd className="mt-1 text-sm">{metadata.metageneration.toString()}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Content Type</dt>
                            <dd className="mt-1 text-sm">{metadata.contentType}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">MD5 Hash</dt>
                            <dd className="mt-1 text-sm">{metadata.md5hash}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Self Link</dt>
                            <dd className="mt-1 text-sm">
                                <a href={metadata.selfLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-wrap">
                                    {metadata.selfLink}
                                </a>
                            </dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Media Link</dt>
                            <dd className="mt-1 text-sm">
                                <a href={metadata.mediaLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline text-wrap">
                                    {metadata.mediaLink}
                                </a>
                            </dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Time Created</dt>
                            <dd className="mt-1 text-sm">{new Date(metadata.timeCreated).toLocaleString()}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Updated</dt>
                            <dd className="mt-1 text-sm">{new Date(metadata.updated).toLocaleString()}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Size</dt>
                            <dd className="mt-1 text-sm">{formatFileSize(Number(metadata.size))}</dd>
                        </div>
                        <div className="mb-4">
                            <dt className="font-medium text-gray-400">Owner ID</dt>
                            <dd className="mt-1 text-sm">{metadata.ownerId}</dd>
                        </div>
                        {metadata.permission && (
                            <div className="mb-4">
                                <dt className="font-medium text-gray-400">Permission</dt>
                                <dd className="mt-1 text-sm">{metadata.permission}</dd>
                            </div>
                        )}
                    </dl>
                </div>
            </div>
        </div>
    )
}
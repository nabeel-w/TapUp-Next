// components/FileTable.tsx
import { useUserFiles } from "@/context/userFilesContext";
import { useCallback, useMemo, useState } from "react";
import TableRow from "./TableRow";
import { FaSearch } from "react-icons/fa";
import { useUserFilesTags } from "@/context/userFileTagsContext";

interface TagMap {
    [key: string]: string[];
}

const FileTable = () => {
    const [search, setSearch] = useState("");
    const { files } = useUserFiles();
    const { fileTags } = useUserFilesTags();

    const tagMap = useMemo(() => {
        const map: TagMap = {};
        fileTags?.forEach((tagObj) => {
            map[tagObj.objectId] = tagObj.tags;
        });
        return map;
    }, [fileTags]);

    const filterFilesByTagsAndName = useCallback(() => {
        const lowerSearch = search.toLowerCase();

        return files?.filter((file) => {
            // Get tags for the current file using the memoized hash map
            const fileTags = tagMap[file.objectId] || [];

            // Check if the file name matches the search
            const nameMatches = file.name.toLowerCase().includes(lowerSearch);

            // Check if any tag matches the search
            const tagMatches = fileTags.some((tag) =>
                tag.toLowerCase().includes(lowerSearch)
            );

            // Return true if either name or tags match
            return nameMatches || tagMatches;
        });
    }, [files, tagMap, search]);

    // Step 3: Call the filter function and render the results
    const filteredFiles = useMemo(() => filterFilesByTagsAndName(), [
        filterFilesByTagsAndName,
    ]);

    return (
        <>
            <div className="p-6 bg-gray-900 text-white rounded-lg">
                {/* Search Bar */}
                <div className="mb-4 w-60 ms-auto relative">
                    <input
                        type="text"
                        placeholder="Search files..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 rounded-md bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-gray-400">
                        <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                            <tr>
                                <th scope="col" className="px-4 py-2">Name</th>
                                <th scope="col" className="px-4 py-2">Size</th>
                                <th scope="col" className="px-4 py-2">Version</th>
                                <th scope="col" className="px-4 py-2">Content Type</th>
                                <th scope="col" className="px-4 py-2">Created At</th>
                                <th scope="col" className="px-4 py-2">Time Created</th>
                                <th scope="col" className="px-4 py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFiles?.length ?? 0 > 0 ? (
                                filteredFiles?.map((file, index) => (
                                    <TableRow file={file} key={index} />
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={7}
                                        className="px-4 py-2 text-center text-gray-500"
                                    >
                                        No files found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default FileTable;

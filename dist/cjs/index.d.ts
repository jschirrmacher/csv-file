/// <reference types="node" />
import fs from "fs";
export declare type FileSystem = Pick<typeof fs, "appendFileSync" | "existsSync" | "readFileSync" | "statSync" | "writeFileSync">;
export default function (fileName: string, fields?: string[]): {
    read(): any[];
    append(data: Record<string, unknown>): void;
    injectFileSystem(fileSystem: FileSystem): void;
};

/// <reference types="node" />
export interface FileSystem {
    appendFileSync: (fileName: string, data: string) => void;
    existsSync: (fileName: string) => boolean;
    readFileSync: (fileName: string) => Buffer;
    statSync: (fileName: string) => {
        size: number;
    };
    writeFileSync: (fileName: string, data: string) => void;
}
export default function (fileName: string, fields?: string[]): {
    read(): any[];
    append(data: Record<string, unknown>): void;
    injectFileSystem(fileSystem: FileSystem): void;
};

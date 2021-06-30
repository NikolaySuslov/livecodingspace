interface IconFile {
    ok: boolean;
    status: number;
    svg: string;
}
export declare const requestIcon: (url: string) => Promise<IconFile> | undefined;
export {};

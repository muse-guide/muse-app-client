export interface Exposable {
    id: string;
    lang: string;
    langOptions: string[];
    title: string;
    subtitle?: string;
    article?: string;
    imageUrls: string[];
    audio?: string;
}

export const langMap = new Map<string, string>([
    ["pl-PL", "pl"],
    ["en-GB", "gb"],
    ["es-ES", "es"]
])

export interface PaginatedResults {
    items: { [key: string]: any; }[],
    count: number,
    nextPageKey?: string | undefined
}
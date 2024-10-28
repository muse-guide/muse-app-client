export interface Exhibit {
    id: string;
    exhibitionId: string;
    number: number;
    lang: string;
    langOptions: string[];
    title: string;
    subtitle: string;
    article?: string;
    imageUrls: string[];
    audio?: string;

    // TODO: not included in responsem shell it be there?
    nextExhibitId?: string;
    prevExhibitId?: string;
    artistId?: string;
}

export function isExhibit(obj: any): obj is Exhibit {
    return (
        obj &&
        typeof obj.id === 'string' &&
        typeof obj.exhibitionId === 'string' &&
        typeof obj.number === 'number' &&
        typeof obj.lang === 'string' &&
        Array.isArray(obj.langOptions) &&
        typeof obj.title === 'string' &&
        typeof obj.subtitle === 'string' &&
        (typeof obj.article === 'string' || obj.article === undefined) &&
        Array.isArray(obj.imageUrls) &&
        (typeof obj.audio === 'string' || obj.audio === undefined) &&
        (typeof obj.nextExhibitId === 'string' || obj.nextExhibitId === undefined) &&
        (typeof obj.prevExhibitId === 'string' || obj.prevExhibitId === undefined) &&
        (typeof obj.artistId === 'string' || obj.artistId === undefined)
    );
}
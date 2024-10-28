export interface Exhibition {
    id: string;
    institutionId?: string;
    lang: string;
    langOptions: string[];
    title: string;
    subtitle: string;
    article?: string;
    imageUrls: string[];
    audio?: string;
}

export function isExhibition(obj: any): obj is Exhibition {
    return (
        obj &&
        typeof obj.id === 'string' &&
        (typeof obj.institutionId === 'string' || obj.institutionId === undefined) &&
        typeof obj.lang === 'string' &&
        Array.isArray(obj.langOptions) &&
        typeof obj.title === 'string' &&
        typeof obj.subtitle === 'string' &&
        (typeof obj.article === 'string' || obj.article === undefined) &&
        Array.isArray(obj.imageUrls) &&
        (typeof obj.audio === 'string' || obj.audio === undefined)
    );
}
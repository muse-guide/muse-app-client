export interface Exhibit {
    id: string;
    exhibitionId: string;
    number: number;
    lang: string;
    langOptions: string[];
    title: string;
    subtitle: string;
    description?: string;
    imageUrls: string[];
    audio?: string;

    // TODO: not included in responsem shell it be there?
    nextExhibitId?: string;
    prevExhibitId?: string;
    artistId?: string;
}
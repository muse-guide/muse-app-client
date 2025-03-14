import {Exposable} from "./common";

export interface Exhibit extends Exposable {
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
}

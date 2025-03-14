import {Exposable} from "./common";

export interface Institution extends Exposable {
    id: string;
    lang: string;
    langOptions: string[];
    title: string;
    subtitle?: string;
    article?: string;
    imageUrls: string[];
    audio?: string;
}
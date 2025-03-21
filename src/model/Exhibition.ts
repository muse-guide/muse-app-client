import {Exposable} from "./common";

export interface Exhibition extends Exposable {
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

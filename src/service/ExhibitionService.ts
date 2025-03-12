import api from "../http/client";
import {Exhibition} from "../model/Exhibition";
import {PaginatedResults} from "../model/common";

async function getExhibition(lang: string, id: string): Promise<Exhibition> {
    const response = await api.get<Exhibition>(`exhibitions/${id}`, {
        params: {
            lang: lang
        }
    });
    if (!response.data) {
        throw new Error(`Failed to retrieve exhibition`);
    }
    return response.data;
}

async function getExhibitionsFor(institutionId: string, lang: string, nextPageKey?: string): Promise<PaginatedResults> {
    const response = await api.get<PaginatedResults>(`institutions/${institutionId}/exhibitions`, {
        params: {
            "lang": lang,
            "page-size": 5,
            "next-page-key": nextPageKey
        }
    });

    if (!response.data || !response.data.items) {
        throw new Error(`Failed to retrieve exhibitions`);
    }
    return response.data;
}

export const exhibitionService = {
    getExhibition: getExhibition,
    getExhibitionsFor: getExhibitionsFor
};

import api from "../http/client";
import {Exhibit} from "../model/Exhibit";
import {PaginatedResults} from "../model/common";

async function getExhibit(lang: string, id: string): Promise<Exhibit> {
    const response = await api.get<Exhibit>(`exhibits/${id}`, {
        params: {
            "lang": lang,
        }
    });
    if (!response.data) {
        throw new Error(`Failed to retrieve exhibit`);
    }
    return response.data;
}

async function getExhibitsFor(exhibitionId: string, lang: string, nextPageKey?: string, number?: number): Promise<PaginatedResults> {
    const response = await api.get<PaginatedResults>(`exhibitions/${exhibitionId}/exhibits`, {
        params: {
            "lang": lang,
            "number": number,
            "page-size": 5,
            "next-page-key": nextPageKey
        }
    });

    if (!response.data || !response.data.items) {
        throw new Error(`Failed to retrieve exhibits`);
    }
    return response.data;
}

export const exhibitService = {
    getExhibit: getExhibit,
    getExhibitsFor: getExhibitsFor
};

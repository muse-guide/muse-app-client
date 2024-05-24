import api from "../http/client";
import {Exhibit} from "../model/Exhibit";
import {PaginatedResults} from "../model/common";

async function getExhibit(lang: string, id: string): Promise<Exhibit> {
    try {
        const response = await api.get<Exhibit>(`exhibits/${id}`, {
            params: {
                "lang": lang,
            }
        });
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve exhibit with error: ${err}`);
        throw err;
    }
}

async function getExhibitsFor(exhibitionId: string, lang: string, nextPageKey?: string, searchTerm?: number): Promise<PaginatedResults> {
    try {
        const response = await api.get<PaginatedResults>(`exhibits`, {
            params: {
                "exhibition-id": exhibitionId,
                "lang": lang,
                "search-term": searchTerm,
                "page-size": 5,
                "next-page-key": nextPageKey
            }
        });
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve exhibit with error: ${err}`);
        throw err;
    }
}

export const exhibitService = {
    getExhibit: getExhibit,
    getExhibitsFor: getExhibitsFor
};

import api from "../http/client";
import {Institution} from "../model/Institution";

async function getInstitution(lang: string, id: string): Promise<Institution> {
    const response = await api.get<Institution>(`institutions/${id}`, {
        params: {
            lang: lang
        }
    });
    if (!response.data) {
        throw new Error(`Failed to retrieve institution`);
    }
    return response.data;
}

export const institutionService = {
    getInstitution: getInstitution,
};

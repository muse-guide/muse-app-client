import api from "../http/client";
import {Exhibition, isExhibition} from "../model/Exhibition";

async function getExhibition(lang: string, id: string): Promise<Exhibition> {
    const response = await api.get<Exhibition>(`exhibitions/${id}`, {
        params: {
            lang: lang
        }
    });
    if (!response.data || !isExhibition(response.data)) {
        throw new Error(`Failed to retrieve exhibition with error`);
    }
    return response.data;
}

export const exhibitionService = {
    getExhibition: getExhibition,
};

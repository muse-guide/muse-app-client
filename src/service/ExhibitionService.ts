import api from "../http/client";
import {Exhibition} from "../model/Exhibition";

async function getExhibition(lang: string, id: string): Promise<Exhibition> {
    try {
        const response = await api.get<Exhibition>(`exhibitions/${id}/${lang}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve exhibit with error: ${err}`);
        throw err;
    }
}

export const exhibitionService = {
    getExhibition: getExhibition,
};

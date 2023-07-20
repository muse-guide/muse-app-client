import api from "../http/client";
import {Exhibit} from "../model/Exhibit";

async function getExhibit(lang: string, id: string): Promise<Exhibit> {
    try {
        const response = await api.get<Exhibit>(`exhibits/${id}/${lang}`);
        return response.data;
    } catch (err) {
        console.error(`Failed to retrieve exhibit with error: ${err}`);
        throw err;
    }
}

export const exhibitService = {
    getExhibit: getExhibit,
};

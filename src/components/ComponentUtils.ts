import { ReactNode } from "react";

export type BaseProps = {
    children: ReactNode;
};

export const formatDuration = (value: number) => {
    if (isNaN(value)) return "00:00";
    const minute = Math.floor(value / 60);
    const secondLeft = Math.round(value - minute * 60);
    return `${minute < 10 ? `0${minute}` : minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`;
};

export const normalizeText = (text: string, length: number): string => {
    return `${text.slice(0, length).trim()}${text.length > length ? "..." : ""}`;
};

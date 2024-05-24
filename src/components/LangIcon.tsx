import {CircleFlag} from "react-circle-flags";
import React, {useMemo} from "react";
import {langMap} from "../model/common";

// TODO: change flag provider or create own flag component
export const LangIcon = ({lang, height = "24"}: { lang: string, height?: string }) => {
    const resolvedLang = useMemo(() => langMap.get(lang) ?? "", [lang])

    return (
        <CircleFlag countryCode={resolvedLang} height={height}/>
    )
}
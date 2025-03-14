import {AppBar, Slide, Stack, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {institutionService} from "../../service/InstitutionService";
import {Institution} from "../../model/Institution";
import {ImageStepper} from "../../components/ImageStepper";
import LanguageSelector from "../../components/LanguageSelector";
import {InstitutionDetails} from "./institutionDetails";
import {ExhibitionList} from "./ExhibitionList";
import {ArticlePreview} from "./ArticlePreview";

const InstitutionPage = () => {
    const {institutionId} = useParams();
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();
    const [institution, setInstitution] = useState<Institution>();
    const [institutionLoading, setInstitutionLoading] = useState<boolean>(false);

    useEffect(() => {
        getInstitutionAsync(i18n.language, institutionId);
    }, [i18n.language, institutionId]);

    const getInstitutionAsync = async (lang: string, institutionId?: string) => {
        if (!institutionId) return;
        setInstitutionLoading(true);
        try {
            const institution = await institutionService.getInstitution(lang, institutionId);
            // if there is no preferred language backend will return default institution language
            if (lang !== institution.lang) {
                await i18n.changeLanguage(institution.lang);
            }
            setInstitution(institution);
        } catch (err) {
            console.error(`Failed to retrieve exhibit with error: ${err}`);
            navigate("/error");
        } finally {
            setInstitutionLoading(false);
        }
    };

    const langOptions = useMemo(() => institution ? institution?.langOptions : undefined, [institution])

    return (
        <Stack>
            <InstitutionMainBar loading={institutionLoading} langOptions={langOptions}/>
            <Stack>
                <ImageStepper images={institution?.imageUrls} loading={institutionLoading}/>
                <InstitutionDetails institution={institution} loading={institutionLoading}/>
                <ArticlePreview article={institution?.article} loading={institutionLoading}/>
                <ExhibitionList institutionId={institutionId}/>
                <Stack height={100} width={"100%"} alignItems={"center"} justifyContent={"center"}>
                    <Typography variant={"caption"} color={"textSecondary"}>
                        Powered by <b>museo.guide</b>
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    );
};

export default InstitutionPage;

interface InstitutionMainBarProps {
    loading: boolean;
    institutionId?: string;
    langOptions?: string[];
}

function InstitutionMainBar(props: InstitutionMainBarProps) {
    const trigger = useScrollTrigger();

    return (
        <React.Fragment>
            <Slide appear={false} direction="down" in={!trigger}>
                <AppBar elevation={0} color="inherit" sx={{background: 'linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0) 100%)'}}>
                    {!props.loading && (
                        <Toolbar sx={{
                            paddingX: 3,
                            justifyContent: 'end'
                        }}>
                            <LanguageSelector languages={props.langOptions ?? []}/>
                        </Toolbar>
                    )}
                </AppBar>
            </Slide>
        </React.Fragment>
    );
}


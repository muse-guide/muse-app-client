import {AppBar, Box, IconButton, Slide, Stack, Toolbar, useScrollTrigger} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {exhibitionService} from "../../service/ExhibitionService";
import {Exhibition} from "../../model/Exhibition";
import {ImageStepper} from "../../components/ImageStepper";
import {ExhibitList} from "./ExhibitList";
import LanguageSelector from "../../components/LanguageSelector";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {ExposableDetails} from "../../components/ExposableDetails";
import {ArticlePreview} from "../../components/ArticlePreview";
import Footer from "../../components/Footer";


const ExhibitionPage = () => {
    const {exhibitionId} = useParams();
    const navigate = useNavigate();
    const {t, i18n} = useTranslation();
    const [exhibition, setExhibition] = useState<Exhibition>();
    const [exhibitionLoading, setExhibitionLoading] = useState<boolean>(false);

    useEffect(() => {
        getExhibitionAsync(i18n.language, exhibitionId);
    }, [i18n.language, exhibitionId]);

    const getExhibitionAsync = async (lang: string, exhibitionId?: string) => {
        if (!exhibitionId) return;
        setExhibitionLoading(true);
        try {
            const exhibition = await exhibitionService.getExhibition(lang, exhibitionId);
            // if there is no preferred language backend will return default exhibition language
            if (lang !== exhibition.lang) {
                await i18n.changeLanguage(exhibition.lang);
            }
            setExhibition(exhibition);
        } catch (err) {
            console.error(`Failed to retrieve exhibit with error: ${err}`);
            navigate("/error");
        } finally {
            setExhibitionLoading(false);
        }
    };

    const langOptions = useMemo(() => exhibition ? exhibition?.langOptions : undefined, [exhibition])

    return (
        <Stack height={"100vh"} display={"flex"}>
            <ExhibitionMainBar loading={exhibitionLoading} langOptions={langOptions} institutionId={exhibition?.institutionId}/>
            <Stack display={"flex"} flexGrow={1}>
                <ImageStepper images={exhibition?.imageUrls} loading={exhibitionLoading}/>
                <ExposableDetails exposable={exhibition} loading={exhibitionLoading}/>
                <ArticlePreview article={exhibition?.article} loading={exhibitionLoading}/>
                <ExhibitList exhibitionId={exhibitionId}/>
                <Footer/>
            </Stack>
        </Stack>
    );
};

export default ExhibitionPage;

interface ExhibitionMainBarProps {
    loading: boolean;
    institutionId?: string;
    langOptions?: string[];
}

function ExhibitionMainBar(props: ExhibitionMainBarProps) {
    const trigger = useScrollTrigger();
    const navigate = useNavigate();

    const navigateToInstitution = () => {
        if (props.institutionId) navigate(`/institutions/${props.institutionId}`);
    };

    return (
        <React.Fragment>
            <Slide appear={false} direction="down" in={!trigger}>
                <AppBar elevation={0} color="inherit" sx={{background: 'linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0) 100%)'}}>
                    {!props.loading && (
                        <Toolbar sx={{
                            paddingX: 3,
                            justifyContent: 'space-between'
                        }}>
                            {props.institutionId &&
                                <IconButton sx={{padding: 0}} onClick={navigateToInstitution}>
                                    <ChevronLeftIcon fontSize={"large"} sx={{display: "flex", color: 'white'}}/>
                                </IconButton>
                            }
                            <Box/>
                            <LanguageSelector languages={props.langOptions ?? []}/>
                        </Toolbar>
                    )}
                </AppBar>
            </Slide>
        </React.Fragment>
    );
}
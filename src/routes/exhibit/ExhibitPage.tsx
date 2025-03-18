import {AppBar, Box, Button, IconButton, Skeleton, Slide, Stack, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {exhibitService} from "../../service/ExhibitService";
import {useTranslation} from "react-i18next";
import ArticleDialog from "../../components/article/ArticleDialog";
import {Exhibit} from "../../model/Exhibit";
import {useDialog} from "../../components/hooks";
import LanguageSelector from "../../components/LanguageSelector";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import {AudioPlayer} from "./AudioPlayer";
import {ExhibitImage} from "./ExhibitImage";
import {useTheme} from "@mui/material/styles";
import MenuBookRoundedIcon from '@mui/icons-material/MenuBookRounded';

const ExhibitPage = () => {
    const {exhibitId} = useParams();
    const {t, i18n} = useTranslation();
    const theme = useTheme();
    const navigate = useNavigate();
    const [exhibit, setExhibit] = useState<Exhibit>();
    const [loading, setLoading] = useState<boolean>(false);
    const descDialog = useDialog()

    useEffect(() => {
        getExhibitAsync(i18n.language, exhibitId);
    }, [i18n.language, exhibitId]);

    const getExhibitAsync = async (lang: string, exhibitId?: string) => {
        if (!exhibitId) return;
        setLoading(true);
        try {
            const exhibit = await exhibitService.getExhibit(lang, exhibitId);
            // if there is no preferred language backend will return default exhibit language
            if (lang !== exhibit.lang) {
                await i18n.changeLanguage(exhibit.lang);
            }
            setExhibit(exhibit);
        } catch (err) {
            console.error(`Failed to retrieve exhibit with error: ${err}`);
            navigate("/error");
        } finally {
            setLoading(false);
        }
    };

    const parentPage = useMemo(() => exhibit ? `/exhibitions/${exhibit?.exhibitionId}` : undefined, [exhibit])
    const title = useMemo(() => exhibit ? `${exhibit.number}. ${exhibit.title}` : undefined, [exhibit])
    const langOptions = useMemo(() => exhibit ? exhibit?.langOptions : undefined, [exhibit])
    const descAvailable: boolean = useMemo(() => !!(exhibit && exhibit?.article), [exhibit])

    return (
        <Slide direction="up" in={true} timeout={300}>
            <Stack height="100svh" alignItems={"start"} px={3} pb={3}>
                <ExhibitMainBar loading={loading} parentPageUrl={parentPage} title={title} langOptions={langOptions}/>
                <Toolbar/>
                {exhibit?.article && <ArticleDialog show={descDialog.isOpen} close={descDialog.closeDialog} title={exhibit?.title} article={exhibit.article}/>}

                <Box
                    display={"flex"}
                    flexDirection={"column"}
                    flexGrow={1}
                    alignItems={"center"}
                    justifyContent={"center"}
                    width={"100%"}
                >
                    {loading
                        ? <Skeleton
                            variant={"rectangular"}
                            width={'100%'}
                            sx={{
                                display: "block",
                                maxWidth: '260px',
                                maxHeight: '260px',
                                height: '100%',
                                aspectRatio: '1 / 1',
                            }}
                        />
                        : <ExhibitImage imageUrls={exhibit?.imageUrls}/>
                    }
                </Box>

                <Stack pt={1} gap={0.5} width={"100%"}>
                    {loading
                        ? <Stack width={"100%"} height={32} justifyContent={"center"}>
                            <Skeleton variant={"rectangular"} height={24} width={240}/>
                        </Stack>
                        : <Typography variant="h6" flexGrow={1} fontWeight={"bold"}>{exhibit?.title}</Typography>
                    }
                    {loading
                        ? <Stack width={"100%"} height={24} justifyContent={"center"}>
                            <Skeleton variant={"rectangular"} height={24} width={300}/>
                        </Stack>
                        : exhibit?.subtitle ?? <Typography variant="body1" color={"textSecondary"}>{exhibit?.subtitle}</Typography>
                    }
                </Stack>

                {loading
                    ? <Stack pt={1} width={"100%"} height={32} justifyContent={"center"}>
                        <Skeleton variant={"rectangular"} height={24} width={240}/>
                    </Stack>
                    : descAvailable &&
                    <Stack
                        display={"flex"}
                        color={theme.palette.text.secondary}
                        width={"100%"}
                        direction={"row"}
                        justifyContent={"start"}
                        alignItems={"center"}
                        pt={1}
                    >
                        <Button
                            variant="text"
                            color={"inherit"}
                            sx={{textTransform: 'none'}}
                            startIcon={<MenuBookRoundedIcon color={"inherit"} fontSize={"large"}/>}
                            onClick={descDialog.openDialog}
                        >
                            <Typography variant={"subtitle2"} color={"textSecondary"}>{t('learnMore')}</Typography>
                        </Button>
                    </Stack>
                }

                <Stack width={"100%"} pt={0.5}>
                    {loading
                        ? <Stack pt={1.5} width={"100%"} justifyContent={"center"}>
                            <Skeleton variant={"rectangular"} width={'100%'} height={100}/>
                        </Stack>
                        : <AudioPlayer audioUrl={exhibit?.audio}/>
                    }
                </Stack>
            </Stack>
        </Slide>
    );
};

export default ExhibitPage;

interface ExhibitMainBarProps {
    loading: boolean;
    parentPageUrl?: string;
    title?: string;
    langOptions?: string[];
}

function ExhibitMainBar(props: ExhibitMainBarProps) {
    const trigger = useScrollTrigger();
    const navigate = useNavigate();
    const {t} = useTranslation();

    const navigateTo = (destination?: string) => {
        if (destination) navigate(destination);
    };

    return (
        <React.Fragment>
            <Slide appear={false} direction="down" in={!trigger}>
                <AppBar elevation={0} color="inherit">
                    <Toolbar sx={{paddingX: 3}}>
                        {!props.loading &&
                            <IconButton sx={{padding: 0}} onClick={() => navigateTo(props.parentPageUrl)}>
                                <KeyboardArrowDownIcon fontSize={"large"} sx={{display: "flex"}} color={"primary"}/>
                            </IconButton>
                        }

                        <Box
                            sx={{
                                display: "flex",
                                flexGrow: 1,
                                justifyContent: "center",
                                paddingLeft: 0,
                                paddingRight: 0,
                            }}
                        >
                            <Typography variant="body2" sx={{fontWeight: 'bold', textTransform: 'none'}}>
                                {t('nowPlaying')}
                            </Typography>
                        </Box>

                        {!props.loading &&
                            <LanguageSelector languages={props.langOptions ?? []}/>
                        }
                    </Toolbar>
                </AppBar>
            </Slide>
        </React.Fragment>
    );
}


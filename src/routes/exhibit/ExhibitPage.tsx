import {AppBar, Avatar, Box, IconButton, Skeleton, Slide, Stack, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {exhibitService} from "../../service/ExhibitService";
import {useTranslation} from "react-i18next";
import {SubtitleRenderer} from "../../components/TextRenderer";
import DescriptionDialog from "../../components/DescriptionDialog";
import {Exhibit} from "../../model/Exhibit";
import {useDialog} from "../../components/hooks";
import LanguageSelector from "../../components/LanguageSelector";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {AudioPlayer} from "./AudioPlayer";
import {ExhibitImage} from "./ExhibitImage";

const ExhibitPage = () => {
    const {exhibitId} = useParams();
    const {t, i18n} = useTranslation();

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
    const descAvailable: boolean = useMemo(() => !!(exhibit && exhibit?.description), [exhibit])

    return (
        <Slide direction="up" in={true} timeout={300}>
            <Stack height="100svh" alignItems={"start"} px={3} pb={3}>
                <ExhibitMainBar loading={loading} parentPageUrl={parentPage} title={title} langOptions={langOptions}/>
                <Toolbar/>
                {exhibit?.description && <DescriptionDialog show={descDialog.isOpen} close={descDialog.closeDialog} title={exhibit?.title} description={exhibit.description}/>}

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
                                maxWidth: '280px',
                                maxHeight: '280px',
                                height: '100%',
                                aspectRatio: '1 / 1',
                            }}
                        />
                        : <ExhibitImage imageUrls={exhibit?.imageUrls}/>
                    }
                </Box>

                <Stack width={"100%"} pt={2} gap={0.5}>
                    {loading
                        ? <Skeleton variant={"rectangular"} height={24} width={240}/>
                        : <Stack direction={"row"} display={"flex"} width={"100%"} alignItems={"center"}>
                            <Typography variant="body1" flexGrow={1} fontWeight={"bolder"}>
                                {exhibit?.title}
                            </Typography>
                            <IconButton sx={{paddingRight: 0}} onClick={descAvailable ? descDialog.openDialog : undefined}>
                                <DescriptionOutlinedIcon sx={{fontSize: 28}} fontSize={"medium"} color={descAvailable ? "secondary" : "disabled"}/>
                            </IconButton>
                        </Stack>
                    }
                    {loading
                        ? <Skeleton variant={"rectangular"} height={48} width={300}/>
                        : <Stack display={"flex"} alignItems={"start"}>
                            <SubtitleRenderer subtitle={exhibit?.subtitle}/>
                        </Stack>
                    }
                    {exhibit?.artistId &&
                        <Stack direction={"row"} gap={1} pt={1}>
                            <Avatar
                                sx={{width: 20, height: 20}}
                                src={`https://duz68kh4juaad.cloudfront.net/${exhibit?.imageUrls[0]}`}
                            />
                            <Typography variant="subtitle2">
                                Tadeusz Kościuszko
                            </Typography>
                        </Stack>
                    }
                </Stack>

                <Stack width={"100%"} pt={1.5}>
                    {loading
                        ? <Skeleton variant={"rectangular"} width={'100%'} height={130}/>
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
                                <KeyboardArrowDownIcon sx={{display: "flex"}} color={"primary"}/>
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
                            <Typography variant="overline">
                                Now playing
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


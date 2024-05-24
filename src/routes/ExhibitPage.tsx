import {Box, IconButton, Skeleton, Slide, Stack, Toolbar, Typography} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {exhibitService} from "../service/ExhibitService";
import {useTranslation} from "react-i18next";
import {SubtitleRenderer} from "../components/TextRenderer";
import ContentMainBar from "../components/ContentMainBar";
import Player from "../components/player/AudioPlayer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionDialog from "../components/DescriptionDialog";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import {Exhibit} from "../model/Exhibit";
import {useDialog} from "../components/hooks";
import CollectionsIcon from '@mui/icons-material/Collections';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const ExhibitPage = () => {
    const {exhibitId} = useParams();
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const [exhibit, setExhibit] = useState<Exhibit>();
    const [loading, setLoading] = useState<boolean>(false);
    const descDialog = useDialog()
    const imgPrevDialog = useDialog()

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
            navigate("/error");
        } finally {
            setLoading(false);
        }
    };

    const parentPage = useMemo(() => exhibit ? `/exhibitions/${exhibit?.exhibitionId}` : undefined, [exhibit])
    const title = useMemo(() => exhibit ? `${exhibit.number}. ${exhibit.title}` : undefined, [exhibit])
    const langOptions = useMemo(() => exhibit ? exhibit?.langOptions : undefined, [exhibit])
    const descAvailable: boolean = useMemo(() => !!(exhibit && exhibit?.description), [exhibit])

    // TODO fix with development setup
    const audioUrl = useMemo(() => exhibit && exhibit?.audio ? `https://duz68kh4juaad.cloudfront.net/${exhibit.audio}` : undefined, [exhibit])
    const imageUrls = useMemo(() => exhibit?.imageUrls?.map(image => `https://duz68kh4juaad.cloudfront.net/${image}`), [exhibit])

    return (
        <Slide direction="right" in={true} timeout={300}>
            <Stack height="100svh">
                <ContentMainBar loading={loading} parentPageUrl={parentPage} title={title} langOptions={langOptions}/>
                <Toolbar/>
                <Stack justifyContent="start" height="100%" display="flex" flexDirection="column" px={3}>
                    {exhibit?.description && <DescriptionDialog show={descDialog.isOpen} close={descDialog.closeDialog} title={exhibit?.title} description={exhibit.description}/>}

                    <Box display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} width={"100%"} pt={1}>
                        {/*<ExhibitImageStepper images={exhibit?.imageUrls} loading={loading}/>*/}
                        <img src={imageUrls?.[0]} alt={exhibit?.title} style={{
                            display: "block",
                            width: '100%',
                            height: 240,
                            objectFit: 'cover',
                            borderRadius: 16,
                        }}/>
                    </Box>

                    <Stack direction={"row"} justifyContent={"space-between"} px={2} pt={3} pb={3}>
                        <Stack justifyContent={"center"} alignItems={"center"}>
                            <CollectionsIcon color={"disabled"}/>
                            {/*<Typography color={"secondary"} variant="overline">{t("gallery")}</Typography>*/}
                        </Stack>
                        <Stack justifyContent={"center"} alignItems={"center"}>
                            <InfoOutlinedIcon color={"secondary"}/>
                            {/*<Typography variant="overline">{t("info")}</Typography>*/}
                        </Stack>
                        <Stack justifyContent={"center"} alignItems={"center"}>
                            <PermIdentityRoundedIcon color={"disabled"}/>
                            {/*<Typography variant="overline">{t("artist")}</Typography>*/}
                        </Stack>
                        <Stack justifyContent={"center"} alignItems={"center"}>
                            <MoreHorizIcon color={"secondary"}/>
                            {/*<Typography variant="overline">{t("artist")}</Typography>*/}
                        </Stack>
                    </Stack>

                    <Stack
                        spacing={0.5}
                        width={"100%"}
                        sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            justifyContent: "center",
                            maxHeight: "300px",
                            // paddingTop: "16px",
                            // paddingBottom: "16px",
                        }}
                    >
                        {loading
                            ? <Skeleton variant={"rectangular"} height={24} width={240}/>
                            : <Stack direction={"row"} display={"flex"} width={"100%"} alignItems={"center"}>
                                <Typography variant="body1" flexGrow={1} fontWeight={"bolder"}>
                                    {exhibit?.title}
                                </Typography>
                                {/*<Stack direction={"row"}>*/}
                                {/*    <IconButton sx={{paddingRight: 0}} onClick={descAvailable ? descDialog.openDialog : undefined}>*/}
                                {/*        <InfoOutlinedIcon color={descAvailable ? "secondary" : "disabled"}/>*/}
                                {/*    </IconButton>*/}
                                {/*    {exhibit?.artistId && (*/}
                                {/*        <IconButton sx={{paddingRight: 0, paddingLeft: 2}} onClick={() => alert(`Artist id: ${exhibit?.artistId}`)}>*/}
                                {/*            <PermIdentityRoundedIcon color={"secondary"}/>*/}
                                {/*        </IconButton>*/}
                                {/*    )}*/}
                                {/*</Stack>*/}
                            </Stack>
                        }
                        {loading
                            ? <Skeleton variant={"rectangular"} height={40} width={300}/>
                            : <SubtitleRenderer subtitle={exhibit?.subtitle}/>
                        }
                    </Stack>

                    <Stack sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        height: "140px",
                        paddingTop: 1
                    }}>
                        {loading
                            ? <Skeleton variant={"rectangular"} width={'100%'} height={112}/>
                            : <Player audioSrc={audioUrl} nextExhibitId={exhibit?.nextExhibitId} prevExhibitId={exhibit?.prevExhibitId}/>
                        }
                    </Stack>
                </Stack>
            </Stack>
        </Slide>
    );
};

export default ExhibitPage;

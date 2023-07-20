import { Avatar, IconButton, ListItemAvatar, ListItemButton, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ContentMainBar from "../components/ContentMainBar";
import { SubtitleRenderer } from "../components/TextRenderer";
import { BaseProps, formatDuration } from "../components/ComponentUtils";
import { styled, useTheme } from "@mui/material/styles";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionDialog from "../components/DescriptionDialog";
import { exhibitionService } from "../service/ExhibitionService";
import { Spinner } from "../components/Spinner";
import AccountBalanceRoundedIcon from "@mui/icons-material/AccountBalanceRounded";
import PlayCircleRoundedIcon from "@mui/icons-material/PlayCircleRounded";
import { ImagePreview } from "../components/ImagePreview";
import {ExhibitSnapshot} from "../model/Exhibit";
import {Exhibition} from "../model/Exhibition";

const ImageContainer = styled("div")({
    display: "flex",
    // flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "290px",
});

const Image = styled("img")({
    borderRadius: "16px",
    height: "100%",
    width: "100%",
    objectFit: "cover",
});

const InfoContainer = (props: BaseProps) => (
    <Stack
        spacing={0.5}
        width={"100%"}
        sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            maxHeight: "300px",
            paddingTop: "16px",
            paddingBottom: "8px",
        }}
    >
        {props.children}
    </Stack>
);

const ExhibitionPage = () => {
    const { exhibitionId } = useParams();
    const { t, i18n } = useTranslation();
    const [exhibition, setExhibition] = useState<Exhibition>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(false);
    const [imgPrevOpen, setImgPrevOpen] = useState(false);
    const [descOpen, setDescOpen] = useState(false);

    useEffect(() => {
        getExhibitionAsync(i18n.language, exhibitionId);
    }, [i18n.language]);

    const getExhibitionAsync = async (lang: string, exhibitionId?: string) => {
        if (!exhibitionId) return;
        setLoading(true);
        try {
            const exhibition = await exhibitionService.getExhibition(lang, exhibitionId);
            await setExhibition(exhibition);
            // if there is no preferred language backend will return default exhibition language
            if (lang !== exhibition.lang) {
                await i18n.changeLanguage(exhibition.lang);
            }
        } catch (err) {
            navigate("/error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack px={3}>
            <ContentMainBar loading={loading} title={exhibition?.title} langOptions={exhibition?.langOptions} />
            {loading ? (
                <Spinner />
            ) : !exhibition ? null : (
                <Stack justifyContent="center" display="flex" flexDirection="column">
                    <ImagePreview show={imgPrevOpen} close={() => setImgPrevOpen(false)} img={exhibition.imageUrls[0]} />
                    <DescriptionDialog show={descOpen} close={() => setDescOpen(false)} title={exhibition.title} description={exhibition.description} />

                    <ImageContainer>
                        {/*    <ImageGallery imageUrls={[exhibition.imageUrl]}/>*/}
                        <Image src={exhibition.imageUrls[0]} alt={"Not found"} onClick={() => setImgPrevOpen(true)} />
                    </ImageContainer>

                    <InfoContainer>
                        <Stack direction={"row"} display={"flex"} width={"100%"} alignItems={"center"}>
                            <Typography variant="body1" flexGrow={1} fontWeight={"bolder"}>
                                {exhibition.title}
                            </Typography>
                            <Stack direction={"row"}>
                                <IconButton sx={{ paddingRight: 0 }} onClick={() => setDescOpen(true)}>
                                    <InfoOutlinedIcon color={"secondary"} />
                                </IconButton>
                                <IconButton sx={{ paddingRight: 0, paddingLeft: 2 }} onClick={() => alert(`Institution id: ${exhibition.institutionId}`)}>
                                    <AccountBalanceRoundedIcon color={"secondary"} />
                                </IconButton>
                            </Stack>
                        </Stack>
                        <SubtitleRenderer subtitle={exhibition.subtitle} />
                    </InfoContainer>

                    <List
                        dense={false}
                        sx={{
                            width: "100%",
                            height: "60%",
                            flexDirection: "column",
                            display: "flex",
                        }}
                    >
                        {exhibition.exhibits.map((exhibit, index) => (
                            <ExhibitSnapshotListItem key={exhibit.id} exhibit={exhibit} />
                        ))}
                    </List>
                </Stack>
            )}
        </Stack>
    );
};

const ExhibitSnapshotListItem = ({ exhibit }: { exhibit: ExhibitSnapshot }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const moveToExhibitPage = (exhibitId: string) => {
        navigate(`/exh/${exhibitId}`);
    };

    return (
        <>
            <ListItem
                key={exhibit.id}
                secondaryAction={
                    <IconButton edge="end" aria-label="comments" onClick={() => moveToExhibitPage(exhibit.id)}>
                        <PlayCircleRoundedIcon fontSize="large" sx={{ color: theme.palette.secondary.main }} />
                    </IconButton>
                }
            >
                <ListItemButton role={undefined} onClick={() => moveToExhibitPage(exhibit.id)} sx={{ padding: "0 !important" }} disableGutters>
                    <ListItemAvatar>
                        <Avatar alt={exhibit.title} src={exhibit.thumbnailUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={`${exhibit.number}. ${exhibit.title}`} secondary={formatDuration(exhibit.audioLength)} />
                </ListItemButton>
            </ListItem>
        </>
    );
};

export default ExhibitionPage;

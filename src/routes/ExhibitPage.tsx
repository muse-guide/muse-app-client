import { Button, IconButton, Stack, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { exhibitService } from "../service/ExhibitService";
import { useTranslation } from "react-i18next";
import { SubtitleRenderer } from "../components/TextRenderer";
import ContentMainBar from "../components/ContentMainBar";
import Player from "../components/player/AudioPlayer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { styled } from "@mui/material/styles";
import DescriptionDialog from "../components/DescriptionDialog";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import { BaseProps } from "../components/ComponentUtils";
import { Spinner } from "../components/Spinner";
import { ImagePreview } from "../components/ImagePreview";
import PersonSearchRoundedIcon from "@mui/icons-material/PersonSearchRounded";
import {Exhibit} from "../model/Exhibit";

const ImageContainer = styled("div")({
    display: "flex",
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "260px",
});

const Image = styled("img")({
    borderRadius: "24px",
    // height: "240px",
    // width: "240px",
    display: "flex",
    minHeight: "240px",
    minWidth: "240px",
    maxHeight: "260px",
    maxWidth: "2860px",
    objectFit: "cover",
    boxShadow: "0px 4px 16px 0px rgba(66, 68, 90, 0.2)",
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
            paddingBottom: "16px",
        }}
    >
        {props.children}
    </Stack>
);

const PlayerContainer = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 20,
    height: "168px",
});

const ExhibitPage = () => {
    const { exhibitId } = useParams();
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [exhibit, setExhibit] = useState<Exhibit>();
    const [loading, setLoading] = useState<boolean>(false);
    const [descOpen, setDescOpen] = useState(false);
    const [imgPrevOpen, setImgPrevOpen] = useState(false);

    useEffect(() => {
        getExhibitAsync(i18n.language, exhibitId);
    }, [i18n.language, exhibitId]);

    const getExhibitAsync = async (lang: string, exhibitId?: string) => {
        if (!exhibitId) return;
        setLoading(true);
        try {
            const exhibit = await exhibitService.getExhibit(lang, exhibitId);
            setExhibit(exhibit);
            // if there is no preferred language backend will return default exhibit language
            if (lang !== exhibit.lang) {
                await i18n.changeLanguage(exhibit.lang);
            }
        } catch (err) {
            navigate("/error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Stack px={3} height="100svh">
            <ContentMainBar loading={loading} parentPageUrl={exhibit ? `/col/${exhibit?.exhibitionId}` : undefined} title={exhibit ? `${exhibit.number}. ${exhibit.title}` : undefined} langOptions={exhibit ? exhibit?.langOptions : undefined} />
            {loading ? (
                <Spinner />
            ) : !exhibit ? null : (
                <Stack justifyContent="center" height="100%" display="flex" flexDirection="column">
                    <ImagePreview show={imgPrevOpen} close={() => setImgPrevOpen(false)} img={exhibit.imageUrl} />
                    <DescriptionDialog show={descOpen} close={() => setDescOpen(false)} title={exhibit.title} description={exhibit.description} />

                    <ImageContainer>
                        <Image src={exhibit.imageUrl} onClick={() => setImgPrevOpen(true)} />
                    </ImageContainer>

                    <InfoContainer>
                        <Stack direction={"row"} display={"flex"} width={"100%"} alignItems={"center"}>
                            <Typography variant="body1" flexGrow={1} fontWeight={"bolder"}>
                                {exhibit.title}
                            </Typography>
                            <Stack direction={"row"}>
                                <IconButton sx={{ paddingRight: 0 }} onClick={() => setDescOpen(true)}>
                                    <InfoOutlinedIcon color={"secondary"} />
                                </IconButton>
                                {exhibit.artistId && (
                                    <IconButton sx={{ paddingRight: 0, paddingLeft: 2 }} onClick={() => alert(`Artist id: ${exhibit?.artistId}`)}>
                                        <PermIdentityRoundedIcon color={"secondary"} />
                                    </IconButton>
                                )}
                            </Stack>
                        </Stack>
                        <SubtitleRenderer subtitle={exhibit.subtitle} />
                    </InfoContainer>

                    <PlayerContainer>
                        <Player key={exhibit.audioUrl} audioSrc={exhibit.audioUrl} nextExhibitId={exhibit.nextExhibitId} prevExhibitId={exhibit.prevExhibitId} />
                    </PlayerContainer>
                </Stack>
            )}
        </Stack>
    );
};

export default ExhibitPage;

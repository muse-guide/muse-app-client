import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {Exhibition} from "../../model/Exhibition";
import {exhibitionService} from "../../service/ExhibitionService";
import {Avatar, Box, IconButton, Skeleton, Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useTheme} from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import {normalizeText} from "../../components/ComponentUtils";

export const ExhibitionList = ({institutionId}: { institutionId?: string }) => {
    const {t, i18n} = useTranslation();
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

    useEffect(() => {
        getExhibitionsAsync(i18n.language, institutionId, nextPageKey);
    }, [i18n.language, institutionId]);

    const getExhibitionsAsync = async (lang: string, institutionId?: string, nextPageKey?: string) => {
        if (!institutionId) return;
        setLoading(true);
        try {
            const results = await exhibitionService.getExhibitionsFor(institutionId, lang, nextPageKey);
            if (nextPageKey) {
                setExhibitions(prevState => prevState.concat(results.items as Exhibition[]));
            } else {
                setExhibitions(results.items as Exhibition[]);
            }
            setNextPageKey(results.nextPageKey)
        } catch (err) {
            console.error(`Failed to retrieve exhibitions with error: ${err}`);
        } finally {
            setLoading(false);
        }
    };

    const onLoadMore = nextPageKey ? () => {
        getExhibitionsAsync(i18n.language, institutionId, nextPageKey);
    } : undefined

    return (
        <Stack px={3} gap={2}>
            <Stack position={"relative"}>
                <Typography variant="h6" fontWeight={'bold'}>{t("exhibitions")}</Typography>
            </Stack>
            {loading
                ? <Stack pt={0} pb={1} width={"100%"} gap={1}>
                    {Array.from({length: 5}).map((_, index) => (
                        <Skeleton variant={"rounded"} sx={{borderRadius: "8px"}} height={78} key={index}/>
                    ))}
                </Stack>
                : <Stack pt={0} pb={1} width={"100%"} gap={1}>
                    {exhibitions.length === 0
                        ? <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                            <Typography variant={"subtitle2"}>No items found</Typography>
                        </Box>
                        : exhibitions.map((exhibition, index) => (
                            <ExhibitionListItem key={exhibition.id + index} exhibition={exhibition}/>
                        ))}
                </Stack>}
            {onLoadMore &&
                <LoadingButton
                    loading={loading}
                    loadingPosition={"start"}
                    startIcon={<ExpandMoreIcon/>}
                    variant="text"
                    color={"secondary"}
                    size={"medium"}
                    fullWidth sx={{textTransform: "none", fontSize: "16px"}}
                    onClick={onLoadMore}
                >
                    {t("loadMore")}
                </LoadingButton>
            }
        </Stack>
    )
}

const ExhibitionListItem = ({exhibition}: { exhibition: Exhibition }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const moveToExhibitionPage = (exhibitionId: string) => {
        navigate(`/exhibitions/${exhibitionId}`);
    };

    const imageUrl = useMemo(() => exhibition.imageUrls && exhibition?.imageUrls.length > 0 ? exhibition.imageUrls[0] : undefined, [exhibition])

    return (
        <>
            <Stack
                onClick={() => moveToExhibitionPage(exhibition.id)}
                direction={"row"}
                display={"flex"}
                alignItems={"center"}
                sx={{
                    cursor: "pointer",
                    padding: "16px",
                    borderRadius: "8px",
                    border: "solid 1px",
                    borderColor: theme.palette.primary.light,
                }}
            >
                <Avatar alt={exhibition.title} src={imageUrl} variant="circular"/>
                <Stack pl={2} flexGrow={1}>
                    <Typography variant="body1" fontWeight={"bold"}>
                        {normalizeText(exhibition.title, 40)}
                    </Typography>
                    {exhibition.subtitle &&
                        <Typography variant="body2" fontWeight={"normal"}>
                            {normalizeText(exhibition.subtitle, 40)}
                        </Typography>
                    }
                </Stack>
                <IconButton onClick={() => moveToExhibitionPage(exhibition.id)}>
                    <ChevronRightIcon fontSize="medium" sx={{color: theme.palette.secondary.main}}/>
                </IconButton>
            </Stack>
        </>
    );
};
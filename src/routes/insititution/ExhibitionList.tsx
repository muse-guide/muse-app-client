import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {Exhibition} from "../../model/Exhibition";
import {exhibitionService} from "../../service/ExhibitionService";
import {Stack, Typography} from "@mui/material";
import {LoadingButton} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useTheme} from "@mui/material/styles";
import {ExposableListEmpty, ExposableListItem, ExposableListItemSkeleton} from "../../components/ExposableListItem";

export const ExhibitionList = ({institutionId}: { institutionId?: string }) => {
    const {t, i18n} = useTranslation();
    const theme = useTheme();
    const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

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

    const moveToExhibitionPage = (exhibitionId: string) => {
        navigate(`/exhibitions/${exhibitionId}`);
    };

    return (
        <Stack
            bgcolor={theme.palette.background.default}
            width={"100%"}
            pt={3}
            pb={3}
            px={3}
            gap={3}
            display={"flex"}
            flexGrow={1}
        >
            <Stack position={"relative"}>
                <Typography variant="body1" fontWeight={'bold'}>{t("exhibitions")}</Typography>
            </Stack>
            {loading
                ? <ExposableListItemSkeleton/>
                : <Stack pt={0} pb={1} width={"100%"} gap={2}>
                    {exhibitions.length === 0
                        ? <ExposableListEmpty/>
                        : exhibitions.map((exhibition, index) => (
                            <ExposableListItem
                                key={exhibition.id + index}
                                exposable={exhibition}
                                onClick={moveToExhibitionPage}
                            />
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
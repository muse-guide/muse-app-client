import React, {useCallback, useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {Exhibit} from "../../model/Exhibit";
import {exhibitService} from "../../service/ExhibitService";
import {Box, Chip, IconButton, InputAdornment, Stack, TextField, Typography, Zoom} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {LoadingButton} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useTheme} from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import {ExposableListEmpty, ExposableListItem, ExposableListItemSkeleton} from "../../components/ExposableListItem";

export const ExhibitList = ({exhibitionId}: { exhibitionId?: string }) => {
    const {t, i18n} = useTranslation();
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const theme = useTheme();
    const [exhibits, setExhibits] = useState<Exhibit[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [moreloading, setMoreLoading] = useState<boolean>(false);
    const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    const getExhibitsAsync = useCallback(async (lang: string, exhibitionId?: string, number?: number) => {
        if (!exhibitionId) return;
        setLoading(true);
        try {
            const results = await exhibitService.getExhibitsFor(exhibitionId, lang, undefined, number);
            setExhibits(results.items as Exhibit[]);
            setNextPageKey(results.nextPageKey);
        } catch (err) {
            console.error(`Failed to retrieve exhibits with error: ${err}`);
        } finally {
            setLoading(false);
        }
    }, []);

    const getMoreExhibitsAsync = useCallback(async (lang: string, nextPageKey: string, exhibitionId?: string) => {
        if (!exhibitionId) return;
        setMoreLoading(true);
        try {
            const results = await exhibitService.getExhibitsFor(exhibitionId, lang, nextPageKey);
            setExhibits(prevState => prevState.concat(results.items as Exhibit[]));
            setNextPageKey(results.nextPageKey);
        } catch (err) {
            console.error(`Failed to retrieve exhibits with error: ${err}`);
        } finally {
            setMoreLoading(false);
        }
    }, []);

    useEffect(() => {
        getExhibitsAsync(i18n.language, exhibitionId);
    }, [i18n.language, exhibitionId, getExhibitsAsync]);

    const onLoadMore = nextPageKey ? () => {
        getMoreExhibitsAsync(i18n.language, nextPageKey, exhibitionId);
    } : undefined;

    const onSearch = (searchTerm?: number) => {
        getExhibitsAsync(i18n.language, exhibitionId, searchTerm);
    };

    const onSearchCancel = () => {
        setShowSearch(false);
        getExhibitsAsync(i18n.language, exhibitionId);
    };

    const moveToExhibitPage = (exhibitId: string) => {
        navigate(`/exhibits/${exhibitId}`);
    };

    return (
        <Stack
            bgcolor={theme.palette.background.default}
            width={"100%"}
            pt={2}
            pb={3}
            px={3}
            gap={3}
            display={"flex"}
            flexGrow={1}
        >
            <Stack position={"relative"}>
                {showSearch && <Box sx={{width: "100%", paddingBottom: 0}}>
                    <Zoom in={showSearch}>
                        <Stack width={"100%"}>
                            <SearchExhibit
                                onSearch={onSearch}
                                onSearchCancel={onSearchCancel}
                            />
                        </Stack>
                    </Zoom>
                </Box>}
                {!showSearch && <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
                    <Typography variant="body1" fontWeight={'bold'}>{t("exhibits")}</Typography>
                    <IconButton onClick={() => setShowSearch(!showSearch)}>
                        <SearchIcon color={"secondary"} fontSize={"medium"}/>
                    </IconButton>
                </Stack>}
            </Stack>
            {loading
                ? <ExposableListItemSkeleton/>
                : <Stack pt={0} pb={1} width={"100%"} gap={2}>
                    {exhibits.length === 0
                        ? <ExposableListEmpty/>
                        : exhibits.map((exhibit, index) => (
                            <ExposableListItem
                                key={exhibit.id + index}
                                itemNumber={exhibit.number}
                                exposable={exhibit}
                                onClick={moveToExhibitPage}
                            />
                        ))}
                </Stack>}
            {onLoadMore &&
                <Stack direction={"row"} display={"flex"} justifyContent={"center"}>
                    <LoadingButton
                        loading={moreloading}
                        sx={{
                            fontSize: '14px',
                            textTransform: 'none',
                            color: theme.palette.secondary.dark,
                            width: 'auto',
                        }}
                        onClick={onLoadMore}
                        startIcon={<ExpandMoreIcon/>}
                        loadingPosition={"start"}
                    >
                        {t('loadMore')}
                    </LoadingButton>
                </Stack>
            }
        </Stack>
    );
};

const SearchExhibit = (
    {
        onSearch,
        onSearchCancel
    }: {
        onSearch: (searchTerm?: number) => void,
        onSearchCancel: () => void
    }
) => {
    const {t} = useTranslation();
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [searching, setSearching] = useState<boolean>(false);

    const onSearchClick = () => {
        if (!searchTerm) return;
        setSearching(true);
        onSearch(parseInt(searchTerm));
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const number = parseInt(value);
        const result = value === "" ? "" : (isNaN(number) ? "" : number.toString());
        setSearchTerm(result);
    };

    return (
        <>
            {searching
                ? <Box>
                    <Chip label={`${t("number")}: ${searchTerm}`} onDelete={onSearchCancel} sx={{minWidth: 110, justifyContent: 'space-between'}}/>
                </Box>
                :
                <TextField
                    fullWidth
                    value={searchTerm}
                    disabled={searching}
                    onChange={onInputChange}
                    size={"small"}
                    placeholder={t("searchExhibits")}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">
                            {searching
                                ? <IconButton onClick={onSearchCancel}>
                                    <CloseIcon color={"primary"}/>
                                </IconButton>
                                : <IconButton onClick={onSearchClick}>
                                    <SearchIcon color={"primary"}/>
                                </IconButton>
                            }
                        </InputAdornment>,
                    }}
                />
            }
        </>
    );
};
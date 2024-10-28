import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {Exhibit} from "../../model/Exhibit";
import {exhibitService} from "../../service/ExhibitService";
import {Avatar, Box, Chip, IconButton, InputAdornment, Skeleton, Stack, TextField, Typography, Zoom} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {LoadingButton} from "@mui/lab";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {useTheme} from "@mui/material/styles";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CloseIcon from "@mui/icons-material/Close";

export const ExhibitList = ({exhibitionId}: { exhibitionId?: string }) => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [exhibits, setExhibits] = useState<Exhibit[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

    useEffect(() => {
        getExhibitsAsync(i18n.language, exhibitionId, nextPageKey);
    }, [i18n.language, exhibitionId]);

    const getExhibitsAsync = async (lang: string, exhibitionId?: string, nextPageKey?: string, number?: number) => {
        if (!exhibitionId) return;
        setLoading(true);
        try {
            const results = await exhibitService.getExhibitsFor(exhibitionId, lang, nextPageKey, number);
            if (nextPageKey) {
                setExhibits(prevState => prevState.concat(results.items as Exhibit[]));
            } else {
                setExhibits(results.items as Exhibit[]);
            }
            setNextPageKey(results.nextPageKey)
        } catch (err) {
            console.error(`Failed to retrieve exhibits with error: ${err}`);
            navigate("/error");
        } finally {
            setLoading(false);
        }
    };

    const onLoadMore = nextPageKey ? () => {
        getExhibitsAsync(i18n.language, exhibitionId, nextPageKey);
    } : undefined

    const onSearch = (searchTerm?: number) => {
        getExhibitsAsync(i18n.language, exhibitionId, undefined, searchTerm)
    }

    const onSearchCancel = () => {
        setShowSearch(false);
        getExhibitsAsync(i18n.language, exhibitionId)
    }

    const ExhibitLoading = () => {
        return (
            <Stack width={"100%"} direction={"row"} display={"flex"} alignItems={"center"} gap={2}>
                <Skeleton variant="circular" width={40} height={40}/>
                <Skeleton variant="rectangular" width={"80%"} height={32}/>
            </Stack>
        )
    }

    return (
        <Stack px={3} pt={1}>
            <Stack position={"relative"}>
                {showSearch && <Box sx={{width: "100%", paddingBottom: 1}}>
                    <Zoom in={showSearch}>
                        <Stack width={"100%"}>
                            <SearchExhibit
                                onSearch={onSearch}
                                onSearchCancel={onSearchCancel}
                            />
                        </Stack>
                    </Zoom>
                </Box>}
                {!showSearch && <Stack direction={"row"} justifyContent={"space-between"} paddingBottom={0} alignItems={"center"} width={"100%"}>
                    <Typography variant="subtitle2">{t("exhibits")}</Typography>
                    <IconButton onClick={() => setShowSearch(!showSearch)}>
                        <SearchIcon color={"secondary"}/>
                    </IconButton>
                </Stack>}
            </Stack>
            {loading
                ? <Stack pt={1.5} pb={1} width={"100%"} gap={1}>
                    {Array.from({length: 5}).map((_, index) => (
                        <ExhibitLoading key={index}/>
                    ))}
                </Stack>
                : <Stack pt={1.5} pb={1} width={"100%"} gap={1}>
                    {exhibits.length === 0
                        ? <Box width={"100%"} display={"flex"} justifyContent={"center"}>
                            <Typography variant={"subtitle2"}>No items found</Typography>
                        </Box>
                        : exhibits.map((exhibit, index) => (
                            <ExhibitListItem key={exhibit.id + index} exhibit={exhibit}/>
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

const ExhibitListItem = ({exhibit}: { exhibit: Exhibit }) => {
    const navigate = useNavigate();
    const theme = useTheme();

    const moveToExhibitPage = (exhibitId: string) => {
        navigate(`/exhibits/${exhibitId}`);
    };

    const imageUrl = useMemo(() => exhibit.imageUrls && exhibit?.imageUrls.length > 0 ? exhibit.imageUrls[0] : undefined, [exhibit])

    return (
        <>
            <Stack onClick={() => moveToExhibitPage(exhibit.id)} direction={"row"} display={"flex"} alignItems={"center"}>
                <Avatar alt={exhibit.title} src={imageUrl}/>
                <Box pl={2} flexGrow={1}>
                    <Typography variant="body2" fontWeight={"normal"}>
                        {`${exhibit.number}. ${exhibit.title}`}
                    </Typography>
                </Box>
                <IconButton onClick={() => moveToExhibitPage(exhibit.id)}>
                    <ChevronRightIcon fontSize="medium" sx={{color: theme.palette.secondary.main}}/>
                </IconButton>
            </Stack>
        </>
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
    }

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const number = parseInt(value)
        const result = value === "" ? "" : (isNaN(number) ? "" : number.toString())
        setSearchTerm(result);
    }

    return (
        <>
            {searching
                ? <Box>
                    <Chip label={`${t("number")}: ${searchTerm}`} onDelete={onSearchCancel} sx={{minWidth: 110, justifyContent: 'space-between'}}/>
                </Box>
                : <TextField
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
}
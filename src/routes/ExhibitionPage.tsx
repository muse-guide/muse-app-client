import {Avatar, Box, IconButton, InputAdornment, Link, Skeleton, Stack, TextField, Typography, Zoom} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import ContentMainBar from "../components/ContentMainBar";
import {useTheme} from "@mui/material/styles";
import DescriptionDialog from "../components/DescriptionDialog";
import {exhibitionService} from "../service/ExhibitionService";
import {Exhibit} from "../model/Exhibit";
import {Exhibition} from "../model/Exhibition";
import {useDialog} from "../components/hooks";
import {exhibitService} from "../service/ExhibitService";
import {ImageStepper} from "../components/ImageStepper";
import SearchIcon from '@mui/icons-material/Search';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {LoadingButton} from "@mui/lab";
import CloseIcon from '@mui/icons-material/Close';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {SimpleAudioPlayer} from "../components/SimpleAudioPlayer";

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
            navigate("/error");
        } finally {
            setExhibitionLoading(false);
        }
    };

    const parentPage = useMemo(() => exhibition ? `/institutions/${exhibition?.institutionId}` : undefined, [exhibition])
    const langOptions = useMemo(() => exhibition ? exhibition?.langOptions : undefined, [exhibition])

    return (
        <Stack px={0}>
            <ContentMainBar loading={exhibitionLoading} langOptions={langOptions}/>
            <Stack>
                <ImageStepper images={exhibition?.imageUrls} loading={exhibitionLoading}/>
                <ExhibitionDetails exhibition={exhibition} loading={exhibitionLoading}/>
                <ExhibitList exhibitionId={exhibitionId}/>
            </Stack>
        </Stack>
    );
};

const ExhibitionDetails = ({exhibition, loading}: { exhibition?: Exhibition, loading: boolean }) => {
    const theme = useTheme();
    const {t, i18n} = useTranslation();
    const descDialog = useDialog()
    const [checked, setChecked] = useState<boolean>(false);

    const descAvailable: boolean = useMemo(() => !!(exhibition && exhibition?.description), [exhibition])

    return (
        <Stack
            px={3}
            spacing={0.5}
            width={"100%"}
            sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                maxHeight: "300px",
                paddingTop: "24px",
                paddingBottom: "8px",
                marginTop: "-18px",
                zIndex: 1,
                backgroundColor: "white",
                borderRadius: "24px",
                position: "relative"
            }}
        >
            {descAvailable && <DescriptionDialog show={descDialog.isOpen} close={descDialog.closeDialog} title={exhibition?.title} description={exhibition?.description!}/>}
            {!loading && <Box position={"absolute"} top={-28} right={24}>
                <SimpleAudioPlayer audioUrl={exhibition?.audio}/>
            </Box>}

            <Stack gap={1} width={"100%"}>
                {loading
                    ? <Skeleton height={24} width={240}/>
                    : <Typography variant="body1" flexGrow={1} fontWeight={"bolder"}>{exhibition?.title}</Typography>
                }
                {loading
                    ? <Skeleton variant={"rectangular"} height={48} width={300}/>
                    : <Typography variant="body1">{exhibition?.subtitle}</Typography>
                }
                {loading
                    ? <Skeleton height={24} width={200}/>
                    : <>
                        {descAvailable ?
                            <Link
                                color={theme.palette.secondary.main}
                                component={"button"}
                                underline="hover"
                                textAlign={"left"}
                                onClick={descAvailable ? descDialog.openDialog : undefined}
                            >
                                {t('learnMore')}
                            </Link>
                            : null
                        }
                    </>
                }
            </Stack>
        </Stack>
    );
}

const ExhibitList = ({exhibitionId}: { exhibitionId?: string }) => {
    const {t, i18n} = useTranslation();
    const navigate = useNavigate();
    const [showSearch, setShowSearch] = useState<boolean>(false);
    const [exhibits, setExhibits] = useState<Exhibit[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [nextPageKey, setNextPageKey] = useState<string | undefined>(undefined);

    useEffect(() => {
        getExhibitsAsync(i18n.language, exhibitionId, nextPageKey);
    }, [i18n.language, exhibitionId]);

    const getExhibitsAsync = async (lang: string, exhibitionId?: string, nextPageKey?: string, searchTerm?: number) => {
        if (!exhibitionId) return;
        setLoading(true);
        try {
            const results = await exhibitService.getExhibitsFor(exhibitionId, lang, nextPageKey, searchTerm);
            if (nextPageKey) {
                setExhibits(prevState => prevState.concat(results.items as Exhibit[]));
            } else {
                setExhibits(results.items as Exhibit[]);
            }
            setNextPageKey(results.nextPageKey)
        } catch (err) {
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
                {showSearch && <Box sx={{width: "100%", flexGrow: 1, display: 'flex', paddingBottom: 1}}>
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
                    <Typography variant="overline">
                        {t("exhibits")}
                    </Typography>
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
                    {exhibits.map((exhibit, index) => (
                        <ExhibitListItem key={exhibit.id} exhibit={exhibit}/>
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

    const imageUrl = useMemo(() => exhibit && exhibit?.imageUrls.length > 0 ? `https://duz68kh4juaad.cloudfront.net/${exhibit.imageUrls[0]}` : undefined, [exhibit])

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
        <TextField
            fullWidth
            value={searchTerm}
            disabled={searching}
            onChange={onInputChange}
            size={"medium"}
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
    );
}

export default ExhibitionPage;

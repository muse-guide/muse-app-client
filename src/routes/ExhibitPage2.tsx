import {AppBar, Box, IconButton, MobileStepper, Modal, Skeleton, Slide, Slider, Stack, Toolbar, Typography, useScrollTrigger} from "@mui/material";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useMemo, useState} from "react";
import {exhibitService} from "../service/ExhibitService";
import {useTranslation} from "react-i18next";
import {SubtitleRenderer} from "../components/TextRenderer";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import DescriptionDialog from "../components/DescriptionDialog";
import PermIdentityRoundedIcon from "@mui/icons-material/PermIdentityRounded";
import {Exhibit} from "../model/Exhibit";
import {useDialog} from "../components/hooks";
import LanguageSelector from "../components/LanguageSelector";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import {useTheme} from "@mui/material/styles";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@mui/icons-material/Close";

const ExhibitPage2 = () => {
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
                                height: '280px',
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
                            <Stack direction={"row"}>
                                <IconButton sx={{paddingRight: 0}} onClick={descAvailable ? descDialog.openDialog : undefined}>
                                    <InfoOutlinedIcon sx={{fontSize: 28}} fontSize={"medium"} color={descAvailable ? "secondary" : "disabled"}/>
                                </IconButton>
                                {exhibit?.artistId && (
                                    <IconButton sx={{paddingRight: 0, paddingLeft: 2}} onClick={() => alert(`Artist id: ${exhibit?.artistId}`)}>
                                        <PermIdentityRoundedIcon color={"secondary"}/>
                                    </IconButton>
                                )}
                            </Stack>
                        </Stack>
                    }
                    {loading
                        ? <Skeleton variant={"rectangular"} height={48} width={300}/>
                        : <Stack display={"flex"} alignItems={"center"}>
                            <SubtitleRenderer subtitle={exhibit?.subtitle}/>
                        </Stack>
                    }
                </Stack>

                <Stack width={"100%"} pt={1.5}>
                    {loading
                        ? <Skeleton variant={"rectangular"} width={'100%'} height={130}/>
                        : <Stack display={"block"}>
                            <Stack>
                                <Slider size="small" defaultValue={30} color="secondary"/>
                                <Stack direction={"row"} justifyContent={"space-between"} mt={-2}>
                                    <Typography variant="overline" color={"gray"}>1:30</Typography>
                                    <Typography variant="overline" color={"gray"}>5:50</Typography>
                                </Stack>
                            </Stack>
                            <Stack mt={-1.5}>
                                <Stack direction={"row"} justifyContent={"space-around"} alignItems={"center"}>
                                    <IconButton>
                                        <Replay10Icon sx={{fontSize: 56}} color={"primary"}/>
                                    </IconButton>
                                    <IconButton>
                                        <PlayCircleIcon sx={{fontSize: 72}} color={"secondary"}/>
                                    </IconButton>
                                    <IconButton>
                                        <Forward10Icon sx={{fontSize: 56}} color={"primary"}/>
                                    </IconButton>
                                </Stack>
                            </Stack>
                        </Stack>
                    }
                </Stack>
            </Stack>
        </Slide>
    );
};

export default ExhibitPage2;

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
                    {!props.loading && (
                        <Toolbar sx={{paddingX: 3}}>
                            <IconButton sx={{padding: 0}} onClick={() => navigateTo(props.parentPageUrl)}>
                                <KeyboardArrowDownIcon sx={{display: "flex"}} color={"primary"}/>
                            </IconButton>

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

                            <LanguageSelector languages={props.langOptions ?? []}/>
                        </Toolbar>
                    )}
                </AppBar>
            </Slide>
        </React.Fragment>
    );
}

const ExhibitImage = ({imageUrls}: { imageUrls?: string[] }) => {
    const imageGallery = useDialog()
    const images = imageUrls ? imageUrls?.map(image => `https://duz68kh4juaad.cloudfront.net/${image}`) : []

    return (
        <>
            <ExhibitImageGallery show={imageGallery.isOpen} close={imageGallery.closeDialog} images={images}/>
            <Stack
                width={'100%'}
                display={"flex"}
                alignItems={"center"}
                onClick={imageGallery.openDialog}
            >
                <img
                    src={images?.[0] ?? undefined}
                    style={{
                        display: "block",
                        width: '100%',
                        maxWidth: '280px',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                        borderRadius: 16,
                        boxShadow: '0px 9px 35px -12px rgba(66, 68, 90, 1)'
                    }}
                />
                <Stack
                    position={"relative"}
                    width={'100%'}
                    maxWidth={280}
                >
                    <Stack
                        position={"absolute"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"end"}
                        bottom={0}
                        right={0}
                        width={'100%'}
                        height={56}
                        maxWidth={280}
                        bgcolor={"red"}
                        borderRadius={'0 0 16px 16px'}
                        sx={{
                            background: 'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,1.0) 100%)',
                        }}
                    >
                        {images.length > 0 &&
                            <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} pr={1.0}>
                                <Typography variant={"subtitle2"} color={"white"}>{`1/${images.length}`}</Typography>
                                <IconButton>
                                    <CollectionsOutlinedIcon sx={{color: 'white'}}/>
                                </IconButton>
                            </Stack>
                        }
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}

const ExhibitImageGallery = ({show, close, images}: {
    show: boolean;
    close: () => void;
    images: string[];
}) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    if (!images) images = [];
    const maxSteps = images.length;

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Modal
            open={show}
            onClose={close}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
            }}
        >
            <Box sx={{
                width: '100%',
                display: "flex",
                flexGrow: 1,
                height: '100%',
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}>
                <SwipeableViews
                    axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                    index={activeStep}
                    onChangeIndex={handleStepChange}
                    enableMouseEvents
                    containerStyle={{
                        display: "flex",
                        alignItems: "center",
                        width: '100%',
                    }}
                >
                    {images.map((image, index) => (
                        <div key={image}>
                            {Math.abs(activeStep - index) <= 2
                                ? <Box
                                    component="img"
                                    sx={{
                                        overflow: 'hidden',
                                        alignItems: "center",
                                        width: '100%',
                                        objectFit: 'cover',
                                    }}
                                    src={image}
                                />
                                : null
                            }
                        </div>
                    ))}
                </SwipeableViews>
                <MobileStepper
                    variant="dots"
                    steps={maxSteps}
                    color={theme.palette.common.white}
                    position="bottom"
                    activeStep={activeStep}
                    nextButton={null}
                    backButton={null}
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "absolute",
                        backgroundColor: "transparent",
                        bottom: 12,
                        color: theme.palette.common.white,
                        "& .MuiMobileStepper-dot": {
                            backgroundColor: "rgba(255,255,255,0.5)",
                        },
                        "& .MuiMobileStepper-dotActive": {
                            backgroundColor: "rgba(255,255,255,0.8)",
                        },
                    }}
                />
                <IconButton
                    onClick={close}
                    sx={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                    }}
                >
                    <CloseIcon
                        sx={{
                            color: "rgba(255,255,255,0.5)",
                            fontSize: 48,
                        }}
                    />
                </IconButton>
            </Box>
        </Modal>
    )
}

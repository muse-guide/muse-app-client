import {useTheme} from "@mui/material/styles";
import React from "react";
import {Box, IconButton, MobileStepper, Modal, Stack, Typography} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@mui/icons-material/Close";
import {useDialog} from "../../components/hooks";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";

export const ExhibitImage = ({imageUrls}: { imageUrls?: string[] }) => {
    const imageGallery = useDialog()
    const imageAvailable = imageUrls && imageUrls?.length > 0
    const mainImage = imageUrls?.[0] ?? "/no_image.png"

    return (
        <>
            <ExhibitImageGallery show={imageGallery.isOpen} close={imageGallery.closeDialog} images={imageUrls ?? []}/>
            <Stack
                width={'100%'}
                display={"flex"}
                alignItems={"center"}
                onClick={imageGallery.openDialog}
            >
                <img
                    src={mainImage}
                    style={{
                        display: "block",
                        width: '100%',
                        maxWidth: '260px',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                        borderRadius: 16,
                        boxShadow: '0px 9px 35px -12px rgba(66, 68, 90, 0.75)'
                    }}
                    alt={""}
                />
                <Stack
                    position={"relative"}
                    width={'100%'}
                    maxWidth={260}
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
                        maxWidth={260}
                        sx={{
                            background: imageAvailable ? 'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.75) 100%)' : undefined,
                        }}
                        borderRadius={'0 0 16px 16px'}
                    >
                        {imageAvailable &&
                            <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} pr={1.0}>
                                <Typography variant={"subtitle2"} color={"white"}>{`1/${imageUrls?.length}`}</Typography>
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
export const ExhibitImageGallery = ({show, close, images}: {
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
                        top: 4,
                        right: 4,
                    }}
                >
                    <CloseIcon
                        sx={{
                            color: "rgba(255,255,255,0.2)",
                            fontSize: 32,
                        }}
                    />
                </IconButton>
            </Box>
        </Modal>
    )
}
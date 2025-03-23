import {useTheme} from "@mui/material/styles";
import React from "react";
import {Box, MobileStepper, Modal} from "@mui/material";
import SwipeableViews from "react-swipeable-views";

export const ExposableImageGallery = ({show, close, images}: {
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
            closeAfterTransition
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "rgba(0, 0, 0, 0.75)",
            }}
        >
            <Box
                onClick={close}
                sx={{
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
            </Box>
        </Modal>
    )
}
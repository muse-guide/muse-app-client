import {useTheme} from "@mui/material/styles";
import React from "react";
import {Box, IconButton, MobileStepper} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import CloseIcon from "@mui/icons-material/Close";

export const ExhibitImageStepper = ({images, onClose}: { images?: string[], onClose: () => void }) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);

    if (!images) images = [];
    const maxSteps = images.length;

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
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
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                }}
            >
                <CloseIcon
                    sx={{
                        color: "rgba(255,255,255,0.25)",
                        fontSize: 48,
                    }}
                />
            </IconButton>
        </Box>
    )
        ;
}
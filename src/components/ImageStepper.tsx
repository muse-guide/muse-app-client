import {useTheme} from "@mui/material/styles";
import React, {useMemo} from "react";
import {Box, MobileStepper, Skeleton} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import {ImagePreview} from "./ImagePreview";
import {useDialog} from "./hooks";

interface ImageStepperProps {
    images?: string[];
    loading: boolean
}

export const ImageStepper = ({images, loading}: ImageStepperProps) => {
    const theme = useTheme();
    const [activeStep, setActiveStep] = React.useState(0);
    const imgPrevDialog = useDialog()

    if (!images || images.length === 0) images = ["no_image.png"];
    const maxSteps = images.length;

    const handleStepChange = (step: number) => {
        setActiveStep(step);
    };

    return (
        <Box sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
        }}>
            <ImagePreview show={imgPrevDialog.isOpen} close={imgPrevDialog.closeDialog} img={images?.[activeStep]}/>

            {loading
                ? <Skeleton variant="rectangular" width={"100%"} height={300}/>
                : <Box sx={{
                    width: '100%',
                    display: "block"
                }}>
                    <SwipeableViews
                        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
                        index={activeStep}
                        onChangeIndex={handleStepChange}
                        enableMouseEvents
                    >
                        {images?.map((image, index) => (
                                <div key={image}>
                                    {Math.abs(activeStep - index) <= 2 ? (
                                        <Box
                                            component="img"
                                            sx={{
                                                aspectRatio: '9 / 7',
                                                display: 'block',
                                                overflow: 'hidden',
                                                width: '100%',
                                                objectFit: 'cover',
                                            }}
                                            src={image}
                                            onClick={imgPrevDialog.openDialog}
                                        />
                                    ) : null}
                                </div>
                            )
                        )
                        }
                    </SwipeableViews>
                    <MobileStepper
                        variant="dots"
                        steps={maxSteps}
                        color={theme.palette.common.white}
                        position="static"
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
                            bottom: 32,
                            color: theme.palette.common.white,
                        }}
                    />
                </Box>
            }
        </Box>
    )
        ;
}
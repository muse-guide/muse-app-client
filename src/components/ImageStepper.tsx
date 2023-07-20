// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import React from "react";
import Carousel from "react-material-ui-carousel";
import { Box } from "@mui/material";

interface ImageStepperProps {
    imageUrls: string[];
}

const ImageStepper = (props: ImageStepperProps) => {
    return (
        <Swiper spaceBetween={50} slidesPerView={1} modules={[Pagination]} pagination={true} color="transparent">
            {props.imageUrls.map((item, i) => (
                <SwiperSlide key={i}>
                    <img
                        src={item}
                        style={{
                            borderRadius: "24px",
                            width: "100%",
                            // maxWidth: '310px',
                            height: "auto",
                            objectFit: "cover",
                        }}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
};

export default ImageStepper;

export const ImageGallery = (props: ImageStepperProps) => {
    return (
        <Carousel height={300}>
            {props.imageUrls.map((item, i) => (
                <Box width="100%" height="300px">
                    <img
                        src={item}
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover",
                        }}
                    />
                </Box>
            ))}
        </Carousel>
    );
};

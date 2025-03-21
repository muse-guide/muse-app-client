import {Fade, Modal} from "@mui/material";
import React from "react";
import {styled} from "@mui/material/styles";

const Image = styled("img")({
    maxHeight: "90%",
    maxWidth: "90%",
    outline: 0,
});

interface ImagePreviewProps {
    show: boolean;
    close: () => void;
    img?: string;
}

export const ImagePreview = (props: ImagePreviewProps) => (
    <Modal
        open={props.show}
        onClose={props.close}
        closeAfterTransition
        sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
    >
        <Fade in={props.show}>
            <Image src={props.img} alt="asd" onClick={props.close}/>
        </Fade>
    </Modal>
);

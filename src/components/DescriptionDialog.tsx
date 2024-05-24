import { Box, Dialog, DialogContent, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import { TextRenderer } from "./TextRenderer";
import { normalizeText } from "./ComponentUtils";
import { Configuration } from "../configuration";

interface DescriptionDialogProps {
    show: boolean;
    close: () => void;
    title?: string;
    description?: string;
}

export default function DescriptionDialog(props: DescriptionDialogProps) {
    return (
        <Dialog fullScreen open={props.show} onClose={() => props.close()}>
            <DialogContent sx={{ paddingX: 3, paddingTop: 1 }}>
                <Stack
                    direction={"row"}
                    sx={{
                        paddingX: 0,
                        paddingTop: 1,
                        paddingBottom: 3,
                        height: "56px",
                        display: "flex",
                        justifyContent: "end",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexGrow: 1,
                            justifyContent: "center",
                            paddingLeft: 3,
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold">
                            {props.title ? normalizeText(props.title, 28) : Configuration.APPLICATION_NAME}
                        </Typography>
                    </Box>

                    <IconButton aria-label="close" onClick={() => props.close()} sx={{ padding: 0 }}>
                        <CloseIcon color="primary" fontSize="inherit" />
                    </IconButton>
                </Stack>
                <TextRenderer description={props.description} />
            </DialogContent>
        </Dialog>
    );
}

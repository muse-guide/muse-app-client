import React from "react";
import {Box, Skeleton, Stack, Typography} from "@mui/material";
import {Exposable} from "../model/common";
import {SimpleAudioPlayer} from "./SimpleAudioPlayer";

export const ExposableDetails = ({exposable, loading}: { exposable?: Exposable, loading: boolean }) => {
    return (
        <Stack
            px={3}
            pb={3}
            spacing={0.5}
            width={"100%"}
            sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                maxHeight: "300px",
                paddingTop: "24px",
                marginTop: "-32px",
                zIndex: 1,
                backgroundColor: "white",
                borderRadius: "24px",
                position: "relative"
            }}
        >

            <Box position={"absolute"} top={-28} right={24}>
                {loading ?
                    <Skeleton variant={"circular"} width={56} height={56}/>
                    : exposable?.audio && <SimpleAudioPlayer audioUrl={exposable?.audio}/>
                }
            </Box>

            <Stack gap={0.5} width={"100%"} pt={2}>
                {loading
                    ? <Stack width={"100%"} height={32} justifyContent={"center"}>
                        <Skeleton variant={"rectangular"} height={24} width={240}/>
                    </Stack>
                    : <Typography variant="h5" flexGrow={1} fontWeight={"bold"}>{exposable?.title}</Typography>
                }
                {loading
                    ? <Stack width={"100%"} height={24} justifyContent={"center"}>
                        <Skeleton variant={"rectangular"} height={24} width={300}/>
                    </Stack>
                    : exposable?.subtitle ?? <Typography variant="body1" color={"textSecondary"}>{exposable?.subtitle}</Typography>
                }
            </Stack>
        </Stack>
    );
}
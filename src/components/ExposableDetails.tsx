import React from "react";
import {Box, Button, Skeleton, Stack, Typography, useTheme} from "@mui/material";
import {Exposable} from "../model/common";
import {SimpleAudioPlayer} from "./SimpleAudioPlayer";
import MenuBookRoundedIcon from "@mui/icons-material/MenuBookRounded";
import {useTranslation} from "react-i18next";
import ArticleDialog from "./article/ArticleDialog";
import {useDialog} from "./hooks";

export const ExposableDetails = ({exposable, loading}: { exposable?: Exposable, loading: boolean }) => {
    const theme = useTheme();
    const {t} = useTranslation();
    const descDialog = useDialog()

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
                paddingTop: "40px",
                paddingBottom: "32px",
                marginTop: "-32px",
                zIndex: 1,
                backgroundColor: theme.palette.secondary.light,
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                // borderRadius: "24px",
                position: "relative"
            }}
        >
            {exposable?.article &&
                <ArticleDialog
                    show={descDialog.isOpen}
                    close={descDialog.closeDialog}
                    title={exposable?.title}
                    article={exposable.article}
                />
            }

            <Box position={"absolute"} top={-28} right={24}>
                {loading ?
                    <Skeleton variant={"circular"} width={56} height={56}/>
                    : exposable?.audio && <SimpleAudioPlayer audioUrl={exposable?.audio}/>
                }
            </Box>

            <Stack gap={0.5} width={"100%"}>
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
                    : exposable?.subtitle &&
                    <Typography variant="body1" color={"textSecondary"}>
                        {exposable?.subtitle}
                    </Typography>
                }

                {exposable?.article &&
                    <Stack
                        display={"flex"}
                        color={theme.palette.text.secondary}
                        width={"100%"}
                        direction={"row"}
                        justifyContent={"start"}
                        alignItems={"center"}
                        pt={1.5}
                    >
                        <Button
                            variant="text"
                            color={"inherit"}
                            sx={{textTransform: 'none'}}
                            startIcon={<MenuBookRoundedIcon color={"inherit"} fontSize={"large"}/>}
                            onClick={descDialog.openDialog}
                        >
                            <Typography variant={"subtitle2"} color={"textSecondary"}>{t('learnMore')}</Typography>
                        </Button>
                    </Stack>
                }
            </Stack>
        </Stack>
    );
}
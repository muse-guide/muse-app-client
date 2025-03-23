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
    const resourceLoading = !exposable || loading;

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
                paddingTop: "32px",
                paddingBottom: "16px",
                marginTop: "-32px",
                zIndex: 1,
                backgroundColor: theme.palette.secondary.light,
                borderTopLeftRadius: "24px",
                borderTopRightRadius: "24px",
                position: "relative",
            }}
        >
            {!resourceLoading && exposable?.article &&
                <ArticleDialog
                    show={descDialog.isOpen}
                    close={descDialog.closeDialog}
                    title={exposable?.title}
                    article={exposable.article}
                />
            }

            <Box position={"absolute"} top={-28} right={24}>
                {resourceLoading ?
                    <Skeleton variant={"circular"} width={56} height={56}/>
                    : exposable?.audio && <SimpleAudioPlayer audioUrl={exposable?.audio}/>
                }
            </Box>

            <Stack gap={0} width={"100%"}>
                {resourceLoading
                    ? <Stack width={"100%"} height={32} justifyContent={"center"}>
                        <Skeleton variant={"rectangular"} height={24} width={240}/>
                    </Stack>
                    : <Typography variant="h6" flexGrow={1} fontWeight={"bold"}>{exposable?.title}</Typography>
                }
                {resourceLoading
                    ? <Stack width={"100%"} height={24} justifyContent={"center"}>
                        <Skeleton variant={"rectangular"} height={24} width={300}/>
                    </Stack>
                    : exposable?.subtitle &&
                    <Typography variant="body1" color={"textSecondary"}>
                        {exposable?.subtitle}
                    </Typography>
                }

                {resourceLoading
                    ? <Stack pt={1.5} width={"100%"} height={46} alignItems={"start"} justifyContent={"center"}>
                        <Skeleton variant={"rectangular"} height={24} width={240}/>
                    </Stack>
                    : exposable?.article &&
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
                            startIcon={<MenuBookRoundedIcon color={"secondary"} fontSize={"large"}/>}
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
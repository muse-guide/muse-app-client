import {Exhibition} from "../../model/Exhibition";
import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import {useDialog} from "../../components/hooks";
import React, {useMemo} from "react";
import {Box, Link, Skeleton, Stack, Typography} from "@mui/material";
import DescriptionDialog from "../../components/DescriptionDialog";
import {SimpleAudioPlayer} from "../../components/SimpleAudioPlayer";

export const ExhibitionDetails = ({exhibition, loading}: { exhibition?: Exhibition, loading: boolean }) => {
    const theme = useTheme();
    const {t, i18n} = useTranslation();
    const descDialog = useDialog()

    const descAvailable: boolean = useMemo(() => !!(exhibition && exhibition?.description), [exhibition])

    return (
        <Stack
            px={3}
            spacing={0.5}
            width={"100%"}
            sx={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                maxHeight: "300px",
                paddingTop: "24px",
                paddingBottom: "8px",
                marginTop: "-18px",
                zIndex: 1,
                backgroundColor: "white",
                borderRadius: "24px",
                position: "relative"
            }}
        >
            {descAvailable && <DescriptionDialog show={descDialog.isOpen} close={descDialog.closeDialog} title={exhibition?.title} description={exhibition?.description!}/>}
            {!loading && <Box position={"absolute"} top={-28} right={24}>
                <SimpleAudioPlayer audioUrl={exhibition?.audio}/>
            </Box>}

            <Stack gap={1} width={"100%"}>
                {loading
                    ? <Skeleton variant={"rectangular"} height={24} width={240}/>
                    : <Typography variant="body1" flexGrow={1} fontWeight={"bolder"}>{exhibition?.title}</Typography>
                }
                {loading
                    ? <Skeleton variant={"rectangular"} height={48} width={300}/>
                    : <Typography variant="body1">{exhibition?.subtitle}</Typography>
                }
                {loading
                    ? <Skeleton variant={"rectangular"} height={22.5} width={200}/>
                    : <>
                        {descAvailable ?
                            <Link
                                color={theme.palette.secondary.main}
                                component={"button"}
                                underline="hover"
                                textAlign={"left"}
                                sx={{fontSize: '15px'}}
                                onClick={descAvailable ? descDialog.openDialog : undefined}
                            >
                                {t('learnMore')}
                            </Link>
                            : null
                        }
                    </>
                }
            </Stack>
        </Stack>
    );
}
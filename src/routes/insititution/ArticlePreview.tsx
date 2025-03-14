import {useTheme} from "@mui/material/styles";
import {useTranslation} from "react-i18next";
import React, {useEffect, useRef, useState} from "react";
import {Button, Skeleton, Stack, Typography} from "@mui/material";
import {TextRenderer} from "../../components/article/TextRenderer";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const ArticlePreview = ({article, loading}: { article?: string, loading: boolean }) => {
    const theme = useTheme();
    const {t} = useTranslation();
    const [showFull, setShowFull] = useState<boolean>(false);
    const [isOverflowing, setIsOverflowing] = useState<boolean>(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            setIsOverflowing(contentRef.current.scrollHeight > 200);
        }
    }, [article]);

    return (
        <Stack position={"relative"} spacing={2} mx={3} mb={showFull ? 2 : 3}>
            <Stack
                overflow={"hidden"}
                sx={{
                    maxHeight: showFull ? "100%" : "100px",
                    transition: "max-height 0.5s ease"
                }}
            >
                <div ref={contentRef}>
                    {loading
                        ? <Skeleton variant={"rectangular"} width={"100%"} height={200}/>
                        : <TextRenderer article={article}/>
                    }
                </div>
            </Stack>
            {!loading && !showFull && isOverflowing &&
                <Stack
                    position={"absolute"}
                    bottom={0}
                    width={"100%"}
                    display={"flex"}
                    justifyContent={"end"}
                >
                    <Stack
                        width={"100%"}
                        display={"flex"}
                        height={"30px"}
                        color={"red"}
                        bgcolor={"red"}
                        justifyContent={"end"}
                        sx={{
                            background: 'linear-gradient(0deg, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 20%, rgba(255,255,255,0) 100%)'
                        }}
                    />
                    <Stack
                        width={"100%"}
                        display={"flex"}
                        justifyContent={"center"}
                        bgcolor={theme.palette.background.paper}
                    >
                        <Button
                            sx={{fontSize: '15px'}}
                            onClick={() => {
                                setShowFull(true)
                            }}
                        >
                            <Stack direction={"row"} alignItems={"center"} gap={0.5}>
                                <ExpandMoreIcon/>
                                <Typography variant={"subtitle2"} fontWeight={'normal'} sx={{textTransform: 'none'}}>
                                    {t('expand')}
                                </Typography>
                            </Stack>
                        </Button>
                    </Stack>
                </Stack>
            }
        </Stack>
    )
}
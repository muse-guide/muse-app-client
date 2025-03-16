import {Exposable} from "../model/common";
import React, {useMemo} from "react";
import {Skeleton, Stack, Typography, useTheme} from "@mui/material";
import {normalizeText} from "./ComponentUtils";
import ArrowCircleRightRoundedIcon from '@mui/icons-material/ArrowCircleRightRounded';

export const ExposableListItem = ({exposable, onClick, itemNumber}: { exposable: Exposable, onClick: (id: string) => void, itemNumber?: number }) => {
    const theme = useTheme();
    const imageUrl = useMemo(() => exposable.imageUrls && exposable?.imageUrls.length > 0 ? exposable.imageUrls[0] : undefined, [exposable])

    return (
        <>
            <Stack
                onClick={() => onClick(exposable.id)}
                direction={"row"}
                display={"flex"}
                alignItems={"center"}
            >
                <img
                    src={imageUrl}
                    style={{
                        display: "block",
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: '60px',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover'
                    }}
                    alt={""}
                />
                <Stack px={2} flexGrow={1}>
                    <Typography variant="body2" fontWeight={"bold"}>
                        {itemNumber ? `${itemNumber}. ` : ''}{normalizeText(exposable.title, 40)}
                    </Typography>
                    {exposable.subtitle &&
                        <Typography variant="body2" fontWeight={"normal"}>
                            {normalizeText(exposable.subtitle, 48)}
                        </Typography>
                    }
                </Stack>
                {/*<ChevronRightIcon fontSize="large"/>*/}
                <ArrowCircleRightRoundedIcon fontSize="large" sx={{color: theme.palette.secondary.dark}}/>
            </Stack>
        </>
    );
};

export const ExposableListItemSkeleton = () => {
    return <Stack pt={0} pb={1} width={"100%"} gap={2} borderRadius={2}>
        {Array.from({length: 5}).map((_, index) => (
            <Skeleton variant={"rectangular"} height={64} key={'loading' + index}/>
        ))}
    </Stack>
}

export const ExposableListEmpty = () => {
    return <Stack width={"100%"} display={"flex"} alignItems={"center"} justifyContent={"center"}>
        <Typography variant={"subtitle2"} color={"textSecondary"}>No items found</Typography>
    </Stack>
}
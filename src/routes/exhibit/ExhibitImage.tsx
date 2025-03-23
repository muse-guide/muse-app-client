import React from "react";
import {IconButton, Stack, Typography} from "@mui/material";
import {useDialog} from "../../components/hooks";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import {ExposableImageGallery} from "../../components/ExposableImageGallery";

export const ExhibitImage = ({imageUrls}: { imageUrls?: string[] }) => {
    const imageGallery = useDialog()
    const imageAvailable = imageUrls && imageUrls?.length > 0
    const mainImage = imageUrls?.[0] ?? "/no_image.png"

    return (
        <>
            <ExposableImageGallery show={imageGallery.isOpen} close={imageGallery.closeDialog} images={imageUrls ?? []}/>
            <Stack
                width={'100%'}
                display={"flex"}
                alignItems={"center"}
                onClick={imageGallery.openDialog}
            >
                <img
                    src={mainImage}
                    style={{
                        display: "block",
                        width: '100%',
                        maxWidth: '260px',
                        aspectRatio: '1 / 1',
                        objectFit: 'cover',
                        borderRadius: 16,
                        boxShadow: '0px 9px 35px -12px rgba(66, 68, 90, 0.75)'
                    }}
                    alt={""}
                />
                <Stack
                    position={"relative"}
                    width={'100%'}
                    maxWidth={260}
                >
                    <Stack
                        position={"absolute"}
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"end"}
                        bottom={0}
                        right={0}
                        width={'100%'}
                        height={56}
                        maxWidth={260}
                        sx={{
                            background: imageAvailable ? 'linear-gradient(180deg, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.75) 100%)' : undefined,
                        }}
                        borderRadius={'0 0 16px 16px'}
                    >
                        {imageAvailable &&
                            <Stack direction={"row"} justifyContent={"center"} alignItems={"center"} pr={1.0}>
                                <Typography variant={"subtitle2"} color={"white"}>{`1/${imageUrls?.length}`}</Typography>
                                <IconButton>
                                    <CollectionsOutlinedIcon sx={{color: 'white'}}/>
                                </IconButton>
                            </Stack>
                        }
                    </Stack>
                </Stack>
            </Stack>
        </>
    )
}

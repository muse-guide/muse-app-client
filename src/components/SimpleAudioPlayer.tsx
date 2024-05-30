import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Fab, Stack, Zoom} from "@mui/material";
import HeadphonesIcon from "@mui/icons-material/Headphones";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import CloseIcon from "@mui/icons-material/Close";

export const SimpleAudioPlayer = ({audioUrl}: {
    audioUrl: string | undefined
}) => {
    const [playing, setPlaying] = useState(false)
    const [defaultState, setDefaultState] = useState(true)

    const audio = useMemo(
        () => {
            // TODO fix with development setup
            const url = audioUrl ? `https://duz68kh4juaad.cloudfront.net/${audioUrl}` : undefined
            return new Audio(url)
        },
        [audioUrl]
    )

    useEffect(() => {
        setPlaying(false)
        audio.addEventListener('ended', audioEnded)

        return () => {
            audio.removeEventListener('ended', audioEnded)
        }
    }, [])

    useEffect(() => {
        if (!playing) {
            audio.pause()
        } else {
            setDefaultState(false)
            audio.play()
        }
    }, [playing])

    const audioEnded = useCallback(() => {
        setPlaying(false)
        setDefaultState(true)
    }, []);


    const resetAudio = () => {
        setPlaying(false)
        setDefaultState(true)
        audio.currentTime = 0
    }

    return (
        <Stack direction='row-reverse' alignItems='center' justifyContent='center' gap={1}>
            <Fab color="secondary" aria-label="audio" onClick={() => setPlaying(!playing)}>
                {defaultState ? <HeadphonesIcon/> : playing ? <PauseIcon/> : <PlayArrowIcon/>}
            </Fab>
            <Zoom in={!defaultState}>
                <Fab size={"small"} color="default" onClick={resetAudio}>
                    <CloseIcon/>
                </Fab>
            </Zoom>
        </Stack>
    )
}
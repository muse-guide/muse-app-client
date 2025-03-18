import React, {useCallback, useEffect, useMemo, useState} from "react";
import {IconButton, Slider, Stack, Typography} from "@mui/material";
import Forward10RoundedIcon from '@mui/icons-material/Forward10Rounded';
import Replay10RoundedIcon from '@mui/icons-material/Replay10Rounded';
import PlayCircleFilledWhiteRoundedIcon from '@mui/icons-material/PlayCircleFilledWhiteRounded';
import PauseCircleRoundedIcon from '@mui/icons-material/PauseCircleRounded';

export const AudioPlayer = ({audioUrl}: { audioUrl?: string }) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const audioAvailable = useMemo(() => !!audioUrl, [audioUrl])

    const audio = useMemo(
        () => {
            return new Audio(audioUrl)
        },
        [audioUrl]
    )

    useEffect(() => {
        audio.addEventListener("timeupdate", handleTimeUpdate);
        audio.addEventListener('ended', audioEnded)
        audio.addEventListener('loadedmetadata', handleTimeUpdate);

        return () => {
            audio.pause()
            audio.removeEventListener("timeupdate", handleTimeUpdate);
            audio.removeEventListener('ended', audioEnded)
            audio.removeEventListener('loadedmetadata', handleTimeUpdate);
        };
    }, []);


    const audioEnded = useCallback(() => {
        setIsPlaying(false)
    }, []);

    const handlePlay = () => {
        audio.play();
        setIsPlaying(true);
    };

    const handlePause = () => {
        audio.pause();
        setIsPlaying(false);
    };

    const handlePlayPause = () => {
        if (isPlaying) {
            handlePause();
        } else {
            handlePlay();
        }
    };

    const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
    };

    const handleSeek = (value: number) => {
        audio.currentTime = value;
        setCurrentTime(value);
    };

    const rewind10Sec = () => handleSeek(audio.currentTime - 10)
    const forward10Sec = () => handleSeek(audio.currentTime + 10)

    function formatDuration(durationSeconds: number) {
        if (!audioAvailable) return "0:00";
        const minutes = Math.floor(durationSeconds / 60);
        const seconds = Math.floor(durationSeconds % 60);
        const formattedSeconds = seconds.toString().padStart(2, "0");
        return `${minutes}:${formattedSeconds}`;
    }

    return (
        <Stack width={"100%"} pt={1.5} px={1}>
            <Stack display={"block"}>
                <Stack direction={"row"} gap={2} justifyContent={"space-between"} alignItems={"center"} width={"100%"}>
                    <Typography variant="overline">{formatDuration(currentTime)}</Typography>
                    <Slider
                        size="small"
                        color="secondary"
                        onChange={(_, value) => handleSeek(value as number)}
                        value={currentTime}
                        max={duration}
                        disabled={!audioAvailable}
                    />
                    <Typography variant="overline">{formatDuration(duration)}</Typography>
                </Stack>
                <Stack mt={-1.5}>
                    <Stack direction={"row"} justifyContent={"space-around"} alignItems={"center"}>
                        <IconButton onClick={rewind10Sec} disabled={!audioAvailable}>
                            <Replay10RoundedIcon sx={{fontSize: 56}} color={audioAvailable ? "secondary" : "disabled"}/>
                        </IconButton>
                        <IconButton onClick={handlePlayPause} disabled={!audioAvailable}>
                            {isPlaying
                                ? <PauseCircleRoundedIcon sx={{fontSize: 72}} color={audioAvailable ? "secondary" : "disabled"}/>
                                : <PlayCircleFilledWhiteRoundedIcon sx={{fontSize: 72}} color={audioAvailable ? "secondary" : "disabled"}/>
                            }
                        </IconButton>
                        <IconButton onClick={forward10Sec} disabled={!audioAvailable}>
                            <Forward10RoundedIcon sx={{fontSize: 56}} color={audioAvailable ? "secondary" : "disabled"}/>
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
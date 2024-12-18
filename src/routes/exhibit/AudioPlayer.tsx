import React, {useCallback, useEffect, useMemo, useState} from "react";
import {IconButton, Slider, Stack, Typography} from "@mui/material";
import Replay10Icon from "@mui/icons-material/Replay10";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import Forward10Icon from "@mui/icons-material/Forward10";

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
        <Stack width={"100%"} pt={1.5}>
            <Stack display={"block"}>
                <Stack>
                    <Slider
                        size="small"
                        color="secondary"
                        onChange={(_, value) => handleSeek(value as number)}
                        value={currentTime}
                        max={duration}
                        disabled={!audioAvailable}
                    />
                    <Stack direction={"row"} justifyContent={"space-between"} mt={-2}>
                        <Typography variant="overline" color={"gray"}>{formatDuration(currentTime)}</Typography>
                        <Typography variant="overline" color={"gray"}>{formatDuration(duration)}</Typography>
                    </Stack>
                </Stack>
                <Stack mt={-1.5}>
                    <Stack direction={"row"} justifyContent={"space-around"} alignItems={"center"}>
                        <IconButton onClick={rewind10Sec} disabled={!audioAvailable}>
                            <Replay10Icon sx={{fontSize: 56}} color={audioAvailable ? "secondary" : "disabled"}/>
                        </IconButton>
                        <IconButton onClick={handlePlayPause} disabled={!audioAvailable}>
                            {isPlaying
                                ? <PauseCircleIcon sx={{fontSize: 72}} color={audioAvailable ? "secondary" : "disabled"}/>
                                : <PlayCircleIcon sx={{fontSize: 72}} color={audioAvailable ? "secondary" : "disabled"}/>
                            }
                        </IconButton>
                        <IconButton onClick={forward10Sec} disabled={!audioAvailable}>
                            <Forward10Icon sx={{fontSize: 56}} color={audioAvailable ? "secondary" : "disabled"}/>
                        </IconButton>
                    </Stack>
                </Stack>
            </Stack>
        </Stack>
    )
}
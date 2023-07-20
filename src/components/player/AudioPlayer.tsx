import React from "react";
import AudioPlayer from "react-h5-audio-player";
import "./playerStyles.css";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import SkipNextIcon from "@mui/icons-material/SkipNext";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";
import Forward10Icon from "@mui/icons-material/Forward10";
import Replay10Icon from "@mui/icons-material/Replay10";
import { useNavigate } from "react-router-dom";

interface AudioPlayerProps {
    audioSrc: string;
    nextExhibitId?: string;
    prevExhibitId?: string;
}

const Player = (props: AudioPlayerProps) => {
    const navigate = useNavigate();

    const moveToExhibitPage = (exhibitId?: string) => {
        if (exhibitId) navigate(`/exh/${exhibitId}`, { replace: true });
    };
    return (
        <AudioPlayer
            src={props.audioSrc}
            showSkipControls={true}
            showJumpControls={true}
            layout="stacked"
            progressUpdateInterval={200}
            customIcons={{
                play: <PlayCircleIcon fontSize="inherit" color="secondary" sx={{ height: "84px" }} />,
                pause: <PauseCircleIcon fontSize="inherit" color={"secondary"} />,
                previous: <SkipPreviousIcon fontSize="inherit" color={props.prevExhibitId ? "primary" : "disabled"} />,
                next: <SkipNextIcon fontSize="inherit" color={props.nextExhibitId ? "primary" : "disabled"} />,
                forward: <Forward10Icon fontSize="inherit" color={"primary"} />,
                rewind: <Replay10Icon fontSize="inherit" color={"primary"} />,
            }}
            customVolumeControls={[]}
            customAdditionalControls={[]}
            onClickPrevious={() => moveToExhibitPage(props.prevExhibitId)}
            onClickNext={() => moveToExhibitPage(props.nextExhibitId)}
        />
    );
};

export default Player;

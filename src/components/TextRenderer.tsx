import parse, {DOMNode, Element, HTMLReactParserOptions} from "html-react-parser";
import {Avatar, Stack, Typography} from "@mui/material";
import React from "react";

const AVAILABLE_TAGS = ["p", "i", "b", "img", "br", "ol", "li", "strong"];

export const TextRenderer = ({description}: { description?: string }) => {
    if (!description) return null;
    const options: HTMLReactParserOptions = {
        replace: replace,
    };

    return (
        <Typography component={"span"} variant="body1">
            <div>{parse(description, options)}</div>
        </Typography>
    );
};

export const TitleRenderer = ({number, title}: { number: number; title: string }) => {
    return (
        <Stack direction="row" alignItems={"center"} spacing={1}>
            <Avatar
                sx={{
                    width: 32,
                    height: 32,
                    bgcolor: "transparent",
                    border: "solid 2px",
                    fontWeight: "bolder",
                    fontSize: "1rem",
                    color: "primary.main",
                    borderColor: "primary.main",
                }}
            >
                {number}
            </Avatar>
            <Typography variant="h6" fontWeight={"bolder"}>
                {title}
            </Typography>
        </Stack>
    );
};

export const SubtitleRenderer = ({subtitle}: { subtitle?: string }) => {
    if (!subtitle) return null;
    const options: HTMLReactParserOptions = {
        replace: replace,
    };

    return (
        <Typography sx={{lineHeight: "1.5"}} variant="subtitle1">
            <div>{parse(subtitle, options)}</div>
        </Typography>
    );
};

const replace = (domNode: DOMNode) => {
    // remove not allowed tags and its child
    if (domNode?.type && domNode.type === "tag") {
        return AVAILABLE_TAGS.includes((domNode as Element).name) ? (
            domNode
        ) : (
            <span>
                <i>notSupportedTag!</i>
            </span>
        );
    }
};

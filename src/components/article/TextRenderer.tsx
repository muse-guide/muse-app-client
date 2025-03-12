import parse from "html-react-parser";
import {Typography} from "@mui/material";
import React from "react";
import DOMPurify from 'dompurify';
import "./articleStyles.css";

export const TextRenderer = ({article}: { article?: string }) => {
    if (!article) return null;

    // DOMPurify.addHook('uponSanitizeElement', (node, data) => {
    //     if (data.tagName === 'iframe') {
    //         const src = node.hasAttribute('') || ''
    //         if (!src.startsWith("https://www.youtube-nocookie.com/embed/")) {
    //             console.log(src, "jkkjjk")
    //             return node.parentNode?.removeChild(node)
    //         }
    //     }
    // })
    const articleSanitized = DOMPurify.sanitize(article, {
        ADD_TAGS: ["iframe"],
        ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
    });

    return (
        <Typography component={"span"} variant="body1">
            <div className={"article"}>{parse(articleSanitized)}</div>
        </Typography>
    );
};
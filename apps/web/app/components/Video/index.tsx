/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from "react";

type Props = {
    stream?: MediaStream;
    muted?: boolean;
};

export const Video: React.FC<Props> = ({ stream, muted }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return (
        <video
            style={{ position: "absolute", left: 0, top: 0, height: "100%", width: "100%" }}
            ref={videoRef}
            autoPlay
            playsInline
            muted={muted}
        />
    );
};

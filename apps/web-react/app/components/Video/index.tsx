/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from "react";

type Props = {
    stream?: MediaStream;
};

export const Video: React.FC<Props> = ({ stream }) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
    }, [stream]);

    return <video style={{ maxWidth: "100%" }} ref={videoRef} autoPlay playsInline />;
};

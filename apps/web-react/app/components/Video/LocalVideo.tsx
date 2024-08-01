/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { usePeers } from "../../store/peersContext";
import { Video } from ".";

export const LocalVideo: React.FC = () => {
    const { localStream } = usePeers();

    return <Video stream={localStream} />;
};

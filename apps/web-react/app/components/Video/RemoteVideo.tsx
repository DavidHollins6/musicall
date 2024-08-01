/* eslint-disable jsx-a11y/media-has-caption */
import React from "react";
import { usePeers } from "../../store/peersContext";
import { Video } from ".";

type Props = {
    peerId: string;
};

export const RemoteVideo: React.FC<Props> = ({ peerId }) => {
    const { peers } = usePeers();
    const peer = peers[peerId];

    return <Video stream={peer.stream} />;
};

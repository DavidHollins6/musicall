import { useSelector } from "@xstate/react";
import { createActor, enqueueActions, setup } from "xstate";

export const streamMachine = setup({
    types: {} as {
        context: {
            stream?: MediaStream;
        };
        events:
            | { type: "stream.enable" }
            | { type: "stream.createStream"; stream: MediaStream }
            | {
                  type: "stream.updateVideoStream";
                  stream: MediaStream;
              }
            | {
                  type: "stream.toggleVideoStreamEnabled";
                  enabled: boolean;
              }
            | {
                  type: "stream.updateAudioStream";
                  stream: MediaStream;
              }
            | {
                  type: "stream.toggleAudioStreamEnabled";
                  enabled: boolean;
              };
    },
    actors: {},
}).createMachine({
    id: "stream",
    context: {},
    initial: "disabled",
    states: {
        disabled: {
            on: {
                "stream.updateAudioStream": {
                    actions: enqueueActions(({ event, enqueue, context }) => {
                        const newStream = context.stream || new MediaStream();

                        event.stream.getAudioTracks().forEach((at) => {
                            newStream?.addTrack(at);
                        });

                        enqueue.assign({ stream: newStream });
                        const videoTracksExist = newStream.getVideoTracks().length > 0;
                        const audioTracksExist = newStream.getAudioTracks().length > 0;

                        if (videoTracksExist && audioTracksExist) {
                            enqueue.raise({ type: "stream.enable" });
                        }
                    }),
                },
                "stream.updateVideoStream": {
                    actions: enqueueActions(({ event, enqueue, context }) => {
                        const newStream = context.stream || new MediaStream();

                        event.stream.getVideoTracks().forEach((at) => {
                            newStream?.addTrack(at);
                        });

                        enqueue.assign({ stream: newStream });

                        const videoTracksExist = newStream.getVideoTracks().length > 0;
                        const audioTracksExist = newStream.getAudioTracks().length > 0;

                        if (videoTracksExist && audioTracksExist) {
                            enqueue.raise({ type: "stream.enable" });
                        }
                    }),
                },
                "stream.enable": {
                    target: "#stream.enabled",
                },
            },
        },
        enabled: {
            on: {
                "stream.updateAudioStream": {
                    actions: enqueueActions(({ context, event, enqueue }) => {
                        const newStream = context.stream || new MediaStream();

                        newStream?.getAudioTracks().forEach((at) => {
                            newStream?.removeTrack(at);
                        });

                        event.stream.getAudioTracks().forEach((at) => {
                            newStream?.addTrack(at);
                        });

                        enqueue.assign({ stream: newStream });
                    }),
                },
                "stream.updateVideoStream": {
                    actions: enqueueActions(({ context, event, enqueue }) => {
                        const newStream = context.stream || new MediaStream();

                        newStream?.getVideoTracks().forEach((at) => {
                            newStream?.removeTrack(at);
                        });

                        event.stream.getVideoTracks().forEach((at) => {
                            newStream?.addTrack(at);
                        });

                        enqueue.assign({ stream: newStream });
                    }),
                },
            },
        },
    },
});

export const streamActor = createActor(streamMachine);

export const useStreamStateMachine = () => {
    const state = useSelector(streamActor, (state) => state);

    return {
        ...state,
        send: streamActor.send,
    };
};

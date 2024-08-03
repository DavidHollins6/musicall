import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useDevice, useDeviceDispatcher } from "~/store/deviceContext";
import { usePeers } from "~/store/peersContext";
import { Input, WebMidi } from "webmidi";

export const ControlBar: React.FC = () => {
    const [inputs, setInputs] = useState<Input[]>([]);
    const [selectedMidiInput, setSelectedMidiInput] = useState<string>("");
    const { voice, video, midi } = useDevice();
    const deviceDispatcher = useDeviceDispatcher();
    const { localStream } = usePeers();

    useEffect(() => {
        setInputs(WebMidi.inputs);
        if (WebMidi.inputs.length > 0) {
            const firstMidiInput = WebMidi.inputs[0];
            deviceDispatcher({ type: "setMidiDeviceId", id: firstMidiInput.id });
            setSelectedMidiInput(firstMidiInput.id);
        }
    }, []);

    return (
        <div>hi</div>
        // <Box className="control-bar">
        //     <Flex p="4" gap="4">
        //         <IconButton
        //             size="3"
        //             onClick={() => {
        //                 if (localStream) {
        //                     localStream.getAudioTracks().forEach((track) => (track.enabled = !voice.enabled));
        //                 }
        //                 deviceDispatcher({ type: "toggleVoice" });
        //             }}
        //             variant={voice.enabled ? "solid" : "outline"}
        //         >
        //             <Icon style={{ fontSize: "32px" }} icon={voice.enabled ? "mdi:microphone" : "mdi:microphone-off"} />
        //         </IconButton>
        //         <IconButton
        //             size="3"
        //             onClick={() => {
        //                 if (localStream) {
        //                     localStream.getVideoTracks().forEach((track) => (track.enabled = !video.enabled));
        //                 }
        //                 deviceDispatcher({ type: "toggleVideo" });
        //             }}
        //             variant={video.enabled ? "solid" : "outline"}
        //         >
        //             <Icon style={{ fontSize: "32px" }} icon={video.enabled ? "mdi:camera" : "mdi:camera-off"} />
        //         </IconButton>
        //         <IconButton
        //             size="3"
        //             onClick={() => {
        //                 deviceDispatcher({ type: "toggleMidi" });
        //             }}
        //             variant={midi.enabled ? "solid" : "outline"}
        //         >
        //             <Icon style={{ fontSize: "32px" }} icon={midi.enabled ? "mdi:music" : "mdi:music-off"} />
        //         </IconButton>
        //         <Select.Root size="3" value={selectedMidiInput} onValueChange={setSelectedMidiInput}>
        //             <Select.Trigger variant="soft" />
        //             <Select.Content>
        //                 {inputs.map((input) => (
        //                     <Select.Item key={input.id} value={input.id}>
        //                         {input.name}
        //                     </Select.Item>
        //                 ))}
        //             </Select.Content>
        //         </Select.Root>
        //     </Flex>
        // </Box>
    );
};

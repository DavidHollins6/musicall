import type { Mapping, TriggerType } from "$lib/db/schema";
import type { PeerConnection } from "$lib/sockets/PeerConnection.svelte";
import type { ISoundManager } from "$lib/utils/SoundManager/ISoundManager";

export type CallContext = {
    selectedMidiInputId: string | null;
    isVideoEnabled: boolean;
    isMicrophoneMuted: boolean;
    isMidiEnabled: boolean;
    peerConnection: PeerConnection;
    soundManager: ISoundManager;
    callId: string;
    midiMappings: Mapping[];
    midiTriggerTypes: TriggerType[];
};

export default function createCallState(initial: CallContext) {
    let selectedMidiInputId = $state<string | null>(initial.selectedMidiInputId);
    let isVideoEnabled = $state<boolean>(initial.isVideoEnabled);
    let isMicrophoneMuted = $state<boolean>(initial.isMicrophoneMuted);
    let isMidiEnabled = $state<boolean>(initial.isMidiEnabled);
    let peerConnection = $state(initial.peerConnection);
    let soundManager: ISoundManager = $state(initial.soundManager);
    let midiMappings = $state(initial.midiMappings);
    let midiTriggerTypes = $state(initial.midiTriggerTypes);

    const callId = initial.callId;

    return {
        callId,
        get selectedMidiInputId() {
            return selectedMidiInputId;
        },
        set selectedMidiInputId(value) {
            selectedMidiInputId = value;
        },

        get isVideoEnabled() {
            return isVideoEnabled;
        },
        set isVideoEnabled(value) {
            isVideoEnabled = value;
        },

        get isMicrophoneMuted() {
            return isMicrophoneMuted;
        },
        set isMicrophoneMuted(value) {
            isMicrophoneMuted = value;
        },

        get isMidiEnabled() {
            return isMidiEnabled;
        },
        set isMidiEnabled(value) {
            isMidiEnabled = value;
        },

        get peerConnection() {
            return peerConnection;
        },
        set peerConnection(value) {
            peerConnection = value;
        },

        get soundManager() {
            return soundManager;
        },
        set soundManager(value) {
            soundManager = value;
        },

        get midiMappings() {
            return midiMappings;
        },
        set midiMappings(value) {
            midiMappings = value;
        },

        get midiTriggerTypes() {
            return midiTriggerTypes;
        },
        set midiTriggerTypes(value) {
            midiTriggerTypes = value;
        },
    };
}

import { useEffect, useState } from "react";
import { ISoundManager } from "../utils/sound/ISoundManager";
import { KeyboardSoundManager } from "../utils/sound/KeyboardSoundManager";
import { InstrumentType, useDeviceStore } from "../store/deviceStore";

const getSoundManager = (type: InstrumentType) => {
    switch (type) {
        case "keyboard":
            return new KeyboardSoundManager();
        default:
            return new KeyboardSoundManager();
    }
};

export const useSoundManager = () => {
    const { instrumentType } = useDeviceStore();
    const [soundManager, setSoundManager] = useState<ISoundManager>(getSoundManager(instrumentType));

    useEffect(() => {
        setSoundManager(getSoundManager(instrumentType));
    }, [instrumentType]);

    return soundManager;
};

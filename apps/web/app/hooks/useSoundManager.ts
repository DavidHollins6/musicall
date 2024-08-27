import { useEffect, useState } from "react";
import { InstrumentType, useDevice } from "~/store/deviceContext";
import { ISoundManager } from "../utils/sound/ISoundManager";
import { KeyboardSoundManager } from "../utils/sound/KeyboardSoundManager";

const getSoundManager = (type: InstrumentType) => {
    switch (type) {
        case "keyboard":
            return new KeyboardSoundManager();
        default:
            return new KeyboardSoundManager();
    }
};

export const useSoundManager = () => {
    const { instrumentType } = useDevice();
    const [soundManager, setSoundManager] = useState<ISoundManager>(getSoundManager(instrumentType));

    useEffect(() => {
        setSoundManager(getSoundManager(instrumentType));
    }, [instrumentType]);

    return soundManager;
};

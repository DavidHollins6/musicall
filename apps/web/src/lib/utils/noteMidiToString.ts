export function noteMidiToString(n: number) {
    const noteName = [
        "C",
        "C#",
        "D",
        "D#",
        "E",
        "F",
        "F#",
        "G",
        "G#",
        "A",
        "A#",
        "B",
    ];
    const oct = Math.floor(n / 12) - 1;
    const note = n % 12;
    return noteName[note] + oct;
}

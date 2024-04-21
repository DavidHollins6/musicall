import { db } from "$lib/db/db";
import { mappings, triggerTypes } from "$lib/db/schema";

const data = [
    ["35", "Acoustic Bass Drum"],
    ["36", "Electric Bass Drum"],
    ["37", "Side Stick"],
    ["38", "Acoustic Snare"],
    ["39", "Hand Clap"],
    ["40", "Electric Snare"],
    ["41", "Low Floor Tom"],
    ["42", "Closed Hi-hat"],
    ["43", "High Floor Tom"],
    ["44", "Pedal Hi-hat"],
    ["45", "Low Tom"],
    ["46", "Open Hi-hat"],
    ["47", "Low-Mid Tom"],
    ["48", "High-Mid Tom"],
    ["49", "Crash Cymbal 1"],
    ["50", "High Tom"],
    ["51", "Ride Cymbal 1"],
    ["52", "Chinese Cymbal"],
    ["53", "Ride Bell"],
    ["54", "Tambourine"],
    ["55", "Splash Cymbal"],
    ["56", "Cowbell"],
    ["57", "Crash Cymbal 2"],
    ["58", "Vibraslap"],
    ["59", "Ride Cymbal 2"],
    ["60", "High Bongo"],
    ["61", "Low Bongo"],
    ["62", "Mute High Conga"],
    ["63", "Open High Conga"],
    ["64", "Low Conga"],
    ["65", "High Timbale"],
    ["66", "Low Timbale"],
    ["67", "High Agogô"],
    ["68", "Low Agogô"],
    ["69", "Cabasa"],
    ["70", "Maracas"],
    ["71", "Short Whistle"],
    ["72", "Long Whistle"],
    ["73", "Short Guiro"],
    ["74", "Long Guiro"],
    ["75", "Claves"],
    ["76", "High Woodblock"],
    ["77", "Low Woodblock"],
    ["78", "Mute Cuica"],
    ["79", "Open Cuica"],
    ["80", "Mute Triangle"],
    ["81", "Open Triangle"],
];

const kebabCase = (string) =>
    string
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, "-")
        .toLowerCase();

export const GET = async () => {
    data.forEach(async ([value, name], index) => {
        const result = await db
            .insert(triggerTypes)
            .values({
                fileName: kebabCase(name),
                instrumentTypeId: 1,
                name,
                order: index,
            })
            .returning();

        db.insert(mappings).values({
            triggerTypeId: result.id,
            value,
            userMappingId: 3,
        });
    });
};

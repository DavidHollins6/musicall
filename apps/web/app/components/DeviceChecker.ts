import useDeviceDetection from "../hooks/useDeviceDetection";

export function DeviceChecker({
    children,
}: {
    children: (device: "Mobile" | "Tablet" | "Desktop" | null) => React.ReactNode;
}) {
    const device = useDeviceDetection();

    if (device === null) {
        return;
    }

    return children(device);
}

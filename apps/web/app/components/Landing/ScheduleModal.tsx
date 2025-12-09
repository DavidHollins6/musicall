import { Button, Modal, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCalendar } from "@tabler/icons-react";

export function ScheduleModal({ students }) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Button onClick={() => open()} leftSection={<IconCalendar size={14} />} variant="subtle">
                Schedule
            </Button>
            <Modal opened={opened} onClose={close} title="Schedule Call">
                <TextInput label="Name" description="Input description" placeholder="Input placeholder" />
            </Modal>
        </>
    );
}

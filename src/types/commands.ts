export enum Cmd {
    SEND_PANEL_ACTIVE = "SEND_PANEL_ACTIVE",
};

interface CommandPayloads {
    [Cmd.SEND_PANEL_ACTIVE]: {
        selection: string,
    },
}

export interface Command<T extends keyof CommandPayloads = keyof CommandPayloads> {
    command: T,
    payload: CommandPayloads[T],
};

export const assertCmdType = <T extends keyof CommandPayloads>(cmd: Command, t: T): cmd is Command<T> => {
    return cmd.command == t;
}

export enum Cmd {
    SEND_PANEL_ACTIVE = "SEND_PANEL_ACTIVE",
    BACKGROUND_OPEN_OPTIONS_PAGE = "OPEN_OPTIONS_PAGE",
};

interface CommandPayloads {
    [Cmd.SEND_PANEL_ACTIVE]: {
        content: string,
        os: browser.runtime.PlatformOs,
    },
    [Cmd.BACKGROUND_OPEN_OPTIONS_PAGE]: {},
}

export type Command<T extends keyof CommandPayloads = keyof CommandPayloads> = {
    command: T,
} & CommandPayloads[T];

export const assertCmdType = <T extends keyof CommandPayloads>(cmd: Command, t: T): cmd is Command<T> => {
    return cmd.command == t;
}

import { assertCmdType, Cmd, Command } from '../types/command.js';

browser.runtime.onMessage.addListener(async (message: object, sender: browser.runtime.MessageSender) => {
    const cmd = message as Command;
    if (assertCmdType(cmd, Cmd.BACKGROUND_OPEN_OPTIONS_PAGE)) {
        await browser.runtime.openOptionsPage();
    }
});

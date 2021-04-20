import { assertCmdType, Cmd, Command } from '../types/commands.js';

const checkGuard = (window: Window, guardName: string): boolean => {
    const win = window as any;
    const value = win[guardName];
    if (typeof value === "undefined") {
        win[guardName] = Math.floor(Math.random() * 7777777);
        return true;
    }
    return false;
}

const init = async () => {
    if (!checkGuard(window, "firelomoSendPanel")) {
        return;
    }

    // const tabs = await browser.tabs.query({ active: true, currentWindow: true });
    // const tab = tabs[0];
    // await browser.tabs.insertCSS(tab.id, {
    //     file: "./sendPanel.css",
    // });

    browser.runtime.onMessage.addListener(async (message: object) => {
        const cmd = message as Command;
        if (assertCmdType(cmd, Cmd.SEND_PANEL_ACTIVE)) {
            let content = window.getSelection()?.toString();
            if (typeof content === "string") {
                console.log(`[firelomo] user section text: ${content}`);
            }
        }
    });
}

init().catch((err) => {
    console.error(`[firelomo] send panel init failed: ${err.message}`);
});

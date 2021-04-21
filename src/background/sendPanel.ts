import { Cmd, Command } from '../types/command.js';

export const inject = async (tab: browser.tabs.Tab) => {
    await browser.tabs.insertCSS(tab.id!, {
        file: "/dist/content/sendPanel/sendPanel.css",
    });
    await browser.tabs.executeScript(tab.id, {
        file: "/dist/content/sendPanel/sendPanel.js",
    });
}

export const open = async (tab: browser.tabs.Tab, content: string) => {
    const cmd: Command<Cmd.SEND_PANEL_ACTIVE> = {
        command: Cmd.SEND_PANEL_ACTIVE,
        content,
    };
    await browser.tabs.sendMessage(tab.id!, cmd);
}

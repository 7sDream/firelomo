import { MENU_ID } from '../const.js';
import { Cmd, Command } from '../types/commands.js';

browser.menus.create({
    id: MENU_ID.SEND_CONTENT,
    contexts: ["selection"],
    title: browser.i18n.getMessage("menuTitleSendContent"),
});

browser.menus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === MENU_ID.SEND_CONTENT) {
        await browser.tabs.executeScript(tab.id!, {
            file: "/dist/content/browser.sendPanel.js",
        });
        const cmd: Command<Cmd.SEND_PANEL_ACTIVE> = {
            command: Cmd.SEND_PANEL_ACTIVE,
            payload: null,
        };
        browser.tabs.sendMessage(tab.id!, cmd);
    }
});

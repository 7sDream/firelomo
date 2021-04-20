import { MENU_ID } from '../const.js';
import { Cmd, Command } from '../types/commands.js';

browser.menus.create({
    id: MENU_ID.SEND_CONTENT,
    contexts: ["selection"],
    title: browser.i18n.getMessage("menuTitleSendContent"),
});

const injectSendPanel = async (tab: browser.tabs.Tab) => {
    await browser.tabs.insertCSS(tab.id!, {
        file: "/dist/content/sendPanel/sendPanel.css",
    });

    console.log(`[firelomo] [background] executing send-panel js at tab ${tab.id}`);
    await browser.tabs.executeScript(tab.id, {
        file: "/dist/content/sendPanel/sendPanel.js",
    });
    console.log(`[firelomo] [background] execute send-panel js at tab ${tab.id} success`);
}

const openSendPanel = async (tab: browser.tabs.Tab, content: string) => {
    console.log(`[firelomo] [background] send active panel message to tab ${tab.id}`);
    const cmd: Command<Cmd.SEND_PANEL_ACTIVE> = {
        command: Cmd.SEND_PANEL_ACTIVE,
        payload: {
            selection: content,
        },
    };
    await browser.tabs.sendMessage(tab.id!, cmd);
    console.log(`[firelomo] [background] send active panel message to tab ${tab.id} success`);
}

browser.menus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === MENU_ID.SEND_CONTENT) {
        try {
            await injectSendPanel(tab);
        } catch (err) {
            console.error(`[firelomo] [background] inject to ${tab.url} failed: ${err.message}`);
            return;
        }

        try {
            await openSendPanel(tab, info.selectionText ?? "");
        } catch (err) {
            console.error(`[firelomo] [background] send [openSendPanel] command failed: ${err.message}`);
            return;
        }
    }
});

browser.runtime.onMessage.addListener(async (message: object, sender: browser.runtime.MessageSender) => {
    const command = message as Command;

});

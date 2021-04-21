import { MENU_ID, OPTIONS, OPTIONS_DEFAULT_VALUE } from '../const.js';
import { assertCmdType, Cmd, Command } from '../types/commands.js';

browser.menus.create({
    id: MENU_ID.SEND_TO_FLOMO,
    contexts: ["selection", "link", "page"],
    title: browser.i18n.getMessage("menuTitleSendToFlomo"),
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
        content,
    };
    await browser.tabs.sendMessage(tab.id!, cmd);
    console.log(`[firelomo] [background] send active panel message to tab ${tab.id} success`);
}

const getTemplate = async (name: OPTIONS): Promise<string> => {
    switch (name) {
        case OPTIONS.SELECTION_TEMPLATE:
        case OPTIONS.PAGE_URL_TEMPLATE:
        case OPTIONS.LINK_URL_TEMPLATE: {
            return (await browser.storage.sync.get({ [name]: OPTIONS_DEFAULT_VALUE[name] }))[name];
        }
    }
    console.error(`[firelomo] [background] unknown template: ${name}`);
    return "";
};

const templateFill = async (name: OPTIONS, context: Record<string, string>): Promise<string> => {
    const template = await getTemplate(name);
    return context.selection ?? context.linkUrl ?? context.pageUrl ?? "";
};

browser.menus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === MENU_ID.SEND_TO_FLOMO) {
        try {
            await injectSendPanel(tab);
        } catch (err) {
            console.error(`[firelomo] [background] inject to ${tab.url} failed: ${err.message}`);
            return;
        }

        const pageTitle = tab.title ?? "";
        const pageUrl = tab.url ?? "";

        let content = "";
        if (info.selectionText) {
            content = await templateFill(OPTIONS.SELECTION_TEMPLATE, { selection: info.selectionText, pageTitle, pageUrl });
        } else if (info.linkUrl) {
            content = await templateFill(OPTIONS.LINK_URL_TEMPLATE, { linkUrl: info.linkUrl, linkText: info.linkText ?? "", pageTitle, pageUrl });
        } else if (info.pageUrl) {
            content = await templateFill(OPTIONS.PAGE_URL_TEMPLATE, { pageTitle, pageUrl });
        } else {
            console.error("[firelomo] [background] received client event with no usable content");
            return;
        }

        try {
            await openSendPanel(tab, content);
        } catch (err) {
            console.error(`[firelomo] [background] send [openSendPanel] command failed: ${err.message}`);
            return;
        }
    }
});

browser.runtime.onMessage.addListener(async (message: object, sender: browser.runtime.MessageSender) => {
    const cmd = message as Command;
    if (assertCmdType(cmd, Cmd.BACKGROUND_OPEN_OPTIONS_PAGE)) {
        await browser.runtime.openOptionsPage();
    }
});

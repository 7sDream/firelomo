import { MENU_ID, OPTIONS } from '../const.js';
import * as template from "../lib/template.js";
import { assertCmdType, Cmd, Command } from '../types/command.js';
import { ContextExtraPayload, Ctx } from '../types/context.js';


browser.menus.create({
    id: MENU_ID.SEND_TO_FLOMO,
    contexts: ["selection", "link", "page"],
    title: browser.i18n.getMessage("menuTitleSendToFlomo"),
});

const injectSendPanel = async (tab: browser.tabs.Tab) => {
    await browser.tabs.insertCSS(tab.id!, {
        file: "/dist/content/sendPanel/sendPanel.css",
    });

    await browser.tabs.executeScript(tab.id, {
        file: "/dist/content/sendPanel/sendPanel.js",
    });
}

const openSendPanel = async (tab: browser.tabs.Tab, content: string) => {
    const cmd: Command<Cmd.SEND_PANEL_ACTIVE> = {
        command: Cmd.SEND_PANEL_ACTIVE,
        content,
    };
    await browser.tabs.sendMessage(tab.id!, cmd);
}

const getContext = (info: browser.menus.OnClickData, tab: browser.tabs.Tab): ContextExtraPayload<Ctx> => {
    if (info.selectionText) {
        const context = OPTIONS.SELECTION_TEMPLATE;
        const payload: ContextExtraPayload<typeof context> = {
            context,
            selection: info.selectionText,
        };
        return payload as any;
    } else if (info.linkUrl) {
        const context = OPTIONS.LINK_URL_TEMPLATE;
        const payload: ContextExtraPayload<typeof context> = {
            context,
            linkText: info.linkText ?? "",
            linkUrl: info.linkUrl,
        };
        return payload as any;
    } else if (info.pageUrl) {
        const context = OPTIONS.PAGE_URL_TEMPLATE;
        const payload: ContextExtraPayload<typeof context> = {
            context,
        };
        return payload as any;
    } else {
        throw new Error("received event with no usable content");
    }
}

browser.menus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === MENU_ID.SEND_TO_FLOMO) {
        try {
            await injectSendPanel(tab);
        } catch (err) {
            console.error(`[firelomo] [background] inject to ${tab.url} failed: ${err.message}`);
            return;
        }

        let context;
        try {
            context = getContext(info, tab);
        } catch (err) {
            console.error(`[firelomo] [background] get context failed: ${err.message}`);
            return;
        }

        const content = await template.fill(context, info, tab);

        try {
            await openSendPanel(tab, content);
        } catch (err) {
            console.error(`[firelomo] [background] send [${Cmd.SEND_PANEL_ACTIVE}] command failed: ${err.message}`);
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

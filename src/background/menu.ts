import { MENU_ID, OPTIONS } from '../const.js';
import * as template from "../lib/template.js";
import { ContextExtraPayload, Ctx } from '../types/context.js';
import * as sendPanel from './sendPanel.js';

browser.menus.create({
    id: MENU_ID.SEND_TO_FLOMO,
    contexts: ["selection", "link", "page"],
    title: browser.i18n.getMessage("menuTitleSendToFlomo"),
});

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
            await sendPanel.inject(tab);
        } catch (err) {
            console.error(`[firelomo] [background] [menu] inject send panel to ${tab.url} failed: ${err.message}`);
            return;
        }

        let context;
        try {
            context = getContext(info, tab);
        } catch (err) {
            console.error(`[firelomo] [background] [menu] get context failed: ${err.message}`);
            return;
        }

        const content = await template.fill(context, info, tab);

        try {
            await sendPanel.open(tab, content);
        } catch (err) {
            console.error(`[firelomo] [background] [menu] open send panel failed: ${err.message}`);
            return;
        }
    }
});

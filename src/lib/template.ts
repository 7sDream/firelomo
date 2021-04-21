import { OPTIONS, OPTIONS_DEFAULT_VALUE } from "../const.js";
import { Context, ContextBase, ContextExtraPayload, Ctx } from '../types/context.js';

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

const dateFormatter = (date: Date) => {
    const year = date.getFullYear().toString().padStart(4, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    const second = date.getSeconds().toString().padStart(2, "0");
    return (format: string) => () => {
        const out = [];
        for (const char of format) {
            let target = char;
            if (char === 'Y') {
                target = year;
            } else if (char === "M") {
                target = month;
            } else if (char === "D") {
                target = day;
            } else if (char === "h") {
                target = hour;
            } else if (char === "m") {
                target = minute;
            } else if (char === "s") {
                target = second;
            }
            out.push(target);
        }
        return out.join("");
    };
}

const defaultContext = (info: browser.menus.OnClickData, tab: browser.tabs.Tab): ContextBase => {
    let date = new Date();
    let formatter = dateFormatter(date);
    return {
        date: formatter("Y/M/D"),
        time: formatter("h:m:s"),
        dateTime: formatter("Y/M/D h:m:s"),
        dateYear: formatter("Y"),
        dateMonth: formatter("M"),
        dateDay: formatter("D"),
        timeHour: formatter("h"),
        timeMinute: formatter("m"),
        timeSecond: formatter("s"),
        pageTitle: tab.title ?? "",
        pageUrl: tab.url ?? "",
    }
}

const fillReal = (template: string, context: Context<Ctx>): string => {
    Object.keys(context).forEach(((key: keyof Context<Ctx>) => {
        if (key !== "context") {
            template = template.replace(`{${key}}`, context[key] as any);
        }
    }) as any);
    return template;
}

export const fill = async (payload: ContextExtraPayload<Ctx>, info: browser.menus.OnClickData, tab: browser.tabs.Tab): Promise<string> => {
    const template = await getTemplate(payload.context);
    const context = Object.assign(defaultContext(info, tab), payload);
    return fillReal(template, context);
};

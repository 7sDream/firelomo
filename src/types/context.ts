import { OPTIONS } from '../const.js';

export type Ctx = OPTIONS.LINK_URL_TEMPLATE | OPTIONS.PAGE_URL_TEMPLATE | OPTIONS.SELECTION_TEMPLATE;

export interface ContextBase {
    date: () => string,
    time: () => string,
    dateTime: () => string,
    dateYear: () => string,
    dateMonth: () => string,
    dateDay: () => string
    timeHour: () => string,
    timeMinute: () => string,
    timeSecond: () => string,
    pageTitle: string,
    pageUrl: string,
};

interface ContextExtraPayloads {
    [OPTIONS.SELECTION_TEMPLATE]: {
        selection: string,
    },
    [OPTIONS.LINK_URL_TEMPLATE]: {
        linkText: string,
        linkUrl: string,
    },
    [OPTIONS.PAGE_URL_TEMPLATE]: {},
};

export type ContextExtraPayloadBase = { context: Ctx };
export type ContextExtraPayload<T extends Ctx> = ContextExtraPayloadBase & ContextExtraPayloads[T];
export type Context<T extends Ctx> = ContextBase & ContextExtraPayload<T>;

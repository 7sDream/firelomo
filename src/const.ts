export enum MENU_ID {
    SEND_TO_FLOMO = "FIRELOMO_MENU_ID_SEND_TO_FLOMO",
};

export enum OPTIONS {
    API_URL = "apiUrl",
    TIMEOUT = "timeout",
    SELECTION_TEMPLATE = "selectionTemplate",
    PAGE_URL_TEMPLATE = "pageUrlTemplate",
    LINK_URL_TEMPLATE = "linkUrlTemplate",
}

export const OPTIONS_DEFAULT_VALUE = {
    [OPTIONS.API_URL]: "",
    [OPTIONS.TIMEOUT]: 3000,
    [OPTIONS.SELECTION_TEMPLATE]: "{selection}\n\n#firelomo",
    [OPTIONS.PAGE_URL_TEMPLATE]: "{pageUrl}\n\n#firelomo",
    [OPTIONS.LINK_URL_TEMPLATE]: "{linkText}\n{linkUrl}\n\n#firelomo",
};

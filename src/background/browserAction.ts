import * as sendPanel from './sendPanel.js';

browser.browserAction.onClicked.addListener(async (tab) => {
    try {
        await sendPanel.inject(tab);
    } catch (err) {
        console.error(`[firelomo] [background] inject send panel to ${tab.url} failed: ${err.message}`);
        return;
    }

    try {
        await sendPanel.open(tab, "");
    } catch (err) {
        console.error(`[firelomo] [background] open send panel failed: ${err.message}`);
        return;
    }
});

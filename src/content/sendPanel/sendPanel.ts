import { assertCmdType, Cmd, Command } from '../../types/commands.js';

const checkGuard = (window: Window, guardName: string): boolean => {
    const win = window as any;
    const value = win[guardName];
    if (typeof value === "undefined") {
        win[guardName] = Math.floor(Math.random() * 7777777);
        return true;
    }
    return false;
}

const hide = (element: Element) => {
    element.classList.add("firelomo-hidden");
};

const show = (element: Element) => {
    element.classList.remove("firelomo-hidden");
};

const getApiUrl = async () => (await browser.storage.sync.get({ apiUrl: "" })).apiUrl;

const send = async (content: string, apiUrl: string) => {
    let abortController = new AbortController();

    setTimeout(() => {
        abortController.abort();
    }, 3000);

    await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ content }),
        redirect: "error",
        referrerPolicy: "no-referrer",
        credentials: "omit",
        cache: "no-cache",
        signal: abortController.signal,
    });
}

const init = () => {
    if (!checkGuard(window, "firelomoSendPanel")) {
        return;
    }

    // this will translated to file content directly in browserify compile step
    document.body.innerHTML += require('fs').readFileSync(__dirname + "/sendPanel.html", 'utf8');

    const sendPanel = document.querySelector("#firelomo-send-panel")!;
    const sendPanelContent = sendPanel.querySelector("#firelomo-content")! as HTMLTextAreaElement;
    const sendPanelSendButton = sendPanel.querySelector("#firelomo-send-button")!;
    const sendPanelCancelButton = sendPanel.querySelector("#firelomo-cancel-button")!;

    sendPanelSendButton.textContent = browser.i18n.getMessage("sendButtonTitle");
    sendPanelCancelButton.textContent = browser.i18n.getMessage("cancelButtonTitle");

    const disablePanelButton = (disable: boolean) => {
        if (disable) {
            sendPanelSendButton.setAttribute("disabled", "true");
            sendPanelCancelButton.setAttribute("disabled", "true");
        } else {
            sendPanelSendButton.removeAttribute("disabled");
            sendPanelSendButton.removeAttribute("disabled");
        }
    };

    sendPanelCancelButton.addEventListener("click", (event) => {
        hide(sendPanel);
        event.preventDefault();
    });

    sendPanelSendButton.addEventListener("click", async (event) => {
        disablePanelButton(true);
        try {
            await send(sendPanelContent.value, await getApiUrl());
        } catch (err) {
            console.error(`[firelomo] [sendPanel] send request failed: ${err.message}`);
        }
        sendPanelContent.value = "";
        hide(sendPanel);
        event.preventDefault();
    });

    browser.runtime.onMessage.addListener(async (message: object) => {
        const cmd = message as Command;
        if (assertCmdType(cmd, Cmd.SEND_PANEL_ACTIVE)) {
            if (!await getApiUrl()) {
                alert(browser.i18n.getMessage("emptyApiUrlTips"));
            } else {
                sendPanelContent.value = cmd.payload.selection;
                disablePanelButton(false);
                show(sendPanel);
            }
        }
    });
}

init();

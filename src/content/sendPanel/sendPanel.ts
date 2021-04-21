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
    const sendPanelOptionsButton = sendPanel.querySelector("#firelomo-options-button")!;
    const sendPanelSendButton = sendPanel.querySelector("#firelomo-send-button")!;
    const sendPanelCancelButton = sendPanel.querySelector("#firelomo-cancel-button")!;
    const sendPanelError = sendPanel.querySelector("#firelomo-error")!;
    const sendPanelErrorSummary = sendPanelError.querySelector("#firelomo-error-summary")!;
    const sendPanelErrorContent = sendPanelError.querySelector("#firelomo-error-content")!;

    sendPanelOptionsButton.textContent = browser.i18n.getMessage("optionsButtonTitle");
    sendPanelSendButton.textContent = browser.i18n.getMessage("sendButtonTitle");
    sendPanelCancelButton.textContent = browser.i18n.getMessage("cancelButtonTitle");

    const disablePanelButton = (disable: boolean) => {
        if (disable) {
            sendPanelSendButton.setAttribute("disabled", "true");
            sendPanelCancelButton.setAttribute("disabled", "true");
        } else {
            sendPanelSendButton.removeAttribute("disabled");
            sendPanelCancelButton.removeAttribute("disabled");
        }
    };

    const showError = (err: Error) => {
        sendPanelErrorSummary.textContent = browser.i18n.getMessage("sendFailedErrorMessage");
        sendPanelErrorContent.textContent = err.message;
        show(sendPanelError);
    }

    sendPanelOptionsButton.addEventListener("click", async (event) => {
        const cmd: Command<Cmd.BACKGROUND_OPEN_OPTIONS_PAGE> = {
            command: Cmd.BACKGROUND_OPEN_OPTIONS_PAGE,
        }
        await browser.runtime.sendMessage(cmd);
        event.preventDefault();
    });

    sendPanelCancelButton.addEventListener("click", (event) => {
        hide(sendPanel);
        event.preventDefault();
    });

    sendPanelSendButton.addEventListener("click", async (event) => {
        disablePanelButton(true);
        hide(sendPanelError);
        try {
            await send(sendPanelContent.value, await getApiUrl());
        } catch (err) {
            console.error(`[firelomo] [sendPanel] send request failed: ${err.message}`);
            showError(err);
            disablePanelButton(false);
            return;
        }
        sendPanelContent.value = "";
        hide(sendPanel);
        event.preventDefault();
    });

    browser.runtime.onMessage.addListener(async (message: object) => {
        const cmd = message as Command;
        if (assertCmdType(cmd, Cmd.SEND_PANEL_ACTIVE)) {
            const content = await getApiUrl() === "" ?
                browser.i18n.getMessage("emptyApiUrlTips") :
                cmd.content;
            sendPanelContent.value = content;
            disablePanelButton(false);
            hide(sendPanelError);
            show(sendPanel);
        }
    });
}

init();

let Form: HTMLFormElement;
let ApiUrlInput: HTMLInputElement;
let SubmitButton: HTMLButtonElement;

const showCurrentOptions = async () => {
    ApiUrlInput.value = (await browser.storage.sync.get({ apiUrl: "" })).apiUrl;
};

const updateOptions = async () => {
    const apiUrl = ApiUrlInput.value;
    await browser.storage.sync.set({ apiUrl });
};

const updateFormSubmitButtonState = () => {
    const validity = Form.checkValidity();
    if (validity) {
        SubmitButton.removeAttribute("disabled");
    } else {
        SubmitButton.setAttribute("disabled", "true");
    }
}

async function init() {
    Form = document.querySelector("#firelomo-options-form")!;
    ApiUrlInput = Form.querySelector("#firelomo-api-url-input")!;
    SubmitButton = Form.querySelector("#firelomo-submit-button")!;

    ApiUrlInput.addEventListener("input", updateFormSubmitButtonState);

    Form.addEventListener("submit", async (event) => {
        console.log("[firelomo] [options] submit");
        await updateOptions();
        event.preventDefault();
    });

    await showCurrentOptions();
};

document.addEventListener('DOMContentLoaded', init);

import { OPTIONS, OPTIONS_DEFAULT_VALUE } from '../../const.js';

let Form: HTMLFormElement;
let ApiUrlInput: HTMLInputElement;
let TimeoutInput: HTMLInputElement;
let SelectionTemplateInput: HTMLTextAreaElement;
let PageUrlTemplateInput: HTMLTextAreaElement;
let LinkUrlTemplateInput: HTMLTextAreaElement;
let SubmitButton: HTMLButtonElement;

const showCurrentOptions = async () => {
    const options = await browser.storage.sync.get(OPTIONS_DEFAULT_VALUE);
    ApiUrlInput.value = options[OPTIONS.API_URL];
    TimeoutInput.value = options[OPTIONS.TIMEOUT].toString();
    SelectionTemplateInput.value = options[OPTIONS.SELECTION_TEMPLATE];
    PageUrlTemplateInput.value = options[OPTIONS.PAGE_URL_TEMPLATE];
    LinkUrlTemplateInput.value = options[OPTIONS.LINK_URL_TEMPLATE];
};

const updateOptions = async () => {
    const apiUrl = ApiUrlInput.value;
    const timeout = parseInt(TimeoutInput.value || OPTIONS_DEFAULT_VALUE[OPTIONS.TIMEOUT].toString(), 10);
    const selectionTemplate = SelectionTemplateInput.value;
    const pageUrlTemplate = PageUrlTemplateInput.value;
    const linkUrlTemplate = LinkUrlTemplateInput.value;

    await browser.storage.sync.set({
        [OPTIONS.API_URL]: apiUrl,
        [OPTIONS.TIMEOUT]: timeout,
        [OPTIONS.SELECTION_TEMPLATE]: selectionTemplate,
        [OPTIONS.PAGE_URL_TEMPLATE]: pageUrlTemplate,
        [OPTIONS.LINK_URL_TEMPLATE]: linkUrlTemplate,
    });
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
    TimeoutInput = Form.querySelector("#firelomo-timeout-input")!;
    SelectionTemplateInput = Form.querySelector("#firelomo-selection-template-input")!;
    PageUrlTemplateInput = Form.querySelector("#firelomo-page-url-template-input")!;
    LinkUrlTemplateInput = Form.querySelector("#firelomo-link-url-template-input")!;
    SubmitButton = Form.querySelector("#firelomo-submit-button")!;

    ApiUrlInput.addEventListener("input", updateFormSubmitButtonState);
    TimeoutInput.addEventListener("input", updateFormSubmitButtonState);

    Form.addEventListener("submit", async (event) => {
        console.log("[firelomo] [options] submit");
        await updateOptions();
        event.preventDefault();
    });

    await showCurrentOptions();
};

document.addEventListener('DOMContentLoaded', init);

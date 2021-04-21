let Form: HTMLFormElement;
let ApiUrlInput: HTMLInputElement;
let TimeoutInput: HTMLInputElement;
let SelectionTemplateInput: HTMLTextAreaElement;
let PageUrlTemplateInput: HTMLTextAreaElement;
let LinkUrlTemplateInput: HTMLTextAreaElement;
let SubmitButton: HTMLButtonElement;

const DefaultSelectionTemplate = "{selection}\n\n#firelomo";
const DefaultPageUrlTemplate = "{pageUrl}\n\n#firelomo";
const DefaultLinkUrlTemplate = "{linkText}\n{linkUrl}\n\n#firelomo";


const showCurrentOptions = async () => {
    const options = await browser.storage.sync.get({
        apiUrl: "",
        timeout: 3000,
        selectionTemplate: DefaultSelectionTemplate,
        pageUrlTemplate: DefaultPageUrlTemplate,
        linkUrlTemplate: DefaultLinkUrlTemplate,
    });
    ApiUrlInput.value = options.apiUrl;
    TimeoutInput.value = options.timeout.toString();
    SelectionTemplateInput.value = options.selectionTemplate;
    PageUrlTemplateInput.value = options.pageUrlTemplate;
    LinkUrlTemplateInput.value = options.linkUrlTemplate;
};

const updateOptions = async () => {
    const apiUrl = ApiUrlInput.value;
    const timeout = parseInt(TimeoutInput.value || "3000", 10);
    const selectionTemplate = SelectionTemplateInput.value;
    const pageUrlTemplate = PageUrlTemplateInput.value;
    const linkUrlTemplate = LinkUrlTemplateInput.value;
    await browser.storage.sync.set({ apiUrl, timeout, selectionTemplate, pageUrlTemplate, linkUrlTemplate });
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

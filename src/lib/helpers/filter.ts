export const autoCompleteFilter = (textValue: string, inputValue: string) => {
    if (inputValue.length === 0) { return true; }
    textValue = textValue.normalize("NFC").toLocaleLowerCase();
    inputValue = inputValue.normalize("NFC").toLocaleLowerCase();
    return textValue.slice(0, inputValue.length) === inputValue;
};
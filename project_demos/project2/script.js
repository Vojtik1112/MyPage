document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("orderForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const customTextInput = document.getElementById("customText");
    const consentCheckbox = document.getElementById("consent");
    const resetBtn = form.querySelector('input[type="reset"]');

    const showError = (inputElement, message) => {
        const errorElement = document.getElementById(
            inputElement.getAttribute("aria-describedby")
        );
        inputElement.classList.add("input-error");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add("visible");
        }
        if (inputElement.type === "checkbox" || inputElement.type === "radio") {
            inputElement
                .closest(".checkbox-group, .radio-group")
                ?.classList.add("input-error");
        }
    };

    const clearError = (inputElement) => {
        const errorElement = document.getElementById(
            inputElement.getAttribute("aria-describedby")
        );
        inputElement.classList.remove("input-error");
        if (errorElement) {
            errorElement.textContent = "";
            errorElement.classList.remove("visible");
        }
        if (inputElement.type === "checkbox" || inputElement.type === "radio") {
            inputElement
                .closest(".checkbox-group, .radio-group")
                ?.classList.remove("input-error");
        }
    };

    const validateForm = () => {
        let isValid = true;

        clearError(nameInput);
        clearError(emailInput);
        clearError(customTextInput);
        clearError(consentCheckbox);

        const nameValue = nameInput.value.trim();
        const nameRegex = /^[A-Za-zÁ-Žá-ž\s\-']+$/;
        if (nameValue === "") {
            isValid = false;
            showError(nameInput, "Jméno a příjmení je povinné.");
        } else if (!nameRegex.test(nameValue)) {
            isValid = false;
            showError(
                nameInput,
                "Jméno může obsahovat pouze písmena, mezery a pomlčky."
            );
        }

        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailValue === "") {
            isValid = false;
            showError(emailInput, "E-mailová adresa je povinná.");
        } else if (!emailRegex.test(emailValue)) {
            isValid = false;
            showError(
                emailInput,
                "Zadejte platný formát e-mailové adresy (např. jmeno@domena.cz)."
            );
        }

        const customTextValue = customTextInput.value.trim();
        const customTextRegex = /^[A-Za-zÁ-Žá-ž0-9\s.,!?-]*$/;
        if (customTextValue !== "" && !customTextRegex.test(customTextValue)) {
            isValid = false;
            showError(customTextInput, "Vlastní text obsahuje nepovolené znaky.");
        }
        if (customTextValue.length > 50) {
            isValid = false;
            showError(customTextInput, "Vlastní text nesmí být delší než 50 znaků.");
        }

        if (!consentCheckbox.checked) {
            isValid = false;
            showError(consentCheckbox, "Musíte souhlasit se zpracováním údajů.");
        }

        return isValid;
    };


    form.addEventListener("submit", function (event) {
        const isFormValid = validateForm();

        if (!isFormValid) {
            event.preventDefault();

            const firstErrorField = form.querySelector(".input-error");
            if (firstErrorField) {
                firstErrorField.focus();
                if (
                    firstErrorField.classList.contains("checkbox-group") ||
                    firstErrorField.classList.contains("radio-group")
                ) {
                    firstErrorField.querySelector("input")?.focus();
                }
            }

            console.log("Formulář obsahuje chyby, odeslání zablokováno.");
        } else {
            console.log("Formulář je platný, pokus o odeslání...");
        }
    });

    resetBtn.addEventListener("click", function () {
        setTimeout(() => {
            clearError(nameInput);
            clearError(emailInput);
            clearError(customTextInput);
            clearError(consentCheckbox);
            form
                .querySelectorAll(
                    ".checkbox-group.input-error, .radio-group.input-error"
                )
                .forEach((el) => el.classList.remove("input-error"));
        }, 0);
    });

    nameInput.addEventListener("blur", () => {
        const nameValue = nameInput.value.trim();
        const nameRegex = /^[A-Za-zÁ-Žá-ž\s\-']+$/;
        clearError(nameInput);
        if (nameValue === "") {
            showError(nameInput, "Jméno a příjmení je povinné.");
        } else if (!nameRegex.test(nameValue)) {
            showError(
                nameInput,
                "Jméno může obsahovat pouze písmena, mezery a pomlčky."
            );
        }
    });
    emailInput.addEventListener("blur", () => {
        const emailValue = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        clearError(emailInput);
        if (emailValue === "") {
            showError(emailInput, "E-mailová adresa je povinná.");
        } else if (!emailRegex.test(emailValue)) {
            showError(emailInput, "Zadejte platný formát e-mailové adresy.");
        }
    });
    consentCheckbox.addEventListener("change", () => {
        if (consentCheckbox.checked) {
            clearError(consentCheckbox);
        } else {
        }
    });
});

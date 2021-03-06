document.addEventListener('blur', function (event) {
    let error = hasError(event.target);

    if (error) {
        showError(event.target, error);
        return;
    }

    removeError(event.target);
}, true);

document.addEventListener('submit', function (event) {
    let fields = event.target.elements;
    let error, hasErrors;

    for (let i = 0; i < fields.length; i++) {
        error = hasError(fields[i])
        if (error) {
            showError(fields[i], error);
            if (!hasErrors) {
                hasErrors = fields[i];
            }
        }
    }

    if (hasErrors) {
        event.preventDefault();
        hasErrors.focus();
    }
}, false);

let hasError = function (field) {

    if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

    if (checkPassw()) {
        if (field.name === 'passwordConfirm') return 'Hasła nie zgadzają się.';
    }
    let validity = field.validity;

    if (validity.valid) return;

    if (validity.valueMissing) {
        return 'To pole jest obowiązkowe.';
    }

    if (validity.tooShort) {
        if (field.name === 'newPassword') return 'Hasło musi składać się z co najmniej 8 znaków, w tym co najmniej jednej małej litery, jednej litery wielkiej, jednej cyfry oraz znaku specjalnego..'
    }

    if (validity.patternMismatch) {
        if (field.name === 'newPassword') return 'Podane hasło nie spełnia wymagań. Musi składać się ono z co najmniej 8 znaków, w tym co najmniej jednej małej litery, jednej litery wielkiej, jednej cyfry oraz znaku specjalnego.';
    }

    return 'Podana wartość jest błędna.';
};

let showError = function (field, error) {

    field.classList.add('error');
    let id = field.id || field.name;
    if (!id) return;

    let message = field.form.querySelector('.error-message#error-for-' + id);
    if (!message) {
        message = document.createElement('div');
        message.className = 'error-message';
        message.id = 'error-for-' + id;

        let label;
        label = field.form.querySelector('label[for="' + id + '"]') || field.parentNode;

        if (label) {
            label.parentNode.insertBefore(message, label.nextSibling);
        }

        if (!label) {
            field.parentNode.insertBefore(message, field.nextSibling);
        }

    }

    field.setAttribute('aria-describedby', 'error-for-' + id);

    message.innerHTML = error;

    message.style.marginLeft = '2%';
    message.style.display = 'block';
    message.style.visibility = 'visible';
};

let removeError = function (field) {

    field.classList.remove('error');
    field.removeAttribute('aria-describedby');

    let id = field.id || field.name;
    if (!id) return;

    let message = field.form.querySelector('.error-message#error-for-' + id + '');
    if (!message) return;

    message.innerHTML = '';
    message.style.display = 'none';
    message.style.visibility = 'hidden';


};

let checkPassw = function () {
    let password = document.getElementById('passwordForm2');
    let confirmPass = document.getElementById('passwordForm3');
    if (confirmPass.value) {
        if (password.value !== confirmPass.value) {
            return true;
        } else {
            return false;
        }
    }
};
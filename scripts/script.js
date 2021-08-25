function clearRadio() {
    // Clears any checked radios
    // Note: Needs to be done as the focusing on the input element does not
    //       properly uncheck other radios.
    const radios = Array.from(document.querySelectorAll('input[type="radio"]'));
    radios.forEach((x) => x.checked = false)
}

function checkCustomRadio() {
    // Checks the "custom" radio button
    // Note: This needs to be done since the radio button is not checked by default
    //       when the user focuses on the input element.
    let custom_radio = document.querySelector('#custom');
    custom_radio.checked = true;
}

function onCustomFocus() {
    // Runs when the custom tip percentage is focused on by the user
    clearRadio();
    checkCustomRadio();
}

function getNumFromInput(input_id) {
    // Returns value entered in the bill input element.
    const inputValue = +document.querySelector(input_id).value; // Get "#bill" value casted to a number.

    // Sanitize input
    if (isNaN(inputValue)) { // NaN case
        return -1;
    } else if (inputValue < 0) { // Negative number case
        console.log("Please enter a positive number.")
        return -2;
    } else {
        return inputValue;
    }
}

function updateBillError(error) {
    const billErrorElement = document.querySelector('.bill-error');

    switch(error) {
        case -1:
            billErrorElement.textContent = "Enter a numerical input.";
            break;
        case -2:
            billErrorElement.textContent = "Enter a positive number.";
            break;
        default:
    }
}

function updatePeopleError(error) {
    const peopleErrorElement = document.querySelector('.person-error');

    switch(error) {
        case -1:
            peopleErrorElement.textContent = "Enter a numerical input.";
            break;
        case -2:
            peopleErrorElement.textContent = "Enter a positive number.";
            break;
        default:
    }
}

function getBill() {
    let inputValue = getNumFromInput('#bill');
    switch(inputValue) {
        case -1:
            updateBillError(-1);
            return 0;
        case -2:
            updateBillError(-2);
            return 0;
        default:
            return inputValue;
    }
}

function getNumPeople() {
    let inputValue = getNumFromInput('#people');
    switch(inputValue) {
        case 0:
            return 1;
        case -1:
            updatePeopleError(-1);
            return 1;
        case -2:
            updatePeopleError(-2);
            return 1;
        default:
            return inputValue;
    }
}

function getTipPercentage() {
    // Get tip percentage

    const checkedRadio = document.querySelector('input[type="radio"]:checked')
    if (checkedRadio == null) {
        return 0;
    }

    // Process through radio buttons
    const checkedId = checkedRadio.id;
    if (checkedId == 'custom') {
        return getNumFromInput('#custom-value');
    } else {
        return +checkedId.replaceAll('-', ''); // Strips the "--"" in front of the id
    }
}

function calculateTipPerPerson(bill, tipPercentage, numPeople) {
    // Calculate tip per person
    // Note: Returns a float
    return (bill * (tipPercentage / 100) / numPeople).toFixed(2);
}

function calculateTotalPerPerson(bill, tipPercentage, numPeople) {
    // Calculate total per person rounded to two decimal places
    // Note: Returns a number
    return (bill * (1 + (tipPercentage / 100)) / numPeople).toFixed(2);
}

function updateTipAmount(amount) {
    // Updates the tip amount in the last container
    const tip = document.querySelector('#tip-final');
    tip.textContent = `$${amount}`;
}

function updateTotalAmount(amount) {
    // Updates the total amount in the last container
    const total = document.querySelector('#total-final');
    total.textContent = `$${amount}`;
}

function runCalculation() {
    // Grabs all values from input elements and updates the display

    // Get input element values
    const bill = getBill();
    const numPeople = getNumPeople();
    const tipPercentage = getTipPercentage();

    // Calculate tip and total amounts
    const tipAmount = calculateTipPerPerson(bill, tipPercentage, numPeople);
    const totalAmount = calculateTotalPerPerson(bill, tipPercentage, numPeople);

    // Update display values
    updateTipAmount(tipAmount);
    updateTotalAmount(totalAmount);

    // Light the reset button
    lightResetButton();
}

function attachRunListener(element) {
    element.addEventListener('change', (e) => {
        runCalculation();
    })
}

function clearBill() {
    // Clears the "#bill" input element
    const billInputElement = document.querySelector('#bill');
    billInputElement.value = "";
}

function clearPeople() {
    // Clears the "#people" input element
    const peopleInputElement = document.querySelector('#people');
    peopleInputElement.value = "";
}

function resetInputElements() {
    // Clear input elements
    clearRadio();
    clearBill();
    clearPeople();

    // Empty/"unlight" the reset button
    emptyResetButton();
}

function lightResetButton() {
    // "Lights up" the reset button by removing the ".reset-empty" CSS rules
    const resetButtonElement = document.querySelector('.reset-button');
    resetButtonElement.classList.remove('reset-empty');
}

function emptyResetButton() {
    // "Unlights" the reset button by adding the ".reset-empty" CSS rules
    const resetButtonElement = document.querySelector('.reset-button');
    resetButtonElement.classList.add('reset-empty');
}

window.onload = () => {
    // Attach onfocus event listener to the "custom-value" input element.
    document.querySelector('#custom-value').addEventListener('focus', (e) => {
        onCustomFocus();
    })

    // Attach click listener to the reset button
    const resetButtonElement = document.querySelector('.reset-button');
    resetButtonElement.addEventListener('click', (e) => {
        resetInputElements();
    })

    // Attach 'change' listeners on the input elements
    const billInputElement = document.querySelector('#bill');
    const peopleInputElement = document.querySelector('#people');
    const radios = Array.from(document.querySelectorAll('input[type="radio"]'));

    attachRunListener(billInputElement);
    attachRunListener(peopleInputElement);
    radios.forEach((radio) => {
        attachRunListener(radio);
    })
}
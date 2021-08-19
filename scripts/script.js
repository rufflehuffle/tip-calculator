function clearRadio() {
    // Clears any checked radios
    // Note: Needs to be done as the focusing on the input element does not
    //       properly uncheck other radios.
    let radios = Array.from(document.querySelectorAll('input[type="radio"]'));
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
        console.log("Please enter a numerical input.")
        return -1;
    } else if (inputValue < 0) { // Negative number case
        console.log("Please enter a positive number.")
        return -2;
    } else {
        return inputValue;
    }
}

function getBill() {
    return getNumFromInput('#bill');
}

function getNumPeople() {
    return getNumFromInput('#people');
}

function getTipPercentage() {
    // Get tip percentage

    // Process through radio buttons
    const checkedId = document.querySelector('input[type="radio"]:checked').id;
    if (checkedId == 'custom') {
        return getNumFromInput('#custom-value');
    } else {
        return +checkedId.replaceAll('-', ''); // Strip -- in front of the id
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
    const tip = document.querySelector('#tip-final');
    tip.textContent = `$${amount}`;
}

function updateTotalAmount(amount) {
    const total = document.querySelector('#total-final');
    total.textContent = `$${amount}`;
}

function runCalculation() {
    const bill = getBill();
    const numPeople = getNumPeople();
    const tipPercentage = getTipPercentage();

    const tipAmount = calculateTipPerPerson(bill, tipPercentage, numPeople);
    const totalAmount = calculateTotalPerPerson(bill, tipPercentage, numPeople);

    updateTipAmount(tipAmount);
    updateTotalAmount(totalAmount);
}

window.onload = () => {
    // Attach onfocus event listener to the "custom-value" input element.
    document.querySelector('#custom-value').addEventListener('focus', (e) => {
        onCustomFocus();
    })
}
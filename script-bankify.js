"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
    owner: "Tejas Patade",
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        "2019-11-18T21:31:17.178Z",
        "2019-12-23T07:42:02.383Z",
        "2020-01-28T09:15:04.904Z",
        "2020-04-01T10:17:24.185Z",
        "2020-05-08T14:11:59.604Z",
        "2020-05-27T17:01:17.194Z",
        "2020-07-11T23:36:17.929Z",
        "2020-07-12T10:51:36.790Z",
    ],
    currency: "EUR",
    locale: "pt-PT", // de-DE
};

const account2 = {
    owner: "Jeremy Wang",
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account3 = {
    owner: "Imane Anys ",
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2019-12-25T06:04:23.907Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
        "2020-06-25T18:49:59.371Z",
        "2020-07-26T12:01:20.894Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const account4 = {
    owner: "Michael Reeves",
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
    movementsDates: [
        "2019-11-01T13:15:33.035Z",
        "2019-11-30T09:48:16.867Z",
        "2020-01-25T14:18:46.235Z",
        "2020-02-05T16:33:06.386Z",
        "2020-04-10T14:43:26.374Z",
    ],
    currency: "USD",
    locale: "en-US",
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

// Global Variables
let currentAccount;
let sorted = false;
const now = new Date();

// Displaying Transactions
const displayTransactions = function (acc, sort = false) {
    // Remove any Existing irrelevant transactions
    containerMovements.innerHTML = "";

    // Sorted or No
    const txSorted = sort
        ? acc.movements.slice().sort((a, b) => a - b)
        : acc.movements;

    txSorted.forEach(function (transaction, i) {
        // Determine Type of current transaction
        const txType = transaction > 0 ? "deposit" : "withdrawal";

        // Date Computation
        const txDate = new Date(acc.movementsDates[i]);
        const day = txDate.getDate();
        const month = txDate.getMonth() + 1;
        const yr = txDate.getFullYear();
        const dispDate = `${day}/${month}/${yr}`;

        // Create HTML for current Transaction from array
        const markup = `
        <div class="movements__row">
            <div class="movements__type movements__type--${txType}">
                        ${i + 1} ${txType}
            </div>
            <div class="movements__date">${dispDate}</div>
            <div class="movements__value">${transaction.toFixed(2)}$</div>
        </div>
        `;

        // Add HTML onto parent element
        containerMovements.insertAdjacentHTML("afterbegin", markup);
    });
};

// Calculating Balance
function calcBalance(account) {
    account.balance = account.movements.reduce(
        (accum, current) => accum + current,
        0
    );
    labelBalance.textContent = `$${account.balance.toFixed(2)}`;
}

// Calculating Summary Insights
function calcInsightSummary(acc) {
    const deposits = acc.movements
        .filter((txaction) => txaction > 0)
        .reduce((accum, current) => accum + current, 0);
    labelSumIn.textContent = `${deposits.toFixed(2)}💲`;
    const deductions = acc.movements
        .filter((txaction) => txaction < 0)
        .reduce((accum, current) => accum + current, 0);
    labelSumOut.textContent = `${Math.abs(deductions).toFixed(2)}💲`;
    const interest = acc.movements
        .filter((txaction) => txaction > 0)
        .map((deposit) => (deposit * acc.interestRate) / 100)
        .filter((current) => current >= 1)
        .reduce((accum, current) => accum + current, 0);
    labelSumInterest.textContent = `${interest.toFixed(2)}💲`;
}

// Call All 3 UI methods
function updateUI() {
    calcBalance(currentAccount);
    calcInsightSummary(currentAccount);
    displayTransactions(currentAccount);
}

// Generating Usernames
function generateUsernames(accs) {
    accs.forEach(function (account) {
        const username = account.owner
            .toLowerCase()
            .split(" ")
            .map((name) => name[0])
            .join("");
        account.userName = username;
    });
}
generateUsernames(accounts);
// console.log(account1);

// ------------------------------------
// Event Listeners
// Login Functionality
btnLogin.addEventListener("click", function (event) {
    // Prevent Form from Submitting
    event.preventDefault();

    // Get Account for corresponding username
    currentAccount = accounts.find(
        (account) => account.userName === inputLoginUsername.value
    );

    // Check if username & pin are valid
    if (currentAccount?.pin === Number(inputLoginPin.value)) {
        console.log("Login Successful");
        // Display UI, Welcome Msg, Balance, Summary(Insights), Transactions
        containerApp.style.opacity = 100;
        labelWelcome.textContent = `Welcome, ${
            currentAccount.owner.split(" ")[0]
        }`;

        // Current Date & time
        labelDate.textContent = `${now.getDate()}/${now.getMonth()}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;

        // Clear input Fields
        inputLoginUsername.value = "";
        inputLoginPin.value = "";
        inputLoginPin.blur();

        // Call utility functions
        updateUI();
    }
});

// Transfer Funds Functionality
btnTransfer.addEventListener("click", function (event) {
    // Prevent Form from Submitting
    event.preventDefault();

    // Taking inputs
    const amount = Number(inputTransferAmount.value);
    const recipient = accounts.find(
        (acc) => acc.userName === inputTransferTo.value
    );
    console.log(amount, recipient);

    // Validate Transfer amount
    if (
        amount > 0 &&
        recipient &&
        amount <= currentAccount.balance &&
        recipient?.userName !== currentAccount.userName
    ) {
        // Transfer Funds
        currentAccount.movements.push(-1 * amount);
        recipient.movements.push(amount);

        // Store Transfer date in obj
        currentAccount.movementsDates.push(new Date().toISOString());
        recipient.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI();
        console.log("Txaction Successfull.");
    }
    // Clear input Fields
    inputTransferAmount.value = "";
    inputTransferTo.value = "";
    inputTransferAmount.blur();
});

// Request Loan Functionality
btnLoan.addEventListener("click", function (event) {
    // Prevent Form from Submitting
    event.preventDefault();

    // Check For Loan Request validity
    const loanAmount = Math.floor(inputLoanAmount.value);
    if (
        loanAmount > 0 &&
        currentAccount.movements.some(
            (txaction) => txaction >= loanAmount * 0.1
        )
    ) {
        // Deposit Approved Loan Amount
        console.log("Loan Sanctioned. :)");
        currentAccount.movements.push(loanAmount);
        // Store Loan Approve date in obj
        currentAccount.movementsDates.push(new Date().toISOString());
        // Update UI
        updateUI();
    }
    inputLoanAmount.value = "";
    inputLoanAmount.blur();
});

// Close Account Functionality
btnClose.addEventListener("click", function (event) {
    // Prevent Form from Submitting
    event.preventDefault();

    // Check Valid Credentials
    if (
        inputCloseUsername.value === currentAccount.userName &&
        Number(inputClosePin.value) === currentAccount.pin
    ) {
        // Hide UI
        containerApp.style.opacity = 0;

        // Calculate index
        const index = accounts.findIndex(
            (acc) => acc.userName === currentAccount.userName
        );
        // Remove Account from accounts array
        accounts.splice(index, 1);
        console.log("Account Closed Succesdfully.");
    }
    // Clear input Fields
    inputCloseUsername.value = "";
    inputClosePin.value = "";
    inputClosePin.blur();
});

// Sort Transactions
btnSort.addEventListener("click", function (event) {
    // Prevent Form from Submitting
    event.preventDefault();
    displayTransactions(currentAccount, !sorted);
    sorted = !sorted;
});

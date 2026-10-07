const balanceEl = document.getElementById('net-balance');
const incomeEl = document.getElementById('total-income');
const expenseEl = document.getElementById('total-expense');
const listEl = document.getElementById('transaction-list');
const formEl = document.getElementById('budget-form');
const descriptionEl = document.getElementById('description');
const amountEl = document.getElementById('amount');
const typeEl = document.getElementById('type');

// Завантаження збережених даних з localStorage або порожній масив
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

function init() {
    listEl.innerHTML = '';
    transactions.forEach(addTransactionDOM);
    updateValues();
}

function addTransaction(e) {
    e.preventDefault();

    const description = descriptionEl.value.trim();
    const amount = +amountEl.value;
    const type = typeEl.value;

    if (!description || isNaN(amount) || amount <= 0) {
        alert('Будь ласка, заповніть коректно всі поля.');
        return;
    }

    const transaction = {
        id: generateID(),
        description,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount)
    };

    transactions.push(transaction);
    addTransactionDOM(transaction);
    updateValues();
    updateLocalStorage();

    descriptionEl.value = '';
    amountEl.value = '';
}

function generateID() {
    return Math.floor(Math.random() * 100000000);
}

function addTransactionDOM(transaction) {
    const sign = transaction.amount < 0 ? '-' : '+';
    const itemClass = transaction.amount < 0 ? 'expense' : 'income';

    const li = document.createElement('li');
    li.classList.add(itemClass);

    li.innerHTML = `
        <span>${transaction.description}</span>
        <span>${sign}${Math.abs(transaction.amount).toFixed(2)} грн 
            <button class="delete-btn" onclick="removeTransaction(${transaction.id})">❌</button>
        </span>
    `;

    listEl.appendChild(li);
}

function updateValues() {
    const amounts = transactions.map(t => t.amount);

    const total = amounts.reduce((acc, item) => acc + item, 0).toFixed(2);

    const income = amounts
        .filter(item => item > 0)
        .reduce((acc, item) => acc + item, 0)
        .toFixed(2);

    const expense = (
        amounts.filter(item => item < 0).reduce((acc, item) => acc + item, 0) * -1
    ).toFixed(2);

    balanceEl.innerText = `${total} грн`;
    incomeEl.innerText = `${income} грн`;
    expenseEl.innerText = `${expense} грн`;
}

function removeTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    updateLocalStorage();
    init();
}

function updateLocalStorage() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

formEl.addEventListener('submit', addTransaction);

// Запуск при завантаженні сторінки
init();
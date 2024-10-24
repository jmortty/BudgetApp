const transactionForm = document.getElementById('transactionForm');
const descriptionInput = document.getElementById('description');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');

const totalIncomeElement = document.getElementById('totalIncome');
const totalExpensesElement = document.getElementById('totalExpenses');
const netBalanceElement = document.getElementById('netBalance');
const transactionListElement = document.getElementById('transactionList'); // New element for displaying transactions
const ctx = document.getElementById('budgetChart').getContext('2d');

let totalIncome = 0;
let totalExpenses = 0;
let transactions = [];

// Initialize Chart
const budgetChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Income', 'Expenses'],
        datasets: [{
            label: 'Amount ($)',
            data: [0, 0],
            backgroundColor: ['#4caf50', '#f44336'],
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Load existing transactions from local storage
window.onload = () => {
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    storedTransactions.forEach(transaction => addTransactionToDOM(transaction));
    updateTotals();
};

// Form Submission
transactionForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const description = descriptionInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const type = typeInput.value;

    // Validate inputs
    if (!description || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid description and a positive amount.');
        return;
    }

    const transaction = { description, amount, type };
    transactions.push(transaction);
    addTransactionToDOM(transaction);
    updateTotals();
    saveTransactions();
    transactionForm.reset();
});

// Function to add transaction to the DOM
function addTransactionToDOM(transaction) {
    const listItem = document.createElement('li');
    listItem.textContent = `${transaction.description}: $${transaction.amount.toFixed(2)} (${transaction.type})`;
    listItem.className = transaction.type === 'income' ? 'income' : 'expense';

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.className = 'remove-button';
    removeButton.onclick = () => {
        transactions = transactions.filter(t => t !== transaction);
        listItem.remove();
        updateTotals();
        saveTransactions();
    };

    listItem.appendChild(removeButton);
    transactionListElement.appendChild(listItem);
}

// Function to update totals
function updateTotals() {
    totalIncome = transactions.reduce((acc, transaction) => {
        return transaction.type === 'income' ? acc + transaction.amount : acc;
    }, 0);
    totalExpenses = transactions.reduce((acc, transaction) => {
        return transaction.type === 'expense' ? acc + transaction.amount : acc;
    }, 0);

    totalIncomeElement.textContent = totalIncome.toFixed(2);
    totalExpensesElement.textContent = totalExpenses.toFixed(2);
    netBalanceElement.textContent = (totalIncome - totalExpenses).toFixed(2);

    // Update chart
    budgetChart.data.datasets[0].data[0] = totalIncome;
    budgetChart.data.datasets[0].data[1] = totalExpenses;
    budgetChart.update();
}

// Function to save transactions to local storage
function saveTransactions() {
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

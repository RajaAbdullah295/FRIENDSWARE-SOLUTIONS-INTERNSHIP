/**  Aether Wallet — Personal Expense Tracker Logic
 
 */

//  1. STATE MANAGEMENT 


let expenses = [];

//2. DOM ELEMENTS
const expenseForm = document.getElementById('expense-form');
const inputTitle = document.getElementById('expense-title');
const inputAmount = document.getElementById('expense-amount');
const selectCategory = document.getElementById('expense-category');

const errorTitle = document.getElementById('title-error');
const errorAmount = document.getElementById('amount-error');
const errorCategory = document.getElementById('category-error');

const tableBody = document.getElementById('expense-table-body');
const totalAmountDisplay = document.getElementById('total-amount-display');
const categoryFilter = document.getElementById('category-filter');

//  3. HELPER FUNCTIONS


function formatPKR(value) {
  
  const formatter = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return `PKR ${formatter.format(value)}`;
}


function updateRunningTotal() {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  
  // Add a nice visual pop animation to the total display on change
  totalAmountDisplay.style.transform = 'scale(1.05)';
  totalAmountDisplay.textContent = formatPKR(total);
  
  setTimeout(() => {
    totalAmountDisplay.style.transform = 'scale(1)';
  }, 150);
}


function getCategoryBadge(category) {
  const normalized = category.toLowerCase();
  return `<span class="badge badge-${normalized}">${category}</span>`;
}

// --- 4. VALIDATION ENGINE ---


function validateTitle() {
  const title = inputTitle.value.trim();
  if (title === "") {
    inputTitle.classList.add('invalid');
    errorTitle.textContent = "Title cannot be empty.";
    errorTitle.classList.add('visible');
    return false;
  } else {
    inputTitle.classList.remove('invalid');
    errorTitle.classList.remove('visible');
    return true;
  }
}


function validateAmount() {
  const rawValue = inputAmount.value;
  const amount = parseFloat(rawValue);
  
  if (rawValue.trim() === "" || isNaN(amount) || amount <= 0) {
    inputAmount.classList.add('invalid');
    errorAmount.textContent = "Amount must be a positive number greater than 0.";
    errorAmount.classList.add('visible');
    return false;
  } else {
    inputAmount.classList.remove('invalid');
    errorAmount.classList.remove('visible');
    return true;
  }
}


function validateCategory() {
  const category = selectCategory.value;
  if (!category || category === "") {
    selectCategory.classList.add('invalid');
    errorCategory.classList.add('visible');
    return false;
  } else {
    selectCategory.classList.remove('invalid');
    errorCategory.classList.remove('visible');
    return true;
  }
}


inputTitle.addEventListener('input', validateTitle);
inputAmount.addEventListener('input', validateAmount);
selectCategory.addEventListener('change', validateCategory);


//  5. RENDER & TABLE MANAGEMENT 


function renderExpenses() {
  const filterValue = categoryFilter.value;
  
  
  const filteredExpenses = filterValue === 'all' 
    ? expenses 
    : expenses.filter(item => item.category === filterValue);

 
  tableBody.innerHTML = '';

  
  if (filteredExpenses.length === 0) {
    let emptyMessage = "No transactions logged yet. Add your first expense above!";
    if (filterValue !== 'all') {
      emptyMessage = `No transactions found under the "${filterValue}" category.`;
    }

    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML = `
      <td colspan="4">
        <div class="empty-state">
          <svg class="empty-state-icon" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.008 1.24l.885 1.77a2.25 2.25 0 0 0 2.007 1.24h1.98a2.25 2.25 0 0 0 2.007-1.24l.885-1.77a2.25 2.25 0 0 1 2.007-1.24h3.86m-18 0h18a2.25 2.25 0 0 1 2.25 2.25v4.25A2.25 2.25 0 0 1 18 21H6a2.25 2.25 0 0 1-2.25-2.25V15.75A2.25 2.25 0 0 1 2.25 13.5Zm2.4-7.11 2.922-2.922m.002 0a2.25 2.25 0 0 1 3.182 0l2.9 2.9m-1.5 1.513a11.375 11.375 0 0 1-2.285-1.417 11.379 11.379 0 0 1-2.233-1.4m0 0a2.25 2.25 0 0 0-3.182 0l-2.9 2.9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <p>${emptyMessage}</p>
        </div>
      </td>
    `;
    tableBody.appendChild(emptyRow);
    return;
  }

 
  filteredExpenses.forEach(item => {
    const tr = document.createElement('tr');
    tr.id = `expense-row-${item.id}`;
    tr.classList.add('row-fade-in');

    tr.innerHTML = `
      <td style="font-weight: 500;">${escapeHTML(item.title)}</td>
      <td>${getCategoryBadge(item.category)}</td>
      <td class="amount-column">${formatPKR(item.amount)}</td>
      <td style="text-align: center;">
        <button class="btn-delete" aria-label="Delete expense: ${escapeHTML(item.title)}" onclick="deleteExpense(${item.id})">
          <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}


function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

//  6. EVENT INTERACTION HANDLERS 


expenseForm.addEventListener('submit', function(e) {
  e.preventDefault();

  // Run full validation suite
  const isTitleValid = validateTitle();
  const isAmountValid = validateAmount();
  const isCategoryValid = validateCategory();

  
  if (!isTitleValid || !isAmountValid || !isCategoryValid) {
    return;
  }

  
  const newExpense = {
    id: Date.now(), // Unique ID using epoch milliseconds
    title: inputTitle.value.trim(),
    amount: parseFloat(inputAmount.value),
    category: selectCategory.value
  };

  
  expenses.push(newExpense);

 
  inputTitle.value = '';
  inputAmount.value = '';
  selectCategory.selectedIndex = 0;

  
  inputTitle.classList.remove('invalid');
  inputAmount.classList.remove('invalid');
  selectCategory.classList.remove('invalid');
  errorTitle.classList.remove('visible');
  errorAmount.classList.remove('visible');
  errorCategory.classList.remove('visible');

 
  renderExpenses();
  updateRunningTotal();

  // Focus back onto the title field for friction-free bulk logging
  inputTitle.focus();
});


window.deleteExpense = function(id) {
  const rowElement = document.getElementById(`expense-row-${id}`);
  
  if (rowElement) {
    
    rowElement.classList.remove('row-fade-in');
    rowElement.classList.add('row-fade-out');
    
    
    setTimeout(() => {
      expenses = expenses.filter(item => item.id !== id);
      renderExpenses();
      updateRunningTotal();
    }, 250); // Matches `--transition-fast` duration in CSS
  } else {
    // Fallback if row elements were modified directly
    expenses = expenses.filter(item => item.id !== id);
    renderExpenses();
    updateRunningTotal();
  }
};


categoryFilter.addEventListener('change', renderExpenses);


document.addEventListener('DOMContentLoaded', () => {
  // Render initial empty state correctly
  renderExpenses();
  updateRunningTotal();
});

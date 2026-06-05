/** Aether Wallet — Personal Expense Tracker Logic
 */




let expenses = [];


let editModeId = null;


let currentSort = 'none'; // 'none', 'asc', 'desc'

// 2. DOM ELEMENTS 
const expenseForm = document.getElementById('expense-form');
const formCard = document.getElementById('form-card');
const formActionTitle = document.getElementById('form-action-title');
const editBanner = document.getElementById('edit-banner');

const inputTitle = document.getElementById('expense-title');
const inputAmount = document.getElementById('expense-amount');
const selectCategory = document.getElementById('expense-category');

const errorTitle = document.getElementById('title-error');
const errorAmount = document.getElementById('amount-error');
const errorCategory = document.getElementById('category-error');

const btnSubmitText = document.getElementById('btn-submit-text');
const btnSubmitIcon = document.getElementById('btn-submit-icon');
const btnCancelEdit = document.getElementById('btn-cancel-edit');

const tableBody = document.getElementById('expense-table-body');
const totalAmountDisplay = document.getElementById('total-amount-display');
const categoryFilter = document.getElementById('category-filter');

const btnSortAsc = document.getElementById('btn-sort-asc');
const btnSortDesc = document.getElementById('btn-sort-desc');

const breakdownCard = document.getElementById('breakdown-card');
const categoryBreakdownList = document.getElementById('category-breakdown-list');


const SVG_PLUS = `<path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />`;
const SVG_PENCIL = `<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />`;

// 3. HELPER FUNCTIONS 


function formatPKR(value) {
  const formatter = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  return `PKR ${formatter.format(value)}`;
}


function updateRunningTotal() {
  const total = expenses.reduce((sum, item) => sum + item.amount, 0);
  
  
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

//  B1: LOCAL STORAGE SYNCHRONIZATION 


function saveToLocalStorage() {
  localStorage.setItem('aether_wallet_expenses', JSON.stringify(expenses));
}


function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem('aether_wallet_expenses');
    expenses = data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to read from localStorage:", error);
    expenses = [];
  }
}

//  B3: CATEGORY TOTALS BREAKDOWN PANEL 


function updateCategoryBreakdown() {
  
  const categories = ['Food', 'Transport', 'Utilities', 'Entertainment', 'Other'];
  const breakdown = {};
  categories.forEach(cat => breakdown[cat] = 0);

  
  expenses.forEach(item => {
    if (breakdown[item.category] !== undefined) {
      breakdown[item.category] += item.amount;
    }
  });


  categoryBreakdownList.innerHTML = '';

  
  const activeBreakdowns = categories.filter(cat => breakdown[cat] > 0);

  
  if (activeBreakdowns.length === 0) {
    breakdownCard.style.display = 'none';
    return;
  }

  breakdownCard.style.display = 'block';

  activeBreakdowns.forEach(cat => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'breakdown-item';
    itemDiv.innerHTML = `
      ${getCategoryBadge(cat)}
      <span class="breakdown-amount">${formatPKR(breakdown[cat])}</span>
    `;
    categoryBreakdownList.appendChild(itemDiv);
  });
}

//  4. VALIDATION ENGINE 


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


//  5. RENDER & TABLE LISTING MANAGEMENT 



 
function renderExpenses() {
  const filterValue = categoryFilter.value;
  
  
  let filteredExpenses = filterValue === 'all' 
    ? [...expenses] 
    : expenses.filter(item => item.category === filterValue);

  if (currentSort === 'asc') {
    filteredExpenses.sort((a, b) => a.amount - b.amount);
  } else if (currentSort === 'desc') {
    filteredExpenses.sort((a, b) => b.amount - a.amount);
  }

  
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
    
    
    if (editModeId === item.id) {
      tr.style.background = 'rgba(168, 85, 247, 0.08)';
      tr.style.borderColor = 'rgba(168, 85, 247, 0.2)';
    }

    tr.classList.add('row-fade-in');

    tr.innerHTML = `
      <td style="font-weight: 500;">${escapeHTML(item.title)}</td>
      <td>${getCategoryBadge(item.category)}</td>
      <td class="amount-column">${formatPKR(item.amount)}</td>
      <td style="text-align: center; white-space: nowrap;">
        <!-- Edit Button (B4) -->
        <button class="btn-edit" aria-label="Edit expense: ${escapeHTML(item.title)}" onclick="startEditExpense(${item.id})">
          <svg viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
          </svg>
        </button>
        <!-- Delete Button -->
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

// 6. EVENT INTERACTION HANDLERS 


expenseForm.addEventListener('submit', function(e) {
  e.preventDefault();

  
  const isTitleValid = validateTitle();
  const isAmountValid = validateAmount();
  const isCategoryValid = validateCategory();

  
  if (!isTitleValid || !isAmountValid || !isCategoryValid) {
    return;
  }

  const titleVal = inputTitle.value.trim();
  const amountVal = parseFloat(inputAmount.value);
  const categoryVal = selectCategory.value;

  if (editModeId !== null) {
    
    const index = expenses.findIndex(item => item.id === editModeId);
    if (index !== -1) {
      expenses[index].title = titleVal;
      expenses[index].amount = amountVal;
      expenses[index].category = categoryVal;
    }
    
    
    exitEditMode();
  } else {
    
    const newExpense = {
      id: Date.now(),
      title: titleVal,
      amount: amountVal,
      category: categoryVal
    };
    expenses.push(newExpense);
    
    
    inputTitle.value = '';
    inputAmount.value = '';
    selectCategory.selectedIndex = 0;
  }

  
  clearValidationState();

  
  saveToLocalStorage();
  renderExpenses();
  updateRunningTotal();
  updateCategoryBreakdown();

  
  inputTitle.focus();
});


function clearValidationState() {
  inputTitle.classList.remove('invalid');
  inputAmount.classList.remove('invalid');
  selectCategory.classList.remove('invalid');
  errorTitle.classList.remove('visible');
  errorAmount.classList.remove('visible');
  errorCategory.classList.remove('visible');
}


window.deleteExpense = function(id) {
  
  if (editModeId === id) {
    exitEditMode();
  }

  const rowElement = document.getElementById(`expense-row-${id}`);
  
  if (rowElement) {
    
    rowElement.classList.remove('row-fade-in');
    rowElement.classList.add('row-fade-out');
    
    
    setTimeout(() => {
      expenses = expenses.filter(item => item.id !== id);
      saveToLocalStorage();
      renderExpenses();
      updateRunningTotal();
      updateCategoryBreakdown();
    }, 250);
  } else {
    expenses = expenses.filter(item => item.id !== id);
    saveToLocalStorage();
    renderExpenses();
    updateRunningTotal();
    updateCategoryBreakdown();
  }
};

// B4: EDITING INLINE ENGINE 


window.startEditExpense = function(id) {
  const item = expenses.find(i => i.id === id);
  if (!item) return;


  editModeId = id;


  inputTitle.value = item.title;
  inputAmount.value = item.amount;
  selectCategory.value = item.category;

  
  clearValidationState();

  formCard.classList.add('editing-mode');
  formActionTitle.textContent = "Edit Expense";
  editBanner.style.display = 'block';
  btnSubmitText.textContent = "Update Transaction";
  btnSubmitIcon.innerHTML = SVG_PENCIL;
  btnCancelEdit.style.display = 'inline-flex';

  
  renderExpenses();

  
  inputTitle.focus();
  formCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
};


window.exitEditMode = function() {
  editModeId = null;

  
  inputTitle.value = '';
  inputAmount.value = '';
  selectCategory.selectedIndex = 0;

  
  clearValidationState();

  
  formCard.classList.remove('editing-mode');
  formActionTitle.textContent = "Add Expense";
  editBanner.style.display = 'none';
  btnSubmitText.textContent = "Add Transaction";
  btnSubmitIcon.innerHTML = SVG_PLUS;
  btnCancelEdit.style.display = 'none';

  
  renderExpenses();
};


btnCancelEdit.addEventListener('click', exitEditMode);

//  B2: SORT CONTROLS TRIGGERS 


function handleSortClick(order) {
  if (currentSort === order) {
    
    currentSort = 'none';
    btnSortAsc.classList.remove('active');
    btnSortDesc.classList.remove('active');
  } else {
    
    currentSort = order;
    if (order === 'asc') {
      btnSortAsc.classList.add('active');
      btnSortDesc.classList.remove('active');
    } else {
      btnSortDesc.classList.add('active');
      btnSortAsc.classList.remove('active');
    }
  }
  
  renderExpenses();
}

btnSortAsc.addEventListener('click', () => handleSortClick('asc'));
btnSortDesc.addEventListener('click', () => handleSortClick('desc'));


categoryFilter.addEventListener('change', renderExpenses);

//  7. INITIALIZATION BLOCK 

document.addEventListener('DOMContentLoaded', () => {
  
  loadFromLocalStorage();
  
  
  renderExpenses();
  updateRunningTotal();
  updateCategoryBreakdown();
});

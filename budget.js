document.addEventListener('DOMContentLoaded', () => {
    const budgetFeedback = document.querySelector('.budgetFeedback');
    const expenseFeedback = document.querySelector('.expenseFeedback');
    const budgetInput = document.querySelector('#budgetInput');
    const budgetAmount = document.querySelector('#budgetAmount');
    const expenseAmount = document.querySelector('#expenseAmount');
    const balance = document.querySelector('#balance');
    const balanceAmount = document.querySelector('#balanceAmount');
    const expenseInput = document.querySelector('#expenseInput');
    const amountInput = document.querySelector('#amountInput');
    const budgetSubmit = document.querySelector('#budgetSubmit');
    const expenseSubmit = document.querySelector('#expenseSubmit');
    const expenseList = document.querySelector('#expenseList');
    let itemList = [];
    let itemID = 0;

    //за добавяне на бюджета
    function submitBudget(){
        const value = budgetInput.value;
        if(value == '' || value < 0) {
            budgetFeedback.classList.add('showItem');
            budgetFeedback.innerHTML = `<p>Не може да бъде празно или отрицателна стойност</p>`;
            setTimeout(function(){
                budgetFeedback.classList.remove('showItem');
            }, 4000);
        } else {
            budgetAmount.textContent = value;
            budgetInput.value = '';
            showBalance();
        };
    };

    //да се покаже баланса
    function showBalance() {
        const expense = totalExpense();
        const total = parseInt(budgetAmount.textContent) - expense;
        balanceAmount.textContent = total;
        if(total < 0) {
            balance.classList.remove("showGreen", "showBlack");
            balance.classList.add("showRed");
        } else if(total > 0) {
            balance.classList.remove("showRed", "showBlack");
            balance.classList.add("showGreen");
        } else if(total == 0) {
            balance.classList.remove("showRed", "showGreen");
            balance.classList.add("showBlack");
        };
    };

    //за добавяне на разходи
    function submitExpense() {
        const expenseValue = expenseInput.value;
        const amountValue = amountInput.value;
        if(expenseValue == '' || amountValue == '' || amountValue < 0) {
            expenseFeedback.classList.add("showItem");
            expenseFeedback.innerHTML = `<p>Не може да бъде празно или отрицателна стойност</p>`;
            setTimeout(function() {
                expenseFeedback.classList.remove('showItem');
            }, 4000);
        } else {
            let amount = parseInt(amountValue);
            expenseInput.value = '';
            amountInput.value = '';
            let expense = {
                id:itemID,
                title:expenseValue,
                amount:amount,
            };
            itemID++;
            itemList.push(expense);
            addExpense(expense);
            showBalance();
        };
    };

    //да се покажат разходите
    function addExpense(expense) {
        const div = document.createElement('div');
        div.classList.add('expense');
        div.innerHTML = `
            <div class="row">
                <div class="col">
                    <div class="expenseItem d-flex justify-content-between align-items-baseline">
                        <div class="col">
                            <h6 class="expenseTitle listItem">- ${expense.title}</h6>
                        </div>
                        <div class="col">
                            <h5 class="expenseAmount listItem">${expense.amount}</h5>
                        </div>
                        <div class="col">
                            <div class="expenseIcons listItem">
                                <a href="#" class="editIcon mx-2" data-id="${expense.id}">
                                    <img src="images/pencil-square.svg"></img>
                                </a>
                                <a href="#" class="deleteIcon" data-id="${expense.id}">
                                    <img src="images/trash-fill.svg"></img>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        expenseList.appendChild(div);
    };
    
    //общо разходи
    function totalExpense() {
        let total = 0;
        if(itemList.length > 0) {
            total = itemList.reduce(function(acc, curr) {
                acc += curr.amount;
                return acc;
            }, 0);
        };
        expenseAmount.textContent = total;
        return total;
    };

    //редактиране на разходите
    function editExpense(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        expenseList.removeChild(parent);
        let expense = itemList.filter(function(item) {
            return item.id == id;
        });
        expenseInput.value = expense[0].title;
        amountInput.value = expense[0].amount;
        let list = itemList.filter(function(item) {
            return item.id != id;
        });
        itemList = list;
        showBalance()
    };

    //изтриване на разходи
    function deleteExpense(element) {
        let id = parseInt(element.dataset.id);
        let parent = element.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
        expenseList.removeChild(parent);
        let list = itemList.filter(function(item) {
            return item.id != id;
        });
        itemList = list;
        showBalance();
    };

    //бюджет
    budgetSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        submitBudget();
    });
    //разходи
    expenseSubmit.addEventListener('click', (e) => {
        e.preventDefault();
        submitExpense();
    });
    //редактиране и изтриване
    expenseList.addEventListener('click', (e) => {
        if(e.target.parentElement.classList.contains('editIcon')) {
            editExpense(e.target.parentElement)
        } else if(e.target.parentElement.classList.contains('deleteIcon')) {
            deleteExpense(e.target.parentElement)
        };
    });
});
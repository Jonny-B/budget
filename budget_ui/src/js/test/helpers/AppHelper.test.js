import axios from "axios";

export function createUserIfNecessary(){
    if (allowCreateUserCheck && user) {
        axios.post('/users/create', {userToken: user.sub});
        let d = [...data];
        SetAllowCreateUserCheck(false);
        SetData(d);
        SetAllowDateLookup(true)
    }
}

export function getDate(){
    if (allowDateLookup && user) {
        axios.get('/users', {params: {user_token: user.sub}}).then(u => {
            let d = [...data];
            let date = u.data.last_viewed;
            if (date === null || date == undefined) {
                date = new Date();
                let year = date.getYear() + 1900;
                let month = date.getMonth() + 1;
                date = `${year}/${month}/${1}`
            }

            d[2].selectedDate = date;
            SetAllowDateLookup(false);
            SetData(d);
            SetAllowBudgetLookup(true);
        })
    }
}

export function getBudgetData(){
    if (allowBudgetLookup && user) {
        axios.get('/budgets', {params: {userToken: user.sub, date: data[2].selectedDate}}).then(b => {
            let d = [...data];
            d[0].budgetData = b.data.budgetData;
            d[2].selectedDate = b.data.date;
            SetAllowBudgetLookup(false);
            SetData(d);
            SetAllowCategoryLookup(true);
        }).catch(e => {
            console.log('failed to get Budget Items')
        })
    }
}

export function getTransactionData(){
    if (allowTransactionLookup && user) {
        axios.get('/transactions', {params: {userToken: user.sub, date: data[2].selectedDate}}).then(t => {
            let d = [...data];
            d[1].transactionData = t.data.transactions;
            SetAllowTransactionLookup(false);
            SetData(d);
        }).catch(e => {
            console.log('failed to get transactions')
        })
    }
}

export function getCategories() {
    if (allowCategoryLookup && user) {
        axios.get('/categories', {params: {userToken: user.sub, date: data[2].selectedDate}}).then(category => {
            let categories = category.data.map(c => c.category);
            SetAllowCategoryLookup(false);
            SetCategories(categories);
            SetAllowTransactionLookup(true)
        }).catch(e => {
            console.log("Failed to get categories")
        })
    }
}

export function handleDropdownChange(transactionId, event, previousCategory){
    let d = [...data];
    let row = [];
    d[1].transactionData.forEach((r) => {
        if (r.id === transactionId) {
            r.assignCategory = event.target.value;
            row = r;
        }
    });
    SetData(d);
    axios.patch('/transactions/patch', {
        updateData: row,
        userToken: user.sub,
        transactionId: transactionId,
        date: data[2].selectedDate
    });
    handleUpdateCategory(row, previousCategory)
}

export function hideRow(updatedRowData){
    let d = [...data];
    d[1].transactionData.forEach((row) => {
        if (row.id === updatedRowData.id) {
            row.hidden = !updatedRowData.hidden;
        }
    });
    SetData(d);
    axios.patch('/transactions/patch', {
        updateData: updatedRowData,
        userToken: user.sub,
        date: data[2].selectedDate
    });
};

const handleDateChange = date => {
    let year = date.getYear() + 1900;
    let month = date.getMonth() + 1;
    let d = [...data];
    d[2].selectedDate = `${year}/${month}/${1}`;
    SetData(d);
    SetAllowTransactionLookup(true);
    SetAllowBudgetLookup(true);
}

const handleUpdateCategory = (transaction, previousCategory) => {
    let d = [...data];

    // Add to new category
    let incomeIndex = d[0].budgetData.incomeData.findIndex(i => i.category === transaction.assignCategory);
    let expensesIndex = d[0].budgetData.expensesData.findIndex(e => e.category === transaction.assignCategory);
    let savingsIndex = d[0].budgetData.savingsData.findIndex(s => s.category === transaction.assignCategory);
    let actual;
    if (incomeIndex !== -1) {
        actual = d[0].budgetData.incomeData[incomeIndex].actual;
        actual = (actual === "NaN" || actual === undefined) ? 0 : actual;
        d[0].budgetData.incomeData[incomeIndex].actual = (parseInt(actual) + parseInt(transaction.charge)).toString();
    }
    else if (expensesIndex !== -1) {
        actual = d[0].budgetData.expensesData[expensesIndex].actual;
        actual = (actual === "NaN" || actual === undefined) ? 0 : actual;
        d[0].budgetData.expensesData[expensesIndex].actual = (parseInt(actual) + parseInt(transaction.charge)).toString();
    }
    else if (savingsIndex !== -1) {
        actual = d[0].budgetData.savingsData[savingsIndex].actual;
        actual = (actual === "NaN" || actual === undefined) ? 0 : actual;
        d[0].budgetData.savingsData[savingsIndex].actual = (parseInt(actual) + parseInt(transaction.charge)).toString();
        d[0].budgetData.savingsData[savingsIndex].bucketTotal = d[0].budgetData.savingsData[savingsIndex].bucketTotal - transaction.charge;
    }
    // Subtract from old category
    incomeIndex = d[0].budgetData.incomeData.findIndex(i => i.category === previousCategory);
    expensesIndex = d[0].budgetData.expensesData.findIndex(e => e.category === previousCategory);
    savingsIndex = d[0].budgetData.savingsData.findIndex(s => s.category === previousCategory);
    if (incomeIndex !== -1) {
        actual = d[0].budgetData.incomeData[incomeIndex].actual;
        d[0].budgetData.incomeData[incomeIndex].actual = (parseInt(actual) - parseInt(transaction.charge)).toString();
    }
    else if (expensesIndex !== -1) {
        actual = d[0].budgetData.expensesData[expensesIndex].actual;
        d[0].budgetData.expensesData[expensesIndex].actual = (parseInt(actual) - parseInt(transaction.charge)).toString();
    }
    else if (savingsIndex !== -1) {
        actual = d[0].budgetData.savingsData[savingsIndex].actual;
        d[0].budgetData.savingsData[savingsIndex].actual = (parseInt(actual) - parseInt(transaction.charge)).toString();
    }
    SetData(d)
};

const handleAddCategory = (category, budget, type, id) => {
    let d = [...data];
    // TODO go around and fix this so you aren't using plural sometimes and not others. Doing this here will make the app very britle.
    if (type === 'expense') type = 'expenses';
    if (type === 'saving') type = 'savings';
    data[0].budgetData[`${type}Data`].push({category: category, budget: budget, actual: 0, type: type, id: id});
    updateCategories(category.category);

    // SetData(d)
};

const updateCategories = (newCategory) => {
    let cats = [...categories];
    cats.push(newCategory);
    SetCategories(cats);
    SetAllowCategoryLookup(true)
};

const handleDeleteCategory = oldData => {
    axios.delete('/categories/delete', {params: {id: oldData.id}});

    let d = [...data];

    data[1].transactionData.forEach((t) => {
        if (t.assignCategory === oldData.category) {
            t.assignedCategory = ""
        }

    });
    let cats = [...categories];
    cats.forEach((c, i) => {
        if (c === oldData.category) {
            cats.splice(i, 1);
        }
    });
    SetCategories(cats);
    SetData(d);

};

const handleOpenClosePlaid = () => {
    // this.setState({plaidModalOpen: !this.state.plaidModalOpen})
};

const handleAccountLink = (token, metadata) => {
    if (user) {
        axios.post('/users/set_plaid_token', {userToken: user.sub, plaidToken: token});
    }
};

const handleOnExit = () => {

};

const handleUpdate = (updatedRowData) => {
    axios.patch('/categories/patch', {
        id: updatedRowData.id,
        category: updatedRowData.category,
        budgeted: updatedRowData.budget
    });
    let d = [...data];
    let oldCategory = "";
    data[0].budgetData[`${updatedRowData.type}Data`].forEach((b) => {
        if (b.id === updatedRowData.id) {
            oldCategory = b.category;
            b.category = updatedRowData.category;
            b.budget = updatedRowData.budget;
        }

    });
    data[1].transactionData.forEach((t) => {
        if (t.assignCategory === oldCategory) {
            t.assignedCategory = updatedRowData.category
        }

    });
    SetAllowTransactionLookup(true);
    SetData(d);
    let cats = [...categories];
    cats.forEach((c, i) => {
        if (c === oldCategory) {
            cats[i] = updatedRowData.category;
        }
    });
    SetCategories(cats)

};
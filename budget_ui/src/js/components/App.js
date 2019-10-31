import React, {useState, useEffect} from 'react';
import {Grid, Typography, Select, MenuItem, Button, Dialog, DialogTitle} from '@material-ui/core';
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import ShowChart from '@material-ui/icons/ShowChart';
import Budget from './Budget'
import lightFormat from 'date-fns/lightFormat'
import Transactions from './Transactions'
import DateFnsUtils from "@date-io/date-fns";
import PlaidLink from 'react-plaid-link'
import NavBar from "./NavBar";
import {useAuth0} from "../../react-auth0-wrapper";
import axios from 'axios'


// TODO if there are no income categories but there ARE expense or savings table will not show.
// TODO when hiding a transaction. If it has a category selected that category will be mapped to the transaction that moves into its space. This is just graphical as it doesn't effect totals and is fixed on refresh.
// TODO create development/prod configs for deployment.
// TODO look and feel sucks.
// TODO clicking the add button makes the table shrink rather than open the form.
// TODO hiding should clear selected category.
// TODO write tests.

export default function App(props) {

    //user has a sub which is a unique identifier
    const {isAuthenticated, loginWithRedirect, logout, user} = useAuth0();

    const [plaidModalOpen, SetPlaidModalOpen, getTokenSilently] = useState(false);
    const [allowCreateUserCheck, SetAllowCreateUserCheck] = useState(true);
    const [allowDateLookup, SetAllowDateLookup] = useState(false);
    const [allowTransactionLookup, SetAllowTransactionLookup] = useState(false);
    const [allowBudgetLookup, SetAllowBudgetLookup] = useState(false);
    const [allowCategoryLookup, SetAllowCategoryLookup] = useState(false);
    const [categories, SetCategories] = useState([]);
    const [data, SetData] = useState([
        {
            budgetData:
                {
                    incomeData: [],
                    expensesData: [],
                    savingsData: []
                }

        },
        {
            transactionData: []
        },
        {
            selectedDate: ""
        }
    ]);


    useEffect(() => {
        createUserIfNecessary();
        getDate();
        getBudgetData();
        getCategories();
        getTransactionData();
    });

    const createUserIfNecessary = () => {
        if (allowCreateUserCheck && user) {
            axios.post('/users/create', {userToken: user.sub});
            let d = [...data];
            SetAllowCreateUserCheck(false);
            SetData(d);
            SetAllowDateLookup(true)
        }
    };

    const getDate = () => {
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
    };

    const getBudgetData = () => {
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
    };

    const getTransactionData = () => {
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
    };

    const getCategories = () => {
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
    };

    const handleDropdownChange = (transactionId, event, previousCategory) => {
        let d = [...data];
        let row = [];
        d[1].transactionData.forEach((r) => {
            if (r.id === transactionId) {
                r.assignCategory = event.target.value;
                row = r;
            }
        });
        SetData(d);
        axios.patch('/transactions/patch', {updateData: row, userToken: user.sub, transactionId: transactionId, date: data[2].selectedDate});
        handleUpdateCategory(row, previousCategory)
    };

    const hideRow = updatedRowData => {
        let d = [...data];
        d[1].transactionData.forEach((row) => {
            if (row.id === updatedRowData.id) {
                row.hidden = !updatedRowData.hidden;
            }
        });
        SetData(d);
        axios.patch('/transactions/patch', {updateData: updatedRowData, userToken: user.sub, date: data[2].selectedDate});
    };

    const handleDateChange = date => {
        let year = date.getYear() + 1900;
        let month = date.getMonth() + 1;
        let d = [...data];
        d[2].selectedDate = `${year}/${month}/${1}`;
        SetData(d);
        SetAllowTransactionLookup(true);
        SetAllowBudgetLookup(true);
    };

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
            if (c === oldData.category){
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
        axios.patch('/categories/patch',{id: updatedRowData.id, category: updatedRowData.category, budgeted: updatedRowData.budget});
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
            if (c === oldCategory){
                cats[i] = updatedRowData.category;
            }
        });
        SetCategories(cats)

    };

    return (
        <MuiThemeProvider theme={theme}>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container spacing={3} className="App">
                    <Grid item xs={12}> <NavBar isAuthenticated={isAuthenticated} loginWithRedirect={loginWithRedirect} logout={logout} user={user}/> </Grid>
                    <Grid item xs={6}> <Typography> PRACTICE CRUD APP and HOOKS </Typography> </Grid>
                    <Grid item xs={3}> <Button><ShowChart/></Button> </Grid>
                    <Grid item xs={3}>
                        {isAuthenticated && <PlaidLink
                            clientName="Budget"
                            env="sandbox"
                            product={["auth", "transactions"]}
                            publicKey="b6eae93fa88deb27355f14563287d5"
                            onExit={handleOnExit}
                            onSuccess={handleAccountLink}>
                            Link Account Transactions
                        </PlaidLink>}
                    </Grid>
                    <Grid item xs={12}>
                        { data[2].selectedDate != "" ? <DatePicker
                            views={["year", "month"]}
                            label="Budget Date"
                            helperText="Choose Month/Year"
                            minDate={new Date("2000-01-01")}
                            value={data[2].selectedDate}
                            onChange={handleDateChange}
                        /> : <></>}
                    </Grid>
                    <Grid item xs={6}>
                        {
                           ( data[0].budgetData.incomeData.length !== 0 || data[0].budgetData.expensesData.length !== 0 || data[0].budgetData.savingsData.length !== 0) ?
                                <Budget
                                    date={data[2].selectedDate}
                                    data={data[0].budgetData}
                                    userToken={user.sub}
                                    handleUpdate={handleUpdate}
                                    handleDeleteCategory={handleDeleteCategory}
                                    handleAddCategory={handleAddCategory}
                                /> :
                                <Typography>
                                    Loading ...
                                </Typography>
                        }
                    </Grid>
                    <Grid item xs={6}>
                        {
                            data[1].transactionData.length !== 0 ?
                                <Transactions
                                    selectedMonth={data[2].selectedDate}
                                    data={data[1].transactionData}
                                    categories={categories}
                                    userToken={user.sub}
                                    handleUpdateCategory={handleUpdateCategory}
                                    handleDropdownChange={handleDropdownChange}
                                    hideRow={hideRow}
                                /> :
                                <Typography>
                                    Loading ...
                                </Typography>
                        }
                    </Grid>
                </Grid>
            </MuiPickersUtilsProvider>
        </MuiThemeProvider>
    )
};

const theme = createMuiTheme({
    palette: {
        primary: {main: '#2E7C31'}, // Provided by UX, meets contrast standards
        background: {default: '#f2f7fa'},
        action: {
            coveragesHover: 'rgba(46, 124, 49, .4)' // Main color at 40% opacity
        },
        common: {black: '#333333'},
    },
    typography: {
        //Utilize any necessary v2 variants until next version is released.
        useNextVariants: true,
        fontFamily: 'Open Sans, sans-serif',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 600,
        h1: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontWeight: '500',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '2.0rem',
            padding: '25px',
        },
        h2: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontWeight: '400',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1.5rem',
            padding: '25px',
        },
        h3: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1.25rem',
            padding: '25px',
        },
        h4: {
            color: 'rgba(0, 0, 0, 0.87)',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '1.0rem',
            padding: '25px',
        },
        h5: {
            color: 'rgba(0, 0, 0, 0.87)',
            paddingBottom: '25px',
            paddingTop: '25px',
            fontFamily: 'Montserrat, sans-serif',
            fontSize: '0.75rem',
        },
        subtitle1: {
            fontSize: '1rem',
            fontFamily: 'Open Sans, sans-serif',
            fontWeight: '400',
            lineHeight: '1.5',
        }
    }
});
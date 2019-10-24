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

export default function App(props) {

    //user has a sub which is a unique identifier
    const {isAuthenticated, loginWithRedirect, logout, user} = useAuth0();

    const [plaidModalOpen, SetPlaidModalOpen, getTokenSilently] = useState(false);
    const [allowCreateUserCheck, SetAllowCreateUserCheck] = useState(true);
    const [allowTransactionLookup, SetAllowTransactionLookup] = useState(true);
    const [allowBudgetLookup, SetAllowBudgetLookup] = useState(true);
    const [allowCategoryLookup, SetAllowCategoryLookup] = useState(true);
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
        getBudgetData();
        getCategories();
        getTransactionData();
        createUserIfNecessary();
    });

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
        axios.patch('/transactions/patch', {updateData: row, userToken: user.sub, transactionId: transactionId});
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
        axios.patch('/transactions/patch', {updateData: updatedRowData, userToken: user.sub});
    };

    const createUserIfNecessary = () => {
        if (allowCreateUserCheck && user) {
            axios.post('/users/create', {userToken: user.sub});
            let d = [...data];
            SetAllowCreateUserCheck(false);
            SetData(d)
        }
    };

    const getTransactionData = () => {
        if (allowTransactionLookup && user) {
            axios.get('/transactions', {params: {userToken: user.sub, date: data[2].selectedDate}}).then(t => {
                let d = [...data];
                d[1].transactionData = t.data.transactions;
                d[2].selectedDate = t.data.date;
                SetAllowTransactionLookup(false);
                SetData(d);
            }).catch(e => {
                console.log('failed to get transactions')
            })
        }
    };

    const getBudgetData = () => {
        if (allowBudgetLookup && user) {
            axios.get('/budgets', {params: {userToken: user.sub, date: data[2].selectedDate}}).then(b => {
                let d = [...data];
                d[0].budgetData = b.data;
                SetAllowBudgetLookup(false);
                SetData(d);
            }).catch(e => {
                console.log('failed to get Budget Items')
            })
        }
    };

    const getCategories = () => {
        if (allowCategoryLookup && user) {
            axios.get('/categories', {params: {userToken: user.sub}}).then(category => {
                let categories = category.data.map(c => c.category);
                SetCategories(categories);
                SetAllowCategoryLookup(false);
            }).catch(e => {
                console.log("Failed to get categories")
            })
        }
    };

    const handleDateChange = date => {
        let year = date.getYear() + 1900;
        let month = date.getMonth() + 1;
        let d = [...data];
        d[2].selectedDate = `${year}-${month}-${1}`;
        SetData(d);
        SetAllowTransactionLookup(true);
        SetAllowBudgetLookup(true);
    };

    const handleUpdateCategory = (transaction, previousCategory) => {
        let d = {...data};

        // Add to new category
        let incomeIndex = d[0].budgetData.incomeData.findIndex(i => i.category === transaction.assignCategory);
        let expensesIndex = d[0].budgetData.expensesData.findIndex(e => e.category === transaction.assignCategory);
        let savingsIndex = d[0].budgetData.savingsData.findIndex(s => s.category === transaction.assignCategory);
        let actual;
        if (incomeIndex !== -1) {
            actual = d[0].budgetData.incomeData[incomeIndex].actual;
            d[0].budgetData.incomeData[incomeIndex].actual = (parseInt(actual) + parseInt(transaction.charge)).toString();
        }
        else if (expensesIndex !== -1) {
            actual = d[0].budgetData.expensesData[expensesIndex].actual;
            d[0].budgetData.expensesData[expensesIndex].actual = (parseInt(actual) + parseInt(transaction.charge)).toString();
        }
        else if (savingsIndex !== -1) {
            actual = d[0].budgetData.savingsData[savingsIndex].actual;
            d[0].budgetData.savingsData[savingsIndex].actual = (parseInt(actual) + parseInt(transaction.charge)).toString();
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
                        <DatePicker
                            views={["year", "month"]}
                            label="Budget Date"
                            helperText="Choose Month/Year"
                            minDate={new Date("2000-01-01")}
                            value={data[2].selectedDate}
                            onChange={handleDateChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {
                            data[0].budgetData.incomeData.length !== 0 ?
                                <Budget
                                    selectedMonth={data[2].selectedDate}
                                    data={data[0].budgetData}
                                    userToken={user.sub}
                                    SetAllowCategoryLookup={SetAllowCategoryLookup}
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
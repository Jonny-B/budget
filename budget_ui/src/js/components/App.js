import React, {useState, useEffect} from 'react';
import {Grid, Typography, Select, MenuItem, Button, Dialog, DialogTitle} from '@material-ui/core';
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import ShowChart from '@material-ui/icons/ShowChart';
import Budget from './Budget'
import Transactions from './Transactions'
import DateFnsUtils from "@date-io/date-fns";
import PlaidLink from 'react-plaid-link'
import NavBar from "./NavBar";
import {useAuth0} from "../../react-auth0-wrapper";
import axios from 'axios'

export default function App(props) {

    //user has a sub which is a unique identifier
    const {isAuthenticated, loginWithRedirect, logout, user,} = useAuth0();

    const [selectedDate, setSelectedDate] = useState("2015-01-02");
    const [plaidModalOpen, setPlaidModalOpen, getTokenSilently] = useState(false);
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
            allowCreateUserCheck: true,
            allowTransactionLookup: true,
            allowBudgetLookup: true
        },
    ]);

    useEffect(() => {
        getBudgetData();
        getTransactionData();
        createUserIfNecessary();
    });

    const createUserIfNecessary = () => {
        if (data[2].allowCreateUserCheck && user) {
            axios.post('/users/create', {userToken: user.sub});
            let d = [...data];
            d[2].allowCreateUserCheck = false;
            SetData(d)
        }
    };

    const getTransactionData = () => {
        if (data[2].allowTransactionLookup && user && data[1].transactionData.length === 0) {
            axios.get('/transactions', {params: {userToken: user.sub, date: selectedDate}}).then(t => {
                let d = [...data];
                d[1].transactionData = t.data;
                d[2].allowTransactionLookup = false;
                SetData(d);
            }).catch(e => {
                console.log('failed to get transactions')
            })
        }
    };

    const getBudgetData = () => {
        if (data[2].allowBudgetLookup && user) {
            axios.get('/budgets', {params: {userToken: user.sub, date: selectedDate}}).then(b => {
                let d = [...data];
                d[0].budgetData = b.data;
                d[3].allowBudgetLookup = false;
                SetData(d);
            }).catch(e => {
                console.log('failed to get Budget Items')
            })
        }
    };

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const updateCateogry = () => {

    };

    const handleUpdateCategory = (type, id, charge) => {
        // Keep in mind that in the DB these links are handled by foreign key relationships and will resync after refresh.
        // I do this here to improve performance by removing the need to wait for DB updates to complete.
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
                            value={selectedDate}
                            onChange={handleDateChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        {data[0].budgetData.incomeData.length !== 0 ? <Budget selectedMonth={selectedDate} data={data[0].budgetData}/> : <Typography>Loading ...</Typography>}
                    </Grid>
                    <Grid item xs={6}>
                        {data[1].transactionData.length !== 0 ? <Transactions selectedMonth={selectedDate} data={data[1].transactionData} handleUpdateCategory={handleUpdateCategory}/> : <Typography>Loading ...</Typography>}
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
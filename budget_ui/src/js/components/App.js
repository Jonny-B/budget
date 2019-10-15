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
                    incomeData: [
                        {category: 'Category1', budget: 0.00, actual: 0.00, type: 'income', id: 0},
                        {category: 'Category2', budget: 0.00, actual: 0.00, type: 'income', id: 1},
                        {category: 'Category3', budget: 0.00, actual: 0.00, type: 'income', id: 2},
                    ],
                    expensesData: [
                        {category: 'Category4', budget: 0.00, actual: 0.00, type: 'expenses', id: 0},
                        {category: 'Category5', budget: 0.00, actual: 0.00, type: 'expenses', id: 1},
                        {category: 'Category6', budget: 0.00, actual: 0.00, type: 'expenses', id: 2},
                        {category: 'Category7', budget: 0.00, actual: 0.00, type: 'expenses', id: 3},
                        {category: 'Category8', budget: 0.00, actual: 0.00, type: 'expenses', id: 4},
                        {category: 'Category9', budget: 0.00, actual: 0.00, type: 'expenses', id: 5},
                    ],
                    savingsData: [
                        {category: 'Category10', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 0},
                        {category: 'Category11', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 1},
                        {category: 'Category12', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 2},
                        {category: 'Category13', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 3},
                        {category: 'Category14', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 4},

                    ]
                }

        },
        {
            transactionData: []
        }
    ]);

    useEffect(() => {
        createUserIfNecessary();
        getTransactionData();
        // getBudgetData();
    });

    const createUserIfNecessary = () => {
        if (user) axios.post('/users/create', {id: user.sub})
    };

    const getTransactionData = (userId, userAccessToken) => {
        if (user) {
            axios.get('/transactions', {id: user.sub}).then(t => {
                let d = [...data];
                d[1].transactionData = t.data;
                SetData(d);
            }).catch(e => {
                console.log('failed to get transactions')
            })
        }
    };

    const getBudgetData = (userId, userAccessToken) => {
        axios.get('/budgets', {id: userId, access_token: userAccessToken})
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
                    <Grid item xs={6}> <Budget selectedMonth={selectedDate} data={data[0].budgetData}/> </Grid>
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
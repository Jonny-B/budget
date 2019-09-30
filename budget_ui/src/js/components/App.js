import React from 'react';
import {Grid, Typography, Select, MenuItem, Button} from '@material-ui/core';
import {DatePicker, MuiPickersUtilsProvider} from "@material-ui/pickers";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';
import ShowChart from '@material-ui/icons/ShowChart';
import Budget from './Budget'
import Transactions from './Transactions'
import DateFnsUtils from "@date-io/date-fns";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {selectedDate: "2015-01-02"};

        this.handleDateChange = this.handleDateChange.bind(this)
    }

    handleDateChange = date => {
        this.setState({selectedDate: date})
    };


    render() {
        return (
            <MuiThemeProvider theme={theme}>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container spacing={3} className="App">
                        <Grid item xs={6}> <Typography> PRACTICE CRUD APP and HOOKS </Typography> </Grid>
                        <Grid item xs={6}> <Button><ShowChart/></Button> </Grid>
                        <Grid item xs={12}>
                            <DatePicker
                                views={["year", "month"]}
                                label="Budget Date"
                                helperText="Choose Month/Year"
                                minDate={new Date("2000-01-01")}
                                value={this.state.selectedDate}
                                onChange={this.handleDateChange}
                            />
                        </Grid>
                        <Grid item xs={6}> <Budget/> </Grid>
                        <Grid item xs={6}> <Transactions/> </Grid>
                    </Grid>
                </MuiPickersUtilsProvider>
            </MuiThemeProvider>
        )
    }
}

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

export default App;

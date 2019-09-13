import React from 'react';
import {Grid, Typography, Select, MenuItem, Button} from '@material-ui/core';
import ShowChart from '@material-ui/icons/ShowChart';
import Budget from './Budget'
import Transactions from './Transactions'

class App extends React.Component {

    render() {
        return (
            <Grid container spacing={3} className="App">
                <Grid item xs={6}> <Typography> Budget </Typography> </Grid>
                <Grid item xs={6}> <Button><ShowChart/></Button> </Grid>
                <Grid item xs={12}>
                    <Select value={'January'}>
                        <MenuItem value={'January'}>January</MenuItem>
                        <MenuItem value={'February'}>February</MenuItem>
                        <MenuItem value={'March'}>March</MenuItem>
                        <MenuItem value={'April'}>April</MenuItem>
                    </Select>
                    <Select value={'2019'}>
                        <MenuItem value={'2015'}>2015</MenuItem>
                        <MenuItem value={'2016'}>2016</MenuItem>
                        <MenuItem value={'2017'}>2017</MenuItem>
                        <MenuItem value={'2018'}>2018</MenuItem>
                        <MenuItem value={'2019'}>2019</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={6}> <Budget/> </Grid>
                <Grid item xs={6}> <Transactions/> </Grid>
            </Grid>
        )
    }
}

export default App;

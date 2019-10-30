import React, {Component} from 'react'
import MaterialTable from 'material-table'
import {Grid, Dialog, DialogTitle, Typography} from '@material-ui/core'
import {Add, Create} from "@material-ui/icons";
import {withStyles} from '@material-ui/core/styles';
import EditCard from "./EditCard";
import axios from "axios";

class Budget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            incomeData: [],
            expensesData: [],
            savingsData: [],
            incomeTotal: 0,
            expensesTotal: 0,
            savingsTotal: 0,
            transferToSavings: 0
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.setTotals = this.setTotals.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    componentDidMount() {
        this.setTotals()
    }

    setTotals() {
        let iTotal = 0;
        let eTotal = 0;
        let sTotal = 0;

        if (this.props.data.incomeData.length > 0) iTotal = this.props.data.incomeData.map(i => parseInt(i.actual)).reduce((total, num) => total + num, 0);
        if (this.props.data.expensesData.length > 0) eTotal = this.props.data.expensesData.map(e => parseInt(e.actual)).reduce((total, num) => total + num, 0);
        if (this.props.data.savingsData.length > 0) sTotal = this.props.data.savingsData.map(s => parseInt(s.actual)).reduce((total, num) => total + num, 0);

        let transferToSavings = 0;
        if (this.props.data.savingsData.length > 0) {
            let budgetedSavings = this.props.data.savingsData.map(s => parseInt(s.budget)).reduce((total, num) => total + num, 0);
            transferToSavings = (iTotal + budgetedSavings) - (sTotal + eTotal);
        }


        return {incomeTotal: iTotal, expensesTotal: eTotal, savingsTotal: sTotal, transferToSavings: transferToSavings}
    };

    handleEdit = (type, rowData, event) => this.setState({open: true, editRowData: rowData});

    handleAdd = (category, type) => {
        axios.post('/budgets/create', {
            budgeted: category.budget,
            type: type,
            userToken: this.props.userToken,
            category: category.category,
            date: this.props.date
        }).then(c => {
            this.props.handleAddCategory(category.category, category.budget, type, c.data.id);
        });
    };

    handleUpdate = (updatedRowData) => {
        this.setState({open: false, editRowData: null});
        this.props.handleUpdate(updatedRowData);
    };

    handleClose() {
        this.setState({open: false, editRowData: null})
    };

    render() {
        return (
            <div>
                <Grid container spacing={3} direction={'column'}>
                    <Grid item>
                        <MaterialTable
                            title={"Income"}
                            options={{search: false, paging: false}}
                            columns={[
                                {title: 'Category', field: 'category'},
                                {
                                    title: 'Budget',
                                    field: 'budget',
                                    type: 'currency',
                                    editComponent: props => (<input type="numeric" value={props.value}
                                                                    onChange={e => props.onChange(e.target.value)}/>)
                                },
                                {
                                    title: 'Actual',
                                    field: 'actual',
                                    type: 'currency',
                                    editComponent: props => (<></>)
                                }
                            ]}
                            actions={[
                                {
                                    icon: () => {
                                        return <Create/>
                                    },
                                    tooltip: 'Edit Transaction',
                                    onClick: (event, rowData) => {
                                        this.handleEdit("income", rowData, event)
                                    }
                                }
                            ]}
                            editable={{
                                onRowAdd: newData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                const data = this.props.data.incomeData;
                                                this.handleAdd(newData, "income");
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve()
                                        }, 1000)
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                let data = this.props.data.incomeData;
                                                const index = data.indexOf(oldData);
                                                data.splice(index, 1);
                                                this.props.handleDeleteCategory(oldData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve();
                                        }, 1000);
                                    })
                            }}
                            data={this.props.data.incomeData}/>
                    </Grid>
                    <Grid item>
                        <Typography>Income Total: ${this.setTotals().incomeTotal}</Typography>
                    </Grid>
                    <Grid item>
                        <MaterialTable
                            title={"Expenses"}
                            options={{search: false, paging: false}}
                            columns={[
                                {title: 'Category', field: 'category'},
                                {
                                    title: 'Budget',
                                    field: 'budget',
                                    type: 'currency',
                                    editComponent: props => (<input type="numeric" value={props.value}
                                                                    onChange={e => props.onChange(e.target.value)}/>)
                                },
                                {
                                    title: 'Actual',
                                    field: 'actual',
                                    type: 'currency',
                                    editComponent: () => (<></>)
                                }
                            ]}
                            actions={[
                                {
                                    icon: () => {
                                        return <Create/>
                                    },
                                    tooltip: 'Edit Transaction',
                                    onClick: (event, rowData) => {
                                        this.handleEdit("expenses", rowData, event)
                                    }
                                }
                            ]}
                            editable={{
                                onRowAdd: newData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                const data = this.props.data.expensesData;
                                                this.handleAdd(newData, "expense");
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve()
                                        }, 1000)
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                let data = this.props.data.expensesData;
                                                const index = data.indexOf(oldData);
                                                data.splice(index, 1);
                                                this.props.handleDeleteCategory(oldData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve();
                                        }, 1000);
                                    })
                            }}
                            data={this.props.data.expensesData}/>
                    </Grid>
                    <Grid item>
                        <Typography>Expenses Total: ${this.setTotals().expensesTotal}</Typography>
                    </Grid>
                    <Grid item>
                        <MaterialTable
                            title={"Savings"}
                            options={{search: false, paging: false}}
                            columns={[
                                {title: 'Category', field: 'category'},
                                {
                                    title: 'Budget',
                                    field: 'budget',
                                    type: 'currency',
                                    editComponent: props => (<input type="numeric" value={props.value}
                                                                    onChange={e => props.onChange(e.target.value)}/>)
                                },
                                {
                                    title: 'Actual',
                                    field: 'actual',
                                    type: 'currency',
                                    editComponent: () => (<></>)
                                },
                                {
                                    title: 'Total in Savings Bucket',
                                    field: 'bucketTotal',
                                    type: 'currency',
                                    editComponent: () => (<></>)
                                }
                            ]}
                            actions={[
                                {
                                    icon: () => {
                                        return <Create/>
                                    },
                                    tooltip: 'Edit Transaction',
                                    onClick: (event, rowData) => {
                                        this.handleEdit('saving', rowData, event)
                                    }
                                }
                            ]}
                            editable={{
                                onRowAdd: newData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                const data = this.props.data.savingsData;
                                                this.handleAdd(newData, "saving");
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve()
                                        }, 1000)
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                let data = this.props.data.savingsData;
                                                const index = data.indexOf(oldData);
                                                data.splice(index, 1);
                                                this.props.handleDeleteCategory(oldData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve();
                                        }, 1000);
                                    })
                            }}
                            data={this.props.data.savingsData}/>
                    </Grid>
                    <Grid item>
                        <Typography>Savings Total: ${this.setTotals().savingsTotal}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>Transfer to Saving: ${this.setTotals().transferToSavings}</Typography>
                    </Grid>
                </Grid>
                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.open}>
                    <DialogTitle id="simple-dialog-title">Budget Item</DialogTitle>
                    <EditCard data={this.state.editRowData} callback={this.handleUpdate}/>
                </Dialog>
            </div>
        )
    }
}

const styles = theme => ({});

export default withStyles(styles)(Budget)

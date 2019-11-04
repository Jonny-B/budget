import React, {useState, useEffect} from 'react';
import MaterialTable from 'material-table'
import {Grid, Dialog, DialogTitle, Typography} from '@material-ui/core'
import {Create} from "@material-ui/icons";
import {createMuiTheme, withStyles} from '@material-ui/core/styles';
import EditCard from "./EditCard";
import axios from "axios";
import * as BudgetHelper from "../helpers/BudgetHelper"

export default function Budget(props) {

    const [open, SetOpen] = useState(false);
    const [rowData, SetRowData] = useState(false);

    const setTotals = () => {
        let iTotal = 0;
        let eTotal = 0;
        let sTotal = 0;

        if (props.data.incomeData.length > 0) iTotal = props.data.incomeData.map(i => parseInt(i.actual)).reduce((total, num) => total + num, 0);
        if (props.data.expensesData.length > 0) eTotal = props.data.expensesData.map(e => parseInt(e.actual)).reduce((total, num) => total + num, 0);
        if (props.data.savingsData.length > 0) sTotal = props.data.savingsData.map(s => parseInt(s.actual)).reduce((total, num) => total + num, 0);

        let transferToSavings = 0;
        if (props.data.savingsData.length > 0) {
            let budgetedSavings = props.data.savingsData.map(s => parseInt(s.budget)).reduce((total, num) => total + num, 0);
            transferToSavings = (iTotal + budgetedSavings) - (sTotal + eTotal);
        }


        return {incomeTotal: iTotal, expensesTotal: eTotal, savingsTotal: sTotal, transferToSavings: transferToSavings}
    };

    const handleEdit = (type, rowData, event) => {
        SetOpen(true);
        SetRowData(rowData)
    };

    const handleAdd = (category, type) => {
        if (category.budget === null || category.budget === undefined || category.budget === 'NaN') category.budget = 0;
        axios.post('/budgets/create', {
            budgeted: category.budget,
            type: type,
            userToken: props.userToken,
            category: category.category,
            date: props.date
        }).then(c => {
            props.handleAddCategory(category.category, category.budget, type, c.data.id);
        });
    };

    const handleUpdate = (updatedRowData) => {
        SetOpen(false);
        props.handleUpdate(updatedRowData);
    };

    const handleClose = () => {
        SetOpen(false)
    };

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
                                    handleEdit("income", rowData, event)
                                }
                            }
                        ]}
                        editable={{
                            onRowAdd: newData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        {
                                            const data = props.data.incomeData;
                                            handleAdd(newData, "income");
                                            // setState({data}, () => resolve());
                                        }
                                        resolve()
                                    }, 1000)
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        {
                                            let data = props.data.incomeData;
                                            const index = data.indexOf(oldData);
                                            data.splice(index, 1);
                                            props.handleDeleteCategory(oldData);
                                            // setState({data}, () => resolve());
                                        }
                                        resolve();
                                    }, 1000);
                                })
                        }}
                        data={props.data.incomeData}/>
                </Grid>
                <Grid item>
                    <Typography>Income Total: ${setTotals().incomeTotal}</Typography>
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
                                    handleEdit("expenses", rowData, event)
                                }
                            }
                        ]}
                        editable={{
                            onRowAdd: newData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        {
                                            const data = props.data.expensesData;
                                            handleAdd(newData, "expense");
                                            // setState({data}, () => resolve());
                                        }
                                        resolve()
                                    }, 1000)
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        {
                                            let data = props.data.expensesData;
                                            const index = data.indexOf(oldData);
                                            data.splice(index, 1);
                                            props.handleDeleteCategory(oldData);
                                            // setState({data}, () => resolve());
                                        }
                                        resolve();
                                    }, 1000);
                                })
                        }}
                        data={props.data.expensesData}/>
                </Grid>
                <Grid item>
                    <Typography>Expenses Total: ${setTotals().expensesTotal}</Typography>
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
                                    handleEdit('saving', rowData, event)
                                }
                            }
                        ]}
                        editable={{
                            onRowAdd: newData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        {
                                            const data = props.data.savingsData;
                                            handleAdd(newData, "saving");
                                            // setState({data}, () => resolve());
                                        }
                                        resolve()
                                    }, 1000)
                                }),
                            onRowDelete: oldData =>
                                new Promise((resolve) => {
                                    setTimeout(() => {
                                        {
                                            let data = props.data.savingsData;
                                            const index = data.indexOf(oldData);
                                            data.splice(index, 1);
                                            props.handleDeleteCategory(oldData);
                                            // setState({data}, () => resolve());
                                        }
                                        resolve();
                                    }, 1000);
                                })
                        }}
                        data={props.data.savingsData}/>
                </Grid>
                <Grid item>
                    <Typography>Savings Total: ${setTotals().savingsTotal}</Typography>
                </Grid>
                <Grid item>
                    <Typography>Transfer to Saving: ${setTotals().transferToSavings}</Typography>
                </Grid>
            </Grid>
            <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
                <DialogTitle id="simple-dialog-title">Budget Item</DialogTitle>
                <EditCard data={rowData} callback={handleUpdate}/>
            </Dialog>
        </div>
    )
}

const theme = createMuiTheme ({});
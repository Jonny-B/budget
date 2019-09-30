import React, {Component} from 'react'
import MaterialTable from 'material-table'
import {Grid, Dialog, DialogTitle, Typography} from '@material-ui/core'
import {Add, Create} from "@material-ui/icons";
import {withStyles} from '@material-ui/core/styles';
import EditCard from "./EditCard";

class Budget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            editRowData: null,
            incomeData: [
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'income', id: 0},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'income', id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'income', id: 2},
            ],
            expensesData: [
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'expenses', id: 0},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'expenses', id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'expenses', id: 2},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'expenses', id: 3},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'expenses', id: 4},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'expenses', id: 5},
            ],
            savingsData: [
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 0},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 2},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 3},
                {category: 'Category1', budget: 0.00, actual: 0.00, type: 'savings', bucketTotal: 0.00, id: 4},

            ]
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleEdit = (type, rowData, event) => {
        this.setState({open: true, editRowData: rowData})
    };

    handleAdd = (type, rowData, event) => {
        this.setState({open: true, editRowData: {add: true, type: type}})
    };

    handleUpdate = (updatedRowData) => {
        let data = [...this.state[`${updatedRowData.type}Data`]];
        data.forEach((row) => {
            if (row.id === updatedRowData.id) {
                row.category = updatedRowData.category;
            }
        });
        this.setState({open: false, editRowData: null});
        this.setState({data: data});
        this.updateDatabase(data);
    };

    updateDatabase(data) {
        // Update assigned budget item in DB here and setState for updated data item.
    }

    handleClose() {
        this.setState({open: false, editRowData: null})
    };

    componentWillMount() {
        //Get Data for selected month using this.props.selectedMonth
    }

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
                                                const data = this.state.incomeData;
                                                data.push(newData);
                                                this.updateDatabase(newData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve()
                                        }, 1000)
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                let data = this.state.incomeData;
                                                const index = data.indexOf(oldData);
                                                data.splice(index, 1);
                                                this.updateDatabase(oldData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve();
                                        }, 1000);
                                    })
                            }}
                            data={this.state.incomeData}/>
                    </Grid>
                    <Grid item>
                        <Typography>Income Total: $1000</Typography>
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
                                    editComponent: props => (<input type="numeric" value={props.value}
                                                                    onChange={e => props.onChange(e.target.value)}/>)
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
                                                const data = this.state.expensesData;
                                                data.push(newData);
                                                this.updateDatabase(newData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve()
                                        }, 1000)
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                let data = this.state.expensesData;
                                                const index = data.indexOf(oldData);
                                                data.splice(index, 1);
                                                this.updateDatabase(oldData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve();
                                        }, 1000);
                                    })
                            }}
                            data={this.state.expensesData}/>
                    </Grid>
                    <Grid item>
                        <Typography>Expenses Total: $1000</Typography>
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
                                    editComponent: props => (<input type="numeric" value={props.value}
                                                                    onChange={e => props.onChange(e.target.value)}/>)
                                },
                                {
                                    title: 'Bucket Total',
                                    field: 'bucketTotal',
                                    type: 'currency',
                                    editComponent: props => (<input type="numeric" value={props.value}
                                                                    onChange={e => props.onChange(e.target.value)}/>)
                                }
                            ]}
                            actions={[
                                {
                                    icon: () => {
                                        return <Create/>
                                    },
                                    tooltip: 'Edit Transaction',
                                    onClick: (event, rowData) => {
                                        this.handleEdit('savings', rowData, event)
                                    }
                                }
                            ]}
                            editable={{
                                onRowAdd: newData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                const data = this.state.savingsData;
                                                data.push(newData);
                                                this.updateDatabase(newData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve()
                                        }, 1000)
                                    }),
                                onRowDelete: oldData =>
                                    new Promise((resolve) => {
                                        setTimeout(() => {
                                            {
                                                let data = this.state.savingsData;
                                                const index = data.indexOf(oldData);
                                                data.splice(index, 1);
                                                this.updateDatabase(oldData);
                                                this.setState({data}, () => resolve());
                                            }
                                            resolve();
                                        }, 1000);
                                    })
                            }}
                            data={this.state.savingsData}/>
                    </Grid>
                    <Grid item>
                        <Typography>Savings Total: $1000</Typography>
                    </Grid>
                    <Grid item>
                        <Typography>Transfer to Savings: $1000</Typography>
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

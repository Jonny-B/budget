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
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
            ],
            expensesData: [
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, id: 1},

            ],
            savingsData: [
                {category: 'Category1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
                {category: 'Category1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
            ]
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleEdit = (type, rowData, event) => {
        this.setState({open: true, editRowData: rowData})
    };

    handleAdd = (type, rowData, event) => {
        this.setState({open: true, editRowData: {add: true, type: type}})
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
                                {title: 'Budget', field: 'budget', type: 'currency'},
                                {title: 'Actual', field: 'actual', type: 'currency'}
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
                                },
                                {
                                    icon: () => {
                                        return <Add/>
                                    },
                                    tooltip: 'Add Transaction',
                                    isFreeAction: true,
                                    onClick: (event, rowData) => {
                                        this.handleAdd("income")
                                    }
                                }
                            ]}
                            data={this.state.incomeData}/>
                    </Grid>
                    <Grid item>
                        <MaterialTable
                            title={"Expenses"}
                            options={{search: false, paging: false}}
                            columns={[
                                {title: 'Category', field: 'category'},
                                {title: 'Budget', field: 'budget', type: 'currency'},
                                {title: 'Actual', field: 'actual', type: 'currency'}
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
                                },
                                {
                                    icon: () => {
                                        return <Add/>
                                    },
                                    tooltip: 'Add Transaction',
                                    isFreeAction: true,
                                    onClick: (event, rowData) => {
                                        this.handleAdd("expenses")
                                    }
                                }
                            ]}
                            data={this.state.expensesData}/>
                    </Grid>
                    <Grid item>
                        <MaterialTable
                            title={"Savings"}
                            options={{search: false, paging: false}}
                            columns={[
                                {title: 'Category', field: 'category'},
                                {title: 'Budget', field: 'budget', type: 'currency'},
                                {title: 'Actual', field: 'actual', type: 'currency'},
                                {title: 'Bucket Total', field: 'bucketTotal', type: 'currency'}
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
                                },
                                {
                                    icon: () => {
                                        return <Add/>
                                    },
                                    tooltip: 'Add Transaction',
                                    isFreeAction: true,
                                    onClick: (event, rowData) => {
                                        this.handleAdd("savings")
                                    }
                                }
                            ]}
                            data={this.state.savingsData}/>
                    </Grid>
                </Grid>
                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.open}>
                    <DialogTitle id="simple-dialog-title">Budget Item</DialogTitle>
                    <EditCard data={this.state.editRowData}/>
                </Dialog>
            </div>
        )
    }
}

const styles = theme => ({

});

export default withStyles(styles)(Budget)

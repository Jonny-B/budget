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
            incomeData: [
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
            ],
            expensesData: [
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, id: 1},
            ],
            savingsData: [
                {category: 'TEST1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
                {category: 'TEST1', budget: 0.00, actual: 0.00, bucketTotal: 0.00, id: 1},
            ]
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleEdit = (type, rowData, event) => {
        this.setState({open: true})
    };

    handleAdd = (type, rowData, event) => {
        this.setState({open: true})
    };

    handleClose() {
        this.setState({open: false})
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
                                        this.handleAdd("addIncome")
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
                                        this.handleAdd("addExpenses")
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
                                        this.handleAdd("addSavings")
                                    }
                                }
                            ]}
                            data={this.state.savingsData}/>
                    </Grid>
                </Grid>
                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.open}>
                    <DialogTitle id="simple-dialog-title">Budget Item</DialogTitle>
                    <EditCard/>
                </Dialog>
            </div>
        )
    }
}

const styles = theme => ({

});

export default withStyles(styles)(Budget)

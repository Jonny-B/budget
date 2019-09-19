import React, {Component} from 'react'
import MaterialTable from 'material-table'
import {Grid, Modal, Card, Typography} from '@material-ui/core'
import {Add, Create} from "@material-ui/icons";

class Budget extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen() {
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
                                        this.handleOpen("income")
                                    }
                                },
                                {
                                    icon: () => {
                                        return <Add/>
                                    },
                                    tooltip: 'Add Transaction',
                                    isFreeAction: true,
                                    onClick: (event, rowData) => {
                                        this.handleOpen("addIncome")
                                    }
                                }
                            ]}
                            data={[
                                {category: 'TEST1', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                            ]}/>
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
                                        this.handleOpen("expenses")
                                    }
                                },
                                {
                                    icon: () => {
                                        return <Add/>
                                    },
                                    tooltip: 'Add Transaction',
                                    isFreeAction: true,
                                    onClick: (event, rowData) => {
                                        this.handleOpen("addExpenses")
                                    }
                                }
                            ]}
                            data={[
                                {category: 'TEST1', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00},
                            ]}/>
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
                                        this.handleOpen('savings')
                                    }
                                },
                                {
                                    icon: () => {
                                        return <Add/>
                                    },
                                    tooltip: 'Add Transaction',
                                    isFreeAction: true,
                                    onClick: (event, rowData) => {
                                        this.handleOpen("addSavings")
                                    }
                                }
                            ]}
                            data={[
                                {category: 'TEST1', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                                {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            ]}/>
                    </Grid>
                </Grid>

                <Modal
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <Card>
                        <Typography>Editing</Typography>
                    </Card>
                </Modal>
            </div>
        )
    }
}


export default Budget

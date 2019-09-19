import React, {Component} from 'react'
import {Select, MenuItem, Modal, Card, Typography} from '@material-ui/core'
import {Create, Add} from '@material-ui/icons'
import MaterialTable from "material-table";

class Transactions extends Component {
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
                <MaterialTable
                    title={"Transactions"}
                    options={{search: false, paging: false, actionsColumnIndex: -1}}
                    columns={[
                        {
                            title: 'Category', field: 'category', render: rowData =>
                                <Select value={'TEST1'}>
                                    <MenuItem value={'TEST1'}>TEST1</MenuItem>
                                    <MenuItem value={'TEST2'}>TEST2</MenuItem>
                                </Select>

                        },
                        {title: 'Date', field: 'date'},
                        {title: 'Description', field: 'description'},
                        {title: 'Charge', field: 'charge', type: 'currency'},
                        {title: 'Charge', field: 'charge', type: 'currency'},
                    ]}
                    actions={[
                        {
                            icon: () => {
                                return <Create/>
                            },
                            tooltip: 'Edit Transaction',
                            onClick: (event, rowData) => {
                                this.handleOpen('transaction')
                            }
                        },
                        {
                            icon: () => {
                                return <Add/>
                            },
                            tooltip: 'Add Transaction',
                            isFreeAction: true,
                            onClick: (event, rowData) => {
                                this.handleOpen('addTransaction')
                            }
                        }
                    ]}
                    data={[
                        {
                            date: '01/01/19',
                            description: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
                            budget: 0.00,
                            actual: 0.00
                        },
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                        {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    ]}/>

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

export default Transactions

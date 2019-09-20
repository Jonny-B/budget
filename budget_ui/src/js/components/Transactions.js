import React, {Component} from 'react'
import {Select, Dialog, DialogTitle, Typography, MenuItem} from '@material-ui/core'
import {Create, Add} from '@material-ui/icons'
import MaterialTable from "material-table";
import {withStyles} from '@material-ui/core/styles';
import EditCard from "./EditCard";

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            editRowData: null,
            data: [
                {
                    date: '01/01/19',
                    description: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum',
                    charge: 0.00,
                    hidden: false,
                    id: 1
                },
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},
                {date: '02/01/19', description: 'Lorem Ipsum', charge: 0, hidden: false, id: 1},

            ]
        };
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }

    handleOpen = (type, rowData, event) => {
        this.setState({open: true, editRowData: rowData})
    };

    handleClose() {
        this.setState({open: false, editRowData: null})
    };

    render() {
        return (
            <div>
                <MaterialTable
                    title={"Transactions"}
                    options={{search: false, paging: false, actionsColumnIndex: -1}}
                    columns={[
                        {
                            title: 'Category', field: 'assignCategory', render: rowData =>
                                <Select value={'TEST1'}>
                                    <MenuItem value={'TEST1'}>TEST1</MenuItem>
                                    <MenuItem value={'TEST2'}>TEST2</MenuItem>
                                </Select>

                        },
                        {title: 'Date', field: 'date'},
                        {title: 'Description', field: 'description'},
                        {title: 'Charge', field: 'charge', type: 'currency'},
                    ]}
                    actions={[
                        {
                            icon: () => {
                                return <Create/>
                            },
                            tooltip: 'Edit Transaction',
                            onClick: (event, rowData) => {
                                this.handleOpen('addTransaction', rowData, event)
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
                    data={this.state.data}/>

                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.open}>
                    <DialogTitle id="simple-dialog-title">Transaction Item</DialogTitle>
                    <EditCard data={this.state.editRowData}/>
                </Dialog>
            </div>
        )
    }
}

const styles = theme => ({
});

export default withStyles(styles)(Transactions)

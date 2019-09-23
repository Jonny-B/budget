import React, {Component} from 'react'
import {Select, Dialog, DialogTitle, Typography, MenuItem} from '@material-ui/core'
import {Create, Add} from '@material-ui/icons'
import MaterialTable from "material-table";
import {withStyles} from '@material-ui/core/styles';
import EditCard from "./EditCard";
import CategoryDropdown from "./CategoryDropdown"

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            editRowData: null,
            categories: ['Category1', 'Category2', 'Category3'],
            data: [
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 0,
                    hidden: false,
                    id: 1
                },
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 0,
                    hidden: false,
                    id: 1
                },
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 0,
                    hidden: false,
                    id: 1
                },
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 0,
                    hidden: false,
                    id: 1
                },
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 0,
                    hidden: false,
                    id: 1
                },
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
        this.setState({open: true, editRowData: {add: true}})
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
                            title: 'Category',
                            field: 'assignCategory',
                            render: rowData => <CategoryDropdown categories={this.state.categories}/>
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
                                this.handleEdit('addTransaction', rowData, event)
                            }
                        },
                        {
                            icon: () => {
                                return <Add/>
                            },
                            tooltip: 'Add Transaction',
                            isFreeAction: true,
                            onClick: (event, rowData) => {
                                this.handleAdd('addTransaction')
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
const styles = theme => ({});

export default withStyles(styles)(Transactions)

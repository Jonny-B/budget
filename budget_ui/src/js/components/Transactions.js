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
                    id: 2
                },
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 0,
                    hidden: false,
                    id: 3
                },
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 0,
                    hidden: false,
                    id: 4
                },
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 0,
                    hidden: false,
                    id: 5
                },
            ]
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
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

    handleDropdownChange(id, event) {
        let data = this.state.data;
        data.forEach((row)=>{if (row.id === id) row.assignCategory = event.target.value});
        this.setState({data: data})

        // Update assigned budget item in DB here and setState for updated data item.
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
                            render: rowData => <CategoryDropdown id={rowData.id} assignedCategory={rowData.assignCategory} callback={this.handleDropdownChange}/>
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

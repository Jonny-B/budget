import React, {Component} from 'react'
import {Select, Dialog, DialogTitle, Typography, MenuItem} from '@material-ui/core'
import {Create, Add, Visibility, VisibilityOff} from '@material-ui/icons'
import MaterialTable from "material-table";
import {withStyles} from '@material-ui/core/styles';
import lightFormat from 'date-fns/lightFormat'
import EditCard from "./EditCard";
import CategoryDropdown from "./CategoryDropdown"

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAll: false,
            editRowData: null,
            data: [
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Kroger',
                    charge: 59.99,
                    hidden: true,
                    id: 1
                },
                {
                    assignCategory: 'Category2',
                    date: '01/01/19',
                    description: 'Nation Star',
                    charge: 1500.00,
                    hidden: false,
                    id: 2
                },
                {
                    assignCategory: 'Category1',
                    date: '01/01/19',
                    description: 'Kroger Gas',
                    charge: 32.00,
                    hidden: false,
                    id: 3
                },
                {
                    assignCategory: 'Category3',
                    date: '01/01/19',
                    description: 'Bath and Body Works',
                    charge: 1000000,
                    hidden: false,
                    id: 4
                },
                {
                    assignCategory: 'Select One',
                    date: '01/01/19',
                    description: 'Lorem Ipsum',
                    charge: 20.33,
                    hidden: false,
                    id: 5
                },
            ]
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleShowAll = this.handleShowAll.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.updateDatabase = this.updateDatabase.bind(this);
        this.removeHiddenRows = this.removeHiddenRows.bind(this);
        this.updateTransactionsVisibility = this.updateTransactionsVisibility.bind(this);
    }

    handleEdit = (type, rowData, event) => {
        this.setState({open: true, editRowData: rowData})
    };

    handleAdd = (type, rowData, event) => {
        this.setState({open: true, editRowData: {add: true}})
    };

    handleUpdate = (updatedRowData) => {
        let data = [...this.state.data];
        data.forEach((row)=> {
            if (row.id === updatedRowData.id){
                row.assignCategory = updatedRowData.assignCategory;
                row.date = lightFormat(new Date(updatedRowData.date), 'MM/dd/yyyy');
                row.description = updatedRowData.description;
                row.charge = updatedRowData.charge;
                row.hidden = updatedRowData.hidden;
            }
        });
        this.setState({open: false, editRowData: null});
        this.setState({data: data});
        this.updateDatabase(data);
    };

    handleShowAll() {
        this.setState({showAll: !this.state.showAll})
    };

    handleClose() {
        this.setState({open: false, editRowData: null})
    };

    handleDropdownChange(id, event) {
        let data = [...this.state.data];
        data.forEach((row)=>{if (row.id === id) row.assignCategory = event.target.value});
        this.setState({data: data});
        this.updateDatabase(data)
    };

    updateDatabase(data){
        // Update assigned budget item in DB here and setState for updated data item.
    }

    removeHiddenRows(data){
        // let d = data.map(row => {if (!row.hidden) return row});
        // this.setState({notHiddenData: d})
    };

    updateTransactionsVisibility(){
        this.setState({showAll: !this.state.showAll})
    }

    render() {
        let showAllIcon = this.state.showAll ? <Visibility onClick={this.updateTransactionsVisibility}/> : <VisibilityOff onClick={this.updateTransactionsVisibility}/>;
        let data = this.state.showAll ? this.state.data : this.state.data.filter(row => {if (!row.hidden) return row});
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
                        },
                        {
                            icon: () => {
                                return showAllIcon
                            },
                            tooltip: 'Show Hidden',
                            isFreeAction: true,
                            onClick: () => {
                                this.handleShowAll()
                            }
                        }
                    ]}
                    data={data}/>

                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" open={this.state.open}>
                    <DialogTitle id="simple-dialog-title">Transaction Item</DialogTitle>
                    <EditCard data={this.state.editRowData} callback={this.handleUpdate}/>
                </Dialog>
            </div>
        )
    }
}


const styles = theme => ({});

export default withStyles(styles)(Transactions)

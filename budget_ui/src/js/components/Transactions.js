import React, {Component} from 'react'
import {Select, Dialog, DialogTitle, Typography, MenuItem} from '@material-ui/core'
import {Create, Add, Visibility, VisibilityOff} from '@material-ui/icons'
import MaterialTable from "material-table";
import {withStyles} from '@material-ui/core/styles';
import lightFormat from 'date-fns/lightFormat'
import EditCard from "./EditCard";
import CategoryDropdown from "./CategoryDropdown"
import axios from "axios/index";

class Transactions extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            showAll: false,
            editRowData: null,
            data: [],
            categories: []
        };
        this.handleEdit = this.handleEdit.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
        this.handleShowAll = this.handleShowAll.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
        this.updateDatabase = this.updateDatabase.bind(this);
        this.updateTransactionsVisibility = this.updateTransactionsVisibility.bind(this);
    }

    componentWillMount() {
        this.setState({data: this.props.data});
        axios.get('/categories', {params: {userToken: this.props.userToken}}).then(category => {
            let categories = category.data.map(c => c.category);
            this.setState({categories: categories})
        }).catch(e => {
            console.log("Failed to get categories")
        })
    }

    handleEdit = (type, rowData, event) => {
        this.setState({open: true, editRowData: rowData})
    };

    handleAdd = () => {

    };

    handleUpdate = (updatedRowData) => {
        let data = [...this.state.data];
        data.forEach((row) => {
            if (row.id === updatedRowData.id) {
                row.assignCategory = updatedRowData.assignCategory;
                row.date = lightFormat(new Date(updatedRowData.date), 'MM/dd/yyyy');
                row.description = updatedRowData.description;
                row.charge = updatedRowData.charge;
                row.hidden = updatedRowData.hidden;
            }
        });
        this.setState({open: false, editRowData: null});
        this.setState({data: data});
        this.updateDatabase(updatedRowData);
    };

    handleShowAll() {
        this.setState({showAll: !this.state.showAll})
    };

    handleClose() {
        this.setState({open: false, editRowData: null})
    };

    handleDropdownChange(transactionId, event) {
        let data = [...this.state.data];
        let row;
        data.forEach((r) => {
            if (r.id === transactionId) {
                r.assignCategory = event.target.value;
                row = r;
            }
        });
        this.setState({data: data});
        this.updateDatabase(row, transactionId)
    };

    updateDatabase(updatedRowData, transactionId) {
        axios.patch('/transactions/patch', {updateData: updatedRowData, userToken: this.props.usertoken, transactionId: transactionId});
    }

    updateTransactionsVisibility() {
        this.setState({showAll: !this.state.showAll})
    }

    render() {
        let showAllIcon = this.state.showAll ? <Visibility onClick={this.updateTransactionsVisibility}/> :
            <VisibilityOff onClick={this.updateTransactionsVisibility}/>;
        let data = this.state.showAll ? this.state.data : this.state.data.filter(row => {
            if (!row.hidden) return row
        });
        return (
            <div>
                <MaterialTable
                    title={"Transactions"}
                    options={{search: false, paging: false, actionsColumnIndex: -1}}
                    columns={[
                        {
                            title: 'Category',
                            field: 'assignCategory',
                            render: rowData => <CategoryDropdown id={rowData.id}
                                                                 assignedCategory={rowData.assignCategory}
                                                                 callback={this.handleDropdownChange}
                                                                 categories={this.state.categories}/>,
                            editComponent: () => (<CategoryDropdown assignedCategory={'SelectOne'}
                                                                    callback={this.handleDropdownChange}
                                                                    categories={this.state.categories}/>)
                        },
                        {title: 'Date', field: 'date'},
                        {title: 'Description', field: 'description'},
                        {
                            title: 'Charge',
                            field: 'charge',
                            type: 'currency',
                            editComponent: props => (<input type="numeric" value={props.value}
                                                            onChange={e => props.onChange(e.target.value)}/>)
                        },
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
                                return showAllIcon
                            },
                            tooltip: 'Show Hidden',
                            isFreeAction: true,
                            onClick: () => {
                                this.handleShowAll()
                            }
                        }
                    ]}
                    editable={{
                        onRowAdd: newData =>
                            new Promise((resolve) => {
                                setTimeout(() => {
                                    {
                                        const data = this.state.data;
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
                                        let data = this.state.data;
                                        const index = data.indexOf(oldData);
                                        data.splice(index, 1);
                                        this.updateDatabase(oldData);
                                        this.setState({data}, () => resolve());
                                    }
                                    resolve();
                                }, 1000);
                            })
                    }}
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

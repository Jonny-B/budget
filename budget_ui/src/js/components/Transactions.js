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
            showAll: false,
            editRowData: null,
            categories: []
        };
        this.handleShowAll = this.handleShowAll.bind(this);
        this.updateDatabase = this.updateDatabase.bind(this);
        this.updateTransactionsVisibility = this.updateTransactionsVisibility.bind(this);
    }

    handleShowAll() {
        this.setState({showAll: !this.state.showAll})
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

        let data = this.state.showAll ? this.props.data : this.props.data.filter(row => {
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
                                                                 callback={this.props.handleDropdownChange}
                                                                 categories={this.props.categories}/>
                        },
                        {title: 'Date', field: 'date'},
                        {title: 'Description', field: 'description'},
                        {
                            title: 'Charge',
                            field: 'charge',
                            type: 'currency',
                        },
                        {   title: 'Hide',
                            field: 'hide',
                            render: rowData =>
                                    rowData.hidden ? <VisibilityOff onClick={() => {this.props.hideRow(rowData)}}/> : <Visibility onClick={() => {this.props.hideRow(rowData)}}/>,
                        }
                    ]}
                    actions={[
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
            </div>
        )
    }
}


const styles = theme => ({});

export default withStyles(styles)(Transactions)

import React, {Component} from 'react'
import {TextField, Button, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import {Lock} from '@material-ui/icons'
import CategoryDropdown from "./CategoryDropdown";

class EditCard extends Component {
    constructor(props) {
        super(props);
        this.state = {data: this.props.data};
    }

    render() {
        let {data} = this.state;

        let categoryCol = data.category !== undefined ? <CategoryCol data={data}/> : <></>;
        let budgetCol = data.budget !== undefined ? <BudgetCol data={data}/> : <></>;
        let actual = data.actual !== undefined ? <Actual data={data}/> : <></>;
        let bucketTotal = data.bucketTotal !== undefined ? <BucketTotal data={data}/> : <></>;
        let assignCategoryCol = data.assignCategory !== undefined ? <AssignCategoryCol data={data}/> : <></>;
        let dateCol = data.date !== undefined ? <DateCol data={data}/> : <></>;
        let descriptionCol = data.date !== undefined ? <DescriptionCol data={data}/> : <></>;
        let chargeCol = data.date !== undefined ? <ChargeCol data={data}/> : <></>;
        let hide = data.date !== undefined ? <Hide data={data}/> : <></>;
        let add = data.add !== undefined ? <Add data={data}/> : <></>;
        return (
            <div>
                {categoryCol}
                {budgetCol}
                {actual}
                {bucketTotal}
                {assignCategoryCol}
                {dateCol}
                {descriptionCol}
                {chargeCol}
                {hide}
                {add}
                <Button>Update</Button>
            </div>
        )
    }
}

const CategoryCol = (props) => {
    return (<TextField
        id={'categoryCol'}
        label={'Category Name'}
        defaultValue={props.data.category}
    />)
};

const BudgetCol = (props) => {
    return (<Typography id={'budgetCol'}>{`Budget: $${props.data.budget}`} <Lock/></Typography>)
};

const Actual = (props) => {
    return (<Typography id={'actual'}>{`Actual: $${props.data.actual}`} <Lock/></Typography>)
};

const BucketTotal = (props) => {
    return (<Typography id={'savingsBucket'}>{`Savings Bucket: $${props.data.bucketTotal}`} <Lock/></Typography>)
};

const AssignCategoryCol = (props) => {
    return (<CategoryDropdown id={props.data.id} assignedCategory={props.data.assignCategory} handleDropdownChange={() => {}}/>)

};

const DateCol = (props) => {
    return (<div id={'dateCol'}>Date</div>)

};

const DescriptionCol = (props) => {
    return (<div id={'descriptionCol'}>Description</div>)
};

const ChargeCol = (props) => {
    return (<div id={'chargeCol'}>Charge</div>)

};

const Hide = (props) => {
    return (<div id={'hideCol'}>Hide</div>)

};

const Add = (props) => {
    if (props.data.type !== undefined) {
        return (<div id={'add'}>{`Add ${props.data.type}`}</div>)
    }
    return (<div id={'add'}>Add Transaction</div>)

};

const styles = theme => ({});

export default withStyles(styles)(EditCard)

import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';

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
            </div>
        )
    }
}

const CategoryCol = (props) => {
    return (<div id={'categoryCol'}> Category </div>)
};

const BudgetCol = (props) => {
    return (<div id={'budgetCol'}> Budget </div>)
};

const Actual = (props) => {
    return (<div id={'actual'}>Actual</div>)
};

const BucketTotal = (props) => {
    return (<div id={'savingsBucket'}>Savings Bucket</div>)
};

const AssignCategoryCol = (props) => {
    return (<div id={'assignCategoryCol'}>Ass Cat</div>)

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
    if (props.data.type !== undefined){
        return (<div id={'add'}>{`Add ${props.data.type}`}</div>)
    }
    return (<div id={'add'}>Add Transaction</div>)

};

const styles = theme => ({});

export default withStyles(styles)(EditCard)

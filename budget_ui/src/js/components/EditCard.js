import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';

class EditCard extends Component {
    constructor(props) {
        super(props);
        this.state = {data: this.props};
    }

    render() {
        let {data} = this.state;

        let categoryCol = data.category !== null ? <CategoryCol data={data}/> : <></>;
        let budgetCol = data.budget !== null ? <BudgetCol data={data}/> : <></>;
        let assignCategoryCol = data.budget !== null ? <AssignCategoryCol data={data}/> : <></>;
        let dateCol = data.date !== null ? <DateCol data={data}/> : <></>;
        let descriptionCol = data.date !== null ? <DescriptionCol data={data}/> : <></>;
        let chargeCol = data.date !== null ? <ChargeCol data={data}/> : <></>;
        let hide = data.date !== null ? <Hide data={data}/> : <></>;

        return (
            <div>
                {categoryCol}
                {budgetCol}
                {assignCategoryCol}
                {dateCol}
                {descriptionCol}
                {chargeCol}
                {hide}
            </div>
        )
    }
}

const CategoryCol = (data) => {
    return (
        <div>

        </div>
    )
};

const BudgetCol = (data) => {
    return (
        <div>

        </div>
    )
};

const AssignCategoryCol = (data) => {
    return (<div></div>)

};

const DateCol = (data) => {
    return (<div></div>)

};

const DescriptionCol = (data) => {
    return (<div></div>)

};

const ChargeCol = (data) => {
    return (<div></div>)

};

const Hide = (data) => {
    return (<div></div>)

};

const styles = theme => ({});

export default withStyles(styles)(EditCard)

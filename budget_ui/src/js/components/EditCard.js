import React, {useState} from 'react'
import {TextField, Button, Typography} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';
import {Lock, Visibility, VisibilityOff} from '@material-ui/icons'
import CategoryDropdown from "./CategoryDropdown";

export default function EditCard(props) {
    const [data, setData] = useState(props.data);

    const handleChange = () => event => {
        let d = data;
        d.assignCategory = event.target.value;
        setData(d);
    };

    const handleUpdate = () => {
        // update db
    };

    const toggleHide = () => {
        let d = data;
        d.hide = !d.hide;
        setData(d);
    };

    let categoryCol = data.category !== undefined ? <CategoryCol data={data}/> : <></>;
    let budgetCol = data.budget !== undefined ? <BudgetCol data={data}/> : <></>;
    let actual = data.actual !== undefined ? <Actual data={data}/> : <></>;
    let bucketTotal = data.bucketTotal !== undefined ? <BucketTotal data={data}/> : <></>;
    let assignCategoryCol = data.assignCategory !== undefined ?
        <AssignCategoryCol data={data} handleChange={handleChange}/> : <></>;
    let dateCol = data.date !== undefined ? <DateCol data={data}/> : <></>;
    let descriptionCol = data.date !== undefined ? <DescriptionCol data={data}/> : <></>;
    let chargeCol = data.date !== undefined ? <ChargeCol data={data}/> : <></>;
    let hide = data.date !== undefined ? <Hide toggleHide={toggleHide} data={data}/> : <></>;
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
    return (
        <CategoryDropdown id={props.data.id} assignedCategory={props.data.assignCategory}
                          callback={props.handleChange}/>)
};

const DateCol = (props) => {
    return (<Typography id={'dateCol'}>{props.data.date}</Typography>)

};

const DescriptionCol = (props) => {
    return (<Typography id={'descriptionCol'}>{props.data.description}</Typography>)
};

const ChargeCol = (props) => {
    return (<Typography id={'chargeCol'}>{props.data.charge}</Typography>)
};

const Hide = (props) => {
    let hide = props.data.hide === true ? <VisibilityOff/> : <Visibility/>;
    return (<Button onClick={props.toggleHide()} id={'hideCol'}>{hide}</Button>)

};

const Add = (props) => {
    if (props.data.type !== undefined) {
        return (<div id={'add'}>{`Add ${props.data.type}`}</div>)
    }
    return (<div id={'add'}>Add Transaction</div>)

};

const useStyles = makeStyles(theme => ({}));
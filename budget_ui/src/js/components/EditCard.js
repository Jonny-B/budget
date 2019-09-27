import React, {useState} from 'react'
import {TextField, Button, Typography} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';
import {makeStyles} from '@material-ui/core/styles';
import {Lock, Visibility, VisibilityOff} from '@material-ui/icons'
import CategoryDropdown from "./CategoryDropdown";

export default function EditCard(props) {
    const [data, setData] = useState(props.data);

    const handleCategoryChange = (id, event) => {
        let d = {...data};
        d.assignCategory = event.target.value;
        setData(d);
    };

    const handleDateChange = (date) => {
        let d = {...data};
        d.date = date;
        setData(d);
    };

    const handleDescriptionChange = (event) => {
        let d = {...data};
        d.description = event.target.value;
        setData(d);
    };

    const handleChargeChange = (event) => {
        let d = {...data};
        d.charge = parseFloat(event.target.value.replace('$', ''));
        setData(d);
    };

    const handleUpdate = () => {
        props.callback(data)
    };

    const toggleHide = () => {
        let d = data;
        d.hidden = !d.hidden;
        setData(d);
    };

    let categoryCol = data.category !== undefined ? <CategoryCol data={data}/> : <></>;
    let budgetCol = data.budget !== undefined ? <BudgetCol data={data}/> : <></>;
    let actual = data.actual !== undefined ? <Actual data={data}/> : <></>;
    let bucketTotal = data.bucketTotal !== undefined ? <BucketTotal data={data}/> : <></>;
    let assignCategoryCol = data.assignCategory !== undefined ?
        <AssignCategoryCol data={data} handleCategoryChange={handleCategoryChange}/> : <></>;
    let dateCol = data.date !== undefined ? <DateCol data={data} handleDateChange={handleDateChange}/> : <></>;
    let descriptionCol = data.description !== undefined ? <DescriptionCol data={data} handleDescriptionChange={handleDescriptionChange}/> : <></>;
    let chargeCol = data.charge !== undefined ? <ChargeCol data={data} handleChargeChange={handleChargeChange}/> : <></>;
    let hide = data.hide !== undefined ? <Hide toggleHide={toggleHide} data={data}/> : <></>;
    let add = data.add !== undefined ? <Add data={data}/> : <></>;

    return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {categoryCol}
            {budgetCol}
            {actual}
            {bucketTotal}
            {/*{assignCategoryCol}*/}
            {dateCol}
            {descriptionCol}
            {chargeCol}
            {hide}
            {add}
            <Button onClick={handleUpdate}>Update</Button>
        </MuiPickersUtilsProvider>
    )
}

const CategoryCol = (props) => {
    return (<TextField id={'categoryCol'} label={'Category Name'} defaultValue={props.data.category}/>)
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
        <div>
            <Typography>Edit Category</Typography>
            <CategoryDropdown id={props.data.id} assignedCategory={props.data.assignCategory}
                              callback={props.handleCategoryChange}/>
        </div>
    )
};

const DateCol = (props) => {
    return (
        <KeyboardDatePicker
            variant="inline"
            format="MM/dd/yyyy"
            margin="normal"
            id="date-picker-inline"
            label="Date picker inline"
            value={props.data.date}
            onChange={props.handleDateChange}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
        />
    )

};

const DescriptionCol = (props) => {
    return (<TextField id={'descriptionCol'} label={'Description'} onChange={props.handleDescriptionChange} defaultValue={props.data.description}/>)
};

const ChargeCol = (props) => {
    return (<TextField id={'chargeCol'} label={'Charge'} onChange={props.handleChargeChange} defaultValue={`$${props.data.charge}`}/>)
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
import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';
import {MenuItem, Select} from "@material-ui/core";

class CategoryDropdown extends Component {
    constructor(props) {
        super(props);
        //TODO Get Categories from DB and set default

        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }

    handleDropdownChange = event => {
        this.props.callback(this.props.id, event, this.props.assignedCategory);
    };

    render() {
        let count = 0;
        return (
            <div id={'categoryDropdown'}>
                <Select onChange={this.handleDropdownChange} value={this.props.assignedCategory}>
                    <MenuItem id={`${this.props.id}#${count}`} key={`${this.props.id}${count}`} value="Select One">Select
                        One</MenuItem>
                    {this.props.categories.map((category) => {
                        count += 1;
                        return <MenuItem key={`${this.props.id}${count}`} value={category}>{category}</MenuItem>
                    })}
                </Select>
            </div>
        )
    }
}


const styles = theme => ({});

export default withStyles(styles)(CategoryDropdown)

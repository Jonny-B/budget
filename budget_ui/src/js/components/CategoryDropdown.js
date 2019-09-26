import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';
import {MenuItem, Select} from "@material-ui/core";

class CategoryDropdown extends Component {
    constructor(props) {
        super(props);
        //TODO Get Categories from DB and set default
        this.state = {
            categories: ['Select One', 'Category1', 'Category2', 'Category3'],
            assignedCategory: this.props.assignedCategory
        };

        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }


    handleDropdownChange = event => {
        this.setState({assignedCategory: event.target.value});

        this.props.callback(this.props.id, event)
    };

    render() {
        let count = 0;
        return (
            <div id={'categoryDropdown'}>
                <Select onChange={this.handleDropdownChange} value={this.state.assignedCategory}>
                    {this.state.categories.map((category) => {
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

import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';
import {MenuItem, Select} from "@material-ui/core";

class CategoryDropdown extends Component {
    constructor(props) {
        super(props);
        //TODO Get Categories from DB and set default
        this.state = {
            categories: ['Select One', 'Category1', 'Category2', 'Category3'],
        };
    }

    render() {
        return (
            <div id={'categoryDropdown'}>
                <Select onChange={this.props.handleDropdownChange(this.props.id)} value={this.props.assignedCategory}>
                    {this.state.categories.map((category) => {
                        return <MenuItem value={category}>{category}</MenuItem>
                    })}
                </Select>
            </div>
        )
    }
}


const styles = theme => ({});

export default withStyles(styles)(CategoryDropdown)

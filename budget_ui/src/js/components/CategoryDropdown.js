import React, {Component} from 'react'
import {withStyles} from '@material-ui/core/styles';
import {MenuItem, Select} from "@material-ui/core";

class CategoryDropdown extends Component {
    constructor(props) {
        super(props);
        //TODO Get Categories from DB and set default
        this.state = {
            categories: this.props.categories,
            value: this.props.categories[0]
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = event => {
        this.setState({value: event.target.value})

        // Update assigned budget item in DB here.
    };

    render() {
        return (
            <div id={'categoryDropdown'}>
                <Select onChange={this.handleChange} value={this.state.value}>
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

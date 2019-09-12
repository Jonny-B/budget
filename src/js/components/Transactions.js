import React, {Component} from 'react'
import {Select, MenuItem} from '@material-ui/core'
import MaterialTable from "material-table";

class Transactions extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <MaterialTable
                title={"Transactions"}
                options={{search: false, paging: false}}
                columns={[
                    {
                        title: 'Category', field: 'category', render: rowData =>
                            <Select value={'TEST1'}>
                                <MenuItem value={'TEST1'}>TEST1</MenuItem>
                                <MenuItem value={'TEST2'}>TEST2</MenuItem>
                            </Select>

                    },
                    {title: 'Date', field: 'date'},
                    {title: 'Description', field: 'description'},
                    {title: 'Charge', field: 'charge', type: 'currency'},
                    {title: 'Charge', field: 'charge', type: 'currency'},
                ]}
                data={[
                    {date: '01/01/19', description: 'Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},
                    {date: '02/01/19', description: 'Lorem Ipsum', budget: 0.00, actual: 0.00},

                ]}/>
        )
    }
}

export default Transactions

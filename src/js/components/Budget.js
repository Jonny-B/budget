import React, {Component} from 'react'
import MaterialTable from 'material-table'
import {Grid} from '@material-ui/core'

class Budget extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div>
                <Grid container spacing={3} direction={'column'}>
                    <Grid item>
                        <MaterialTable
                            title={"Income"}
                            options={{search: false, paging: false}}
                            columns={[
                                {title: 'Category', field: 'category'},
                                {title: 'Budget', field: 'budget', type: 'currency'},
                                {title: 'Actual', field: 'actual', type: 'currency'}
                            ]}
                            data={[
                            {category: 'TEST1', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                        ]}/>
                    </Grid>
                    <Grid item>
                        <MaterialTable
                            title={"Expenses"}
                            options={{search: false, paging: false}}
                            columns={[
                                {title: 'Category', field: 'category'},
                                {title: 'Budget', field: 'budget', type: 'currency'},
                                {title: 'Actual', field: 'actual', type: 'currency'}
                            ]}
                            data={[
                            {category: 'TEST1', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00},
                        ]}/>
                    </Grid>
                    <Grid item>
                        <MaterialTable
                            title={"Savings"}
                            options={{search: false, paging: false}}
                            columns={[
                                {title: 'Category', field: 'category'},
                                {title: 'Budget', field: 'budget', type: 'currency'},
                                {title: 'Actual', field: 'actual', type: 'currency'},
                                {title: 'Bucket Total', field: 'bucketTotal', type: 'currency'}
                            ]}
                            data={[
                            {category: 'TEST1', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                            {category: 'TEST2', budget: 0.00, actual: 0.00, bucketTotal: 0.00},
                        ]}/>
                    </Grid>
                </Grid>
            </div>
        )
    }
}


export default Budget

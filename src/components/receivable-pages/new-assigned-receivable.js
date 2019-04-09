import { MDBDataTable } from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Container, Label } from 'semantic-ui-react';
import { ReceivableAction } from '../../actions/receivable-action';
import { numAsDate } from '../../utils/time-converter';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { describeStatus } from './detail/receivable-detail';

class NewAssignedReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 0
        }
    }

    componentDidMount() {
        available1();
    }

    componentWillUnmount() { }

    pushDataToTable() {
        let data1 = { ...data };
        let rows = this.props.receivableList.map((r, i) => {
            let status = describeStatus(r.CollectionProgressStatus);
            let statusColor = 'grey';
            if (status === 'Collecting') {
                statusColor = 'green'
            } else if (status === 'Waiting') {
                statusColor = 'orange'
            }
            return {
                No: (i + 1),
                DebtorName: r.DebtorName,
                CustomerName: r.CustomerName,
                DebtAmount: r.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 }),
                PayableDay: numAsDate(r.PayableDay),
                Status: <Label color={statusColor}>{status}</Label>,
                action: <Link target='_blank' to={`/receivable/${r.Id}/view`}>Detail</Link>
            }
        });
        data1.rows = rows;
        return data1;
    }

    render() {
        if (this.isLoading() || this.props.newReceiavbleIds.length !== this.props.receivableList.length) {
            return <PrimaryLoadingPage />;
        }
        let data1 = this.pushDataToTable();
        return (
            <Container className='col-sm-12 row justify-content-center'>
                <div className="hungdtq-header">
                    <h1> You have just been assigned for {this.props.newReceiavbleIds.length} receivable(s)</h1>
                </div>
                <div id='receivable-list'>
                    {data1.rows.length > 0 ? <MDBDataTable
                        className='hide-last-row'
                        striped
                        bordered
                        data={data1} /> :
                        <div>No receivable found!</div>}
                </div>
            </Container>);
    }
}

const data = {
    columns: [
        {
            label: '#',
            field: 'No',
            width: 150
        },
        {
            label: 'Debtor',
            field: 'DebtorName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Customer',
            field: 'CustomerName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Debt amount',
            field: 'DebtAmount',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Payable day',
            field: 'PayableDay',
            sort: 'asc',
            width: 200
        },
        {
            label: 'Status',
            field: 'Status',
            sort: 'asc',
            width: 100
        },
        {
            label: '',
            field: 'action',
            width: 150
        }
    ],
    rows: []
}

const mapStateToProps = state => {
    return {
        receivableList: state.receivableList2,
        collectors: state.collectors,
        customers: state.customers,
        newReceiavbleIds: state.newReceiavbleIds
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        setReceivables: (list) => {
            dispatch(ReceivableAction.setReceivableList2(list));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewAssignedReceivable);
import React from 'react';
import { connect } from 'react-redux';
import { ReceivableAction } from '../../actions/receivable-action'
import { available, PrimaryLoadingPage } from '../common/loading-page'
import Component from '../common/component'
import { ReceivableService } from '../../services/receivable-service';
import { numAsDate } from '../../utils/time-converter';
import { Container, Header, Label, Icon } from 'semantic-ui-react'
import { describeStatus } from './detail/receivable-detail';
import { MDBDataTable } from 'mdbreact'
import { CollectorAction } from '../../actions/collector-action'
import { UserService } from '../../services/user-service';
import { CustomerService } from '../../services/customer-service';
import { CustomerAction } from '../../actions/customer-action';

class NewAssignedReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1
        }
    }

    componentDidMount() {
        document.title = 'New assigned receivable';
        available(resolve => setTimeout(resolve, 400));
        // let list = [];
        // let idList = this.props.newReceiavbleIds;
        // idList.map((id, i) => {
        //     ReceivableService.get(id).then(res => {
        //         let receivable = res.data;
        //         list.push(receivable);
        //         if (i === (idList.length - 1)) {
        //             this.props.setReceivables(list);
        //         }
        //         this.incrementLoading();
        //     })
        // })
        this.props.getCollectors().then(res => {
            this.incrementLoading();
        })
    }

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
            let collector = this.props.collectors.find(c => c.Id === r.AssignedCollectorId);
            return {
                No: (i + 1),
                DebtorName: r.DebtorName,
                CustomerName: r.CustomerName,
                CollectorName: collector ? collector.FullName : null,
                DebtAmount: r.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 }),
                PayableDay: numAsDate(r.PayableDay),
                Status: <Label color={statusColor}>{status}</Label>,
                action: [<Icon name='eye' style={{ cursor: 'pointer' }}
                    onClick={e => { this.props.history.push(`/receivable/${r.Id}/view`) }} />]
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
            <Container className='col-sm-12 row justify-content-center align-self-center'>
                <Header className='text-center'>
                    You have just been assigned for {this.props.newReceiavbleIds.length} receivable(s)
                </Header>
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
            label: 'Collector',
            field: 'CollectorName',
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
        receivableList: state.receivableList,
        collectors: state.collectors,
        customers: state.customers,
        newReceiavbleIds: state.newReceiavbleIds
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        setReceivables: (list) => {
            dispatch(ReceivableAction.setReceivableList(list));
        },
        getCollectors: () => {
            return UserService.getCollectors().then(res => {
                let list = res.data;
                list.forEach(c => {
                    c.FullName = `${c.FirstName} ${c.LastName}`
                })
                dispatch(CollectorAction.setCollectors(list));
            })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(NewAssignedReceivable);
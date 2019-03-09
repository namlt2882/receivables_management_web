import React from 'react';
import { connect } from 'react-redux';
import { ReceivableAction } from '../../actions/receivable-action'
import { Link } from 'react-router-dom';
import { available, PrimaryLoadingPage } from '../common/loading-page'
import Component from '../common/component'
import { ReceivableService } from '../../services/receivable-service';
import { numAsDate } from '../../utils/time-converter';
import { Button, Container, Header, Label, Icon } from 'semantic-ui-react'
import { describeStatus, compareStatus } from './detail/receivable-detail';
import { compareIntDate } from '../../utils/time-converter'
import { MDBDataTable } from 'mdbreact'
import { AuthService } from '../../services/auth-service';
import { CollectorAction } from '../../actions/collector-action'
import {
    Chart,
    ChartTitle,
    ChartSeries,
    ChartSeriesItem,
    ChartCategoryAxis,
    ChartCategoryAxisTitle,
    ChartCategoryAxisItem,
    ChartSeriesLabels,
    SeriesClickEvent,
    ChartSeriesItemTooltip,
    ChartTooltip
} from '@progress/kendo-react-charts';
import { UserService } from '../../services/user-service';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import { CustomerAction } from '../../actions/customer-action'

class ReceivableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 2,
            receivableList: [],
            series: [
                { category: 'Collecting', value: 0, color: 'green' },
                { category: 'Waiting', value: 0, color: 'orange' },
                { category: 'Closed', value: 0, color: 'gray' }
            ],
            selectedStatus: ['Collecting', 'Waiting', 'Closed'],
            selectedCollector: [],
            selectedCustomer: []
        }
        this.calculateSeries = this.calculateSeries.bind(this);
        this.filterReceivable = this.filterReceivable.bind(this);
        this.removeStatus = this.removeStatus.bind(this);
        this.chooseStatus = this.chooseStatus.bind(this);
        this.onChangeSelectedCollector = this.onChangeSelectedCollector.bind(this);
        this.onChangeSelectedCustomer = this.onChangeSelectedCustomer.bind(this);
        this.addStatus = this.addStatus.bind(this);
    }
    onChangeSelectedCollector(e) {
        let selectedCollector = [...e.target.value];
        this.setState({ selectedCollector: selectedCollector });
        this.filterReceivable(this.state.selectedStatus, selectedCollector, this.state.selectedCustomer);
    }
    onChangeSelectedCustomer(e) {
        let selectedCustomer = [...e.target.value];
        this.setState({ selectedCustomer: selectedCustomer });
        this.filterReceivable(this.state.selectedStatus, this.state.selectedCollector, selectedCustomer);
    }
    filterReceivable(selectedStatus, collectors, customers) {
        let list = this.props.receivableList;
        let mapCollector = new Map();
        collectors.forEach(c => { mapCollector.set(c.Id, c); });
        let mapCustomer = new Map();
        customers.forEach(c => { mapCustomer.set(c.Name, c); });
        list = list.filter(r => {
            let status = describeStatus(r.CollectionProgressStatus);
            // Filter status
            if (selectedStatus.find(s => s === status)) {
                r.Display = true;
            } else {
                r.Display = false;
            }
            //Filter by selected collector
            let rs = true;
            if (mapCollector.size > 0) {
                rs = mapCollector.has(r.AssignedCollectorId);
            }
            //Filter by selected customer
            if (rs) {
                if (mapCustomer.size > 0) {
                    rs = mapCustomer.has(r.CustomerName);
                }
            }
            return rs;
        })
        this.setState({ receivableList: list });
    }
    getNotChoosenCustomer() {
        let mapCustomer = new Map();
        this.state.selectedCustomer.forEach(c => {
            mapCustomer.set(c.Name, c);
        });
        let list = this.props.customers;
        if (mapCustomer.size > 0) {
            list = list.filter(c => {
                //Filter by selected collector
                return !mapCustomer.get(c.Name);
            })
        }
        return list;
    }
    getNotChoosenCollector() {
        let mapCollector = new Map();
        this.state.selectedCollector.forEach(c => {
            mapCollector.set(c.Id, c);
        });
        let list = this.props.collectors;
        if (mapCollector.size > 0) {
            list = list.filter(c => {
                //Filter by selected collector
                return !mapCollector.get(c.Id);
            })
        }
        return list;
    }
    componentDidMount() {
        document.title = 'Receivables';
        available(resolve => setTimeout(resolve, 400));
        this.props.fetchReceivableList().then(res => {
            this.incrementLoading();
            this.filterReceivable(this.state.selectedStatus, this.state.selectedCollector, this.state.selectedCustomer);
        });
        this.props.getCollectors().then(res => {
            this.incrementLoading();
        })
    }
    pushDataToTable() {
        let data1 = { ...data };
        let rows = this.state.receivableList.filter(r => r.Display).map((r, i) => {
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
    calculateSeries() {
        let series = this.state.series;
        series.forEach(s => { s.value = 0 })
        series = this.state.receivableList.reduce((acc, rei) => {
            let status = describeStatus(rei.CollectionProgressStatus);
            let tmp = acc.find(obj => obj.category === status);
            if (tmp) {
                tmp.value++;
            }
            return acc;
        }, series);
    }
    removeStatus(status) {
        let selectedStatus = this.state.selectedStatus.filter(s => s !== status);
        this.setState(pre => ({
            selectedStatus: selectedStatus
        }))
        this.filterReceivable(selectedStatus, this.state.selectedCollector, this.state.selectedCustomer);
    }

    addStatus(status) {
        let statuses = this.state.selectedStatus;
        if (!statuses.find(s => s === status)) {
            statuses.push(status);
            this.setState(pre => ({
                selectedStatus: statuses
            }))
            this.filterReceivable(statuses, this.state.selectedCollector, this.state.selectedCustomer);
        }
    }

    chooseStatus(status) {
        this.setState({
            selectedStatus: [status]
        })
        this.filterReceivable([status], this.state.selectedCollector, this.state.selectedCustomer);
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />;
        }
        let data1 = this.pushDataToTable();
        this.calculateSeries();
        return (
            <Container className='col-sm-12 row justify-content-center align-self-center'>
                <Header className='text-center'>
                    {AuthService.isManager() ? `Receivables` : 'Your assigned receivables'}
                </Header>
                {AuthService.isManager() ? <div>
                    <Button primary onClick={() => { this.props.history.push('/receivable/add') }}>Import</Button><br />
                    <Link to='/receivable/recent-add'>Recent added receivables</Link><br />
                </div> : null}
                <div className='col-sm-12 row justify-content-center align-self-center'>
                    <div className='col-sm-4' style={{ paddingTop: '20px' }}>
                        {AuthService.isManager() ? <div>
                            <div><b>Collector</b>:</div>
                            <MultiSelect
                                data={this.getNotChoosenCollector()}
                                onChange={this.onChangeSelectedCollector}
                                value={this.state.selectedCollector}
                                textField='FullName' />
                        </div> : null}
                        <br />
                        {AuthService.isManager() ? <div>
                            <div><b>Customer</b>:</div>
                            <MultiSelect
                                data={this.getNotChoosenCustomer()}
                                onChange={this.onChangeSelectedCustomer}
                                value={this.state.selectedCustomer}
                                textField='Name' />
                        </div> : null}
                        <br />
                        <div>
                            <div><b>Status</b>:</div>
                            {this.state.selectedStatus.map(s => {
                                let color = 'grey';
                                if (s === 'Collecting') {
                                    color = 'green'
                                } else if (s === 'Waiting') {
                                    color = 'orange'
                                }
                                return <Label color={color}>
                                    {s}
                                    <Icon name='delete' onClick={() => { this.removeStatus(s) }} />
                                </Label>
                            })}
                        </div>
                    </div>
                    <div className='col-sm-8'>
                        <Chart pannable={{ lock: 'x' }} zoomable={{
                            mousewheel: { lock: 'x' },
                            selection: { lock: 'x' }
                        }} style={{ width: 600, height: 250 }}
                            onSeriesClick={(e) => {
                                if (e.nativeEvent.event.ctrlKey) {
                                    this.addStatus(e.category);
                                } else this.chooseStatus(e.category);
                            }}>
                            <ChartTitle text="Quantity of receivables" />
                            <ChartTooltip />
                            <ChartSeries>
                                <ChartSeriesItem type="bar" gap={3} data={this.state.series}
                                    field='value' categoryField='category' colorField='color'
                                    style='smooth'>
                                    <ChartSeriesItemTooltip background='gray' />
                                </ChartSeriesItem>
                            </ChartSeries>
                        </Chart>
                        <div><b>Sum</b>:{` ${this.state.receivableList.length}`}</div>
                    </div>
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
        customers: state.customers
    }
}
const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchReceivableList: () => {
            return ReceivableService.getAll().then((res) => {
                let list = res.data;
                if (AuthService.isCollector()) {
                    let id = localStorage.getItem('id');
                    list = list.filter(r => r.AssignedCollectorId === id);
                }
                list.sort((a, b) => {
                    if (a.CollectionProgressStatus === b.CollectionProgressStatus) {
                        return compareIntDate(a.PayableDay, b.PayableDay)
                    } else {
                        return compareStatus(a.CollectionProgressStatus, b.CollectionProgressStatus);
                    }
                });
                dispatch(ReceivableAction.setReceivableList(list));
                // extract customer list
                let customers = list.reduce((acc, r) => {
                    if (!acc.get(r.CustomerName)) {
                        acc.set(r.CustomerName, { Name: r.CustomerName })
                    }
                    return acc;
                }, new Map());
                customers = Array.from(customers.keys());
                customers = customers.map(c => ({ Name: c }))
                dispatch(CustomerAction.setCustomers(customers))
            })
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
export default connect(mapStateToProps, mapDispatchToProps)(ReceivableList);
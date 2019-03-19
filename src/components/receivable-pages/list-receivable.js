import React from 'react';
import { connect } from 'react-redux';
import { ReceivableAction } from '../../actions/receivable-action'
import { Link } from 'react-router-dom';
import { available, PrimaryLoadingPage } from '../common/loading-page'
import Component from '../common/component'
import { ReceivableService } from '../../services/receivable-service';
import { numAsDate } from '../../utils/time-converter';
import { Button, Container, Header, Label, Icon, Checkbox } from 'semantic-ui-react'
import { describeStatus, compareStatus, getStatusColor } from './detail/receivable-detail';
import { compareIntDate } from '../../utils/time-converter'
import { MDBDataTable } from 'mdbreact'
import { AuthService } from '../../services/auth-service';
import { CollectorAction } from '../../actions/collector-action'
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
                { category: 'Collecting', value: 0, color: 'green', checked: true },
                { category: 'Not confirmed', value: 0, color: 'red', checked: true },
                { category: 'Pending', value: 0, color: 'yellow', checked: true },
                { category: 'Closed', value: 0, color: 'gray', checked: true }

            ],
            selectedCollector: [],
            selectedCustomer: [],
        }
        this.calculateSeries = this.calculateSeries.bind(this);
        this.filterReceivable = this.filterReceivable.bind(this);
        this.onChangeSelectedCollector = this.onChangeSelectedCollector.bind(this);
        this.onChangeSelectedCustomer = this.onChangeSelectedCustomer.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
    }
    onChangeSelectedCollector(e) {
        let selectedCollector = [...e.target.value];
        this.setState({ selectedCollector: selectedCollector });
        this.filterReceivable(undefined, selectedCollector, this.state.selectedCustomer);
    }
    onChangeSelectedCustomer(e) {
        let selectedCustomer = [...e.target.value];
        this.setState({ selectedCustomer: selectedCustomer });
        this.filterReceivable(undefined, this.state.selectedCollector, selectedCustomer);
    }
    filterReceivable(selectedStatus = this.state.series.filter(s => s.checked).map(s => s.category), collectors = this.state.selectedCollector, customers = this.state.selectedCustomer) {
        let list = this.props.receivableList;
        let mapCollector = new Map();
        collectors.forEach(c => { mapCollector.set(c.Id, c); });
        let mapCustomer = new Map();
        customers.forEach(c => { mapCustomer.set(c.Name, c); });
        list = list.filter(r => {
            let status = describeStatus(r.CollectionProgressStatus, r.IsConfirmed);
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
        this.calculateSeries(list);
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
            this.filterReceivable(undefined, this.state.selectedCollector, this.state.selectedCustomer);
        });
        this.props.getCollectors().then(res => {
            this.incrementLoading();
        })
    }
    pushDataToTable() {
        let data1 = { ...data };
        let rows = this.state.receivableList.filter(r => r.Display).map((r, i) => {
            let status = describeStatus(r.CollectionProgressStatus, r.IsConfirmed);
            let statusColor = getStatusColor(r.CollectionProgressStatus, r.IsConfirmed);
            let collector = this.props.collectors.find(c => c.Id === r.AssignedCollectorId);
            return {
                No: (i + 1),
                DebtorName: r.DebtorName,
                CustomerName: r.CustomerName,
                CollectorName: collector ? `${collector.FullName} (${collector.Username})` : null,
                DebtAmount: r.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 }),
                PayableDay: numAsDate(r.PayableDay),
                Status: <Label color={statusColor}>{status}</Label>,
                action: <Link target='_blank' to={`receivable/${r.Id}/view`}>Detail</Link>
            }
        });
        data1.rows = rows;
        return data1;
    }
    calculateSeries(list = this.state.receivableList) {
        let series = this.state.series;
        series.forEach(s => { s.value = 0 })
        series = list.reduce((acc, r) => {
            let status = describeStatus(r.CollectionProgressStatus, r.IsConfirmed);
            let tmp = acc.find(obj => obj.category === status);
            if (tmp) {
                tmp.value++;
            }
            return acc;
        }, series);
        this.setState({ series: series });
    }

    toggleStatus(category, checked) {
        let series = this.state.series;
        let found = series.find(s => s.category === category);
        if (found) {
            found.checked = checked;
        }
        this.setState({ series: series });
        this.filterReceivable(series.filter(s => s.checked).map(s => s.category))
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />;
        }
        let data1 = this.pushDataToTable();
        return (
            <Container className='col-sm-12 row justify-content-center align-self-center'>
                <div className="hungdtq-header">
                    <h1>
                        {AuthService.isManager() ? `Receivables` : 'Your assigned receivables'}
                    </h1>
                </div>
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
                    </div>
                    <div className='col-sm-3'>
                        <div>
                            {this.state.series.map(s => <div style={{ padding: '5px' }}>
                                <Checkbox checked={s.checked}
                                    onChange={(e, data) => {
                                        this.toggleStatus(s.category, data.checked);
                                    }} />
                                <Label color={s.color}>{`${s.category} (${s.value})`}</Label>
                            </div>)}
                        </div>
                    </div>
                    {/* <div className='col-sm-8'>
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
                    </div> */}
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
                    if (describeStatus(a.CollectionProgressStatus, a.IsConfirmed) === describeStatus(b.CollectionProgressStatus, b.IsConfirmed)) {
                        if (a.PayableDay === null) {
                            if (b.PayableDay === null) {
                                return 0;
                            }
                            return 1;
                        }
                        return compareIntDate(a.PayableDay, b.PayableDay)
                    } else {
                        return compareStatus(a.CollectionProgressStatus, b.CollectionProgressStatus, a.IsConfirmed, b.IsConfirmed);
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
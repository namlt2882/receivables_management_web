import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faExclamationCircle, faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import classnames from 'classnames';
import { MDBDataTable } from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import { Checkbox, Container, Divider, Label } from 'semantic-ui-react';
import { CollectorAction } from '../../actions/collector-action';
import { CustomerAction } from '../../actions/customer-action';
import { ReceivableAction } from '../../actions/receivable-action';
import { AuthService } from '../../services/auth-service';
import { ReceivableService } from '../../services/receivable-service';
import { UserService } from '../../services/user-service';
import { compareIntDate, numAsDate } from '../../utils/time-converter';
import Component from '../common/component';
import { available, PrimaryLoadingPage } from '../common/loading-page';
import { compareStatus, describeStatus, getStatusColor } from './detail/receivable-detail';
library.add(faCheck, faExclamationCircle, faRedo);

class ReceivableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 2,
            receivableList: [],
            series: [
                { category: 'Collecting', value: 0, color: getStatusColor(1), checked: true, isConfirmed: false },
                { category: 'Pending', value: 0, color: getStatusColor(4), checked: true, isConfirmed: false },
                { category: 'Done', value: 0, color: getStatusColor(2), checked: true, isConfirmed: true },
                { category: 'Closed', value: 0, color: getStatusColor(5), checked: true, isConfirmed: true },
                { category: 'Cancel', value: 0, color: getStatusColor(0), checked: true, isConfirmed: true }
            ],
            series2: [
                { category: 'Done', value: 0, color: getStatusColor(2), checked: true, isConfirmed: false },
                { category: 'Closed', value: 0, color: getStatusColor(5), checked: true, isConfirmed: false },
                { category: 'Cancel', value: 0, color: getStatusColor(0), checked: true, isConfirmed: false }
            ],
            sumConfirmed: 0,
            sumNotConfirmed: 0,
            getConfirmed: true,
            selectedCollector: [],
            selectedCustomer: [],
            isRefreshing: false
        }
        this.calculateSeries = this.calculateSeries.bind(this);
        this.filterReceivable = this.filterReceivable.bind(this);
        this.onChangeSelectedCollector = this.onChangeSelectedCollector.bind(this);
        this.onChangeSelectedCustomer = this.onChangeSelectedCustomer.bind(this);
        this.toggleStatus = this.toggleStatus.bind(this);
        this.currentSeries = this.currentSeries.bind(this);
        this.currentSeriesName = this.currentSeriesName.bind(this);
        this.setSeriesState = this.setSeriesState.bind(this);
        this.statusFilterComp = this.statusFilterComp.bind(this);
        this.managerFilterComp = this.managerFilterComp.bind(this);
        this.toggleConfirmed = this.toggleConfirmed.bind(this);
        this.refreshData = this.refreshData.bind(this);
    }
    setSeriesState(series, getConfirmed = this.state.getConfirmed) {
        let state = {};
        state[this.currentSeriesName(getConfirmed)] = series;
        this.setState(state);
    }
    currentSeries(getConfirmed = this.state.getConfirmed) {
        return getConfirmed ? this.state.series : this.state.series2;
    }
    currentSeriesName(getConfirmed = this.state.getConfirmed) {
        return getConfirmed ? 'series' : 'series2';
    }
    onChangeSelectedCollector(e) {
        let selectedCollector = [...e.target.value];
        this.setState({ selectedCollector: selectedCollector });
        this.filterReceivable(undefined, selectedCollector, undefined);
    }
    onChangeSelectedCustomer(e) {
        let selectedCustomer = [...e.target.value];
        this.setState({ selectedCustomer: selectedCustomer });
        this.filterReceivable(undefined, undefined, selectedCustomer);
    }
    filterReceivable(selectedSeries,
        collectors = this.state.selectedCollector, customers = this.state.selectedCustomer,
        getConfirmed = this.state.getConfirmed) {
        if (!selectedSeries) {
            selectedSeries = this.currentSeries(getConfirmed).filter(s => s.checked);
        }
        let list = this.props.receivableList;
        let mapCollector = new Map();
        collectors.forEach(c => { mapCollector.set(c.Id, c); });
        let mapCustomer = new Map();
        customers.forEach(c => { mapCustomer.set(c.Name, c); });
        list = list.filter(r => {
            let status = describeStatus(r.CollectionProgressStatus);
            // Filter status
            let series = selectedSeries.find(s => s.category === status);
            if (series) {
                if (r.IsConfirmed !== series.isConfirmed) {
                    return false;
                }
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
        this.calculateSeries(list, getConfirmed);
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
            this.filterReceivable();
            let sumNotConfirmed = this.props.receivableList.reduce((acc, r) => {
                let status = r.CollectionProgressStatus;
                if (status !== 1 && status !== 4 && !r.IsConfirmed) {
                    acc = acc + 1;
                }
                return acc;
            }, 0);
            let sumConfirmed = this.props.receivableList.length - sumNotConfirmed;
            this.setState({
                sumConfirmed: sumConfirmed,
                sumNotConfirmed: sumNotConfirmed
            })
        });
        this.props.getCollectors().then(res => {
            this.incrementLoading();
        })
    }
    pushDataToTable() {
        let data1 = { ...data };
        let rows = this.state.receivableList.filter(r => r.Display).map((r, i) => {
            let status = describeStatus(r.CollectionProgressStatus);
            let statusColor = getStatusColor(r.CollectionProgressStatus);
            let collector = this.props.collectors.find(c => c.Id === r.AssignedCollectorId);
            return {
                No: (i + 1),
                CustomerName: r.CustomerName,
                DebtorName: r.DebtorName,
                CollectorName: collector ? `${collector.FullName}` : null,
                DebtAmount: (r.DebtAmount - r.PrepaidAmount).toLocaleString(undefined, { minimumFractionDigits: 0 }),
                PayableDay: numAsDate(r.PayableDay),
                Status: <Label color={statusColor}>{status}</Label>,
                action: <Link target='_blank' to={`receivable/${r.Id}/view`}>View</Link>
            }
        });
        data1.rows = rows;
        return data1;
    }
    calculateSeries(list = this.state.receivableList, getConfirmed = this.state.getConfirmed) {
        let series = this.currentSeries(getConfirmed);
        series.forEach(s => { s.value = 0 })
        series = list.reduce((acc, r) => {
            let status = describeStatus(r.CollectionProgressStatus);
            let tmp = acc.find(obj => obj.category === status);
            if (tmp && r.IsConfirmed === tmp.isConfirmed) {
                tmp.value++;
            }
            return acc;
        }, series);
        this.setSeriesState(series, getConfirmed);
    }

    toggleStatus(category, checked) {
        let series = this.currentSeries();
        let found = series.find(s => s.category === category);
        if (found) {
            found.checked = checked;
        }
        this.setSeriesState(series)
        this.filterReceivable(series.filter(s => s.checked))
    }

    statusFilterComp() {
        return <div className='col-sm-12' style={{ marginTop: '10px' }}>
            <div>
                {this.currentSeries().map(s => <div style={{
                    padding: '5px',
                    display: 'inline-block',
                    marginRight: '10px'
                }}>
                    <Checkbox checked={s.checked}
                        onChange={(e, data) => {
                            this.toggleStatus(s.category, data.checked);
                        }} />
                    <Label color={s.color} style={{ cursor: 'pointer' }} onClick={() => {
                        let checked = !s.checked;
                        this.toggleStatus(s.category, checked);
                    }}>{`${s.category} (${s.value})`}</Label>
                </div>)}
            </div>
        </div>
    }
    managerFilterComp() {
        return <div className='col-sm-8' style={{ paddingTop: '20px' }}>
            {/* Collector filter */}
            {AuthService.isManager() ? <div>
                <div><b>Collector</b>:</div>
                <MultiSelect
                    data={this.getNotChoosenCollector()}
                    onChange={this.onChangeSelectedCollector}
                    value={this.state.selectedCollector}
                    textField='FullName' />
            </div> : null}
            <br />
            {/* Customer filter */}
            {AuthService.isManager() ? <div>
                <div><b>Partner</b>:</div>
                <MultiSelect
                    data={this.getNotChoosenCustomer()}
                    onChange={this.onChangeSelectedCustomer}
                    value={this.state.selectedCustomer}
                    textField='Name' />
            </div> : null}
        </div>
    }
    toggleConfirmed(val) {
        let origin = this.state.getConfirmed;
        if (origin != val) {
            this.setState({
                getConfirmed: val
            })
            this.filterReceivable(undefined, undefined, undefined, val);
        }
    }
    refreshData() {
        this.setState({ isRefreshing: true });
        this.props.fetchReceivableList().then(res => {
            this.filterReceivable();
            this.setState({ isRefreshing: false });
        });
    }
    render() {
        let data1 = this.pushDataToTable();
        let tableComponent = null;
        if (this.isLoading() || this.state.isRefreshing) {
            tableComponent = <PrimaryLoadingPage />;
        } else {
            tableComponent = data1.rows.length > 0 ? <MDBDataTable
                className='hide-last-row'
                striped
                bordered
                data={data1} /> :
                <div style={{ fontSize: '2rem' }}>No receivable found!</div>
        }
        let isManager = AuthService.isManager();
        return (
            <Container className='col-sm-12 row justify-content-center'>
                <div className="hungdtq-header">
                    <div>
                        <div className="d-inline-block hungdtq-header-text">
                            <h1>{isManager ? `Receivables` : 'Your assigned receivables'}</h1>
                        </div>
                        {/* Add button */}
                        {AuthService.isManager() ? <div className="d-inline-block hungdtq-headerbtn-container">
                            <div className="btn btn-rcm-primary rcm-btn" onClick={() => {
                                this.props.history.push('/receivable/add');
                            }}>
                                <a><i className="fas fa-plus"></i></a>
                            </div>
                        </div> : null}
                    </div>
                    <Divider />
                </div>
                <div className='col-sm-12 row' style={{ display: isManager ? 'block' : 'none' }}>

                </div>
                <div className='col-sm-12 row justify-content-center align-self-center'>
                    <Nav tabs className='col-sm-8'>
                        <NavItem>
                            <NavLink className={classnames({ active: this.state.getConfirmed })}
                                onClick={() => { this.toggleConfirmed(true) }}>
                                <FontAwesomeIcon icon='check' size='md' color='green'
                                    className='icon-btn' />Confirmed ({this.state.sumConfirmed})
                            </NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink className={classnames({ active: !this.state.getConfirmed })}
                                onClick={() => { this.toggleConfirmed(false); }}>
                                <FontAwesomeIcon icon='exclamation-circle' size='md' color='orange'
                                    className='icon-btn' />Not confirmed ({this.state.sumNotConfirmed})
                            </NavLink>
                        </NavItem>
                        <div style={{
                            position: 'absolute', top: 0, right: 0,
                            display: isManager ? 'block' : 'none'
                        }}>
                            <Link to='/receivable/recent-add'>Recent added receivables</Link>
                        </div>
                    </Nav>
                    <TabContent activeTab='1' style={{ paddingBottom: '20px', borderTop: 'none' }} className='border-shadow col-sm-8 row justify-content-center align-self-center'>
                        <TabPane tabId='1' className='col-sm-12 row justify-content-center align-self-center'>
                            {this.managerFilterComp()}
                            {this.statusFilterComp()}
                        </TabPane>
                    </TabContent>

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
                </div >
                <div className='col-sm-12 hungdtq-header'>
                    <div className='float-right'>
                        <div className='btn btn-rcm-primary rcm-btn'
                            style={{ zIndex: 10, position: 'relative' }}
                            onClick={this.refreshData}>
                            <a><i class="fas fa-redo"></i></a>
                        </div>
                    </div>
                </div>
                <div className='col-sm-12'>
                    {tableComponent}
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
            label: 'Partner',
            field: 'CustomerName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Debtor',
            field: 'DebtorName',
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
            label: 'Start day',
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
                    if (describeStatus(a.CollectionProgressStatus) === describeStatus(b.CollectionProgressStatus)) {
                        if (a.PayableDay === null) {
                            if (b.PayableDay === null) {
                                return 0;
                            }
                            return 1;
                        }
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
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCheck, faExclamationCircle, faRedo } from '@fortawesome/free-solid-svg-icons';
import { MultiSelect } from '@progress/kendo-react-dropdowns';
import { MDBDataTable } from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Nav, TabContent, TabPane, NavItem, NavLink } from 'reactstrap';
import { Button, Checkbox, Container, Divider, Label, Segment, Icon } from 'semantic-ui-react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import classnames from 'classnames';
import InputRange from 'react-input-range';
library.add(faCheck, faExclamationCircle, faRedo);

class ReceivableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFilter: true,
            maxLoading: 2,
            receivableList: [],
            series: [
                { category: 'Collecting', value: 0, color: getStatusColor(1), checked: true, isConfirmed: false },
                { category: 'Pending', value: 0, color: getStatusColor(4), checked: true, isConfirmed: false },
                // { category: 'Done', value: 0, color: getStatusColor(2), checked: true, isConfirmed: true },
                { category: 'Closed', value: 0, color: getStatusColor(5), checked: true, isConfirmed: true },
                { category: 'Cancel', value: 0, color: getStatusColor(0), checked: true, isConfirmed: true }
            ],
            series2: [
                { category: 'Done', value: 0, color: getStatusColor(2), checked: true, isConfirmed: false },
                { category: 'Closed', value: 0, color: getStatusColor(5), checked: true, isConfirmed: false },
                { category: 'Cancel', value: 0, color: getStatusColor(0), checked: true, isConfirmed: false }
            ],
            filterRate: { min: 0, max: 100 },
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
        this.onChangeRate = this.onChangeRate.bind(this);
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
        getConfirmed = this.state.getConfirmed,
        filterRate = this.state.filterRate) {
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
            //Filter by rate of collection progress
            if (rs) {
                rs = filterRate.min <= r.ProgressPercent && filterRate.max >= r.ProgressPercent;
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
            let confirmComponent = null;
            if ((r.CollectionProgressStatus == 0 || r.CollectionProgressStatus == 2 ||
                r.CollectionProgressStatus == 5) && !r.IsConfirmed) {
                confirmComponent = <span style={{
                    color: 'red',
                    display: 'block',
                    fontStyle: 'italic'
                }}>Not confirm</span>
            }
            return {
                No: (i + 1),
                CustomerName: r.CustomerName,
                DebtorName: r.DebtorName,
                CollectorName: collector ? `${collector.FullName}` : null,
                DebtAmount: (r.DebtAmount - r.PrepaidAmount).toLocaleString(undefined, { minimumFractionDigits: 0 }),
                PayableDay: numAsDate(r.PayableDay),
                CurrentStage: <span style={{ fontSize: '1rem', fontWeight: 'bold' }}>{r.Stage}</span>,
                Progress:
                    <span style={{
                        fontSize: '1rem', fontWeight: 'bold',
                        color: r.CollectionProgressStatus == 1 && r.ProgressPercent >= 30 ? 'red' : 'black'
                    }}>
                        {r.ProgressPercent} %
                    </span>,
                Status: [<Label style={{ backgroundColor: statusColor, color: 'white' }}>{status}</Label>,
                    confirmComponent],
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

    onChangeRate(val) {
        this.setState({ filterRate: val });
        this.filterReceivable(undefined, undefined, undefined, undefined, val);
    }

    statusFilterComp() {
        return <div className='col-sm-7 row' style={{ marginTop: '10px', float: 'left' }}>
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
                    <Label style={{ cursor: 'pointer', backgroundColor: s.color, color: 'white' }} onClick={() => {
                        let checked = !s.checked;
                        this.toggleStatus(s.category, checked);
                    }}>{`${s.category} (${s.value})`}</Label>
                </div>)}
            </div>
            <div className='col-sm-12 row rate-range-chooser'>
                <span className='col-sm-3'><b>Rate</b>:</span>
                <div className='col-sm-9'>
                    <InputRange
                        step={5}
                        style={{ margin: '10px 0px 10px 0px' }}
                        formatLabel={(val) => `${val} %`}
                        minValue={0}
                        maxValue={100}
                        value={this.state.filterRate}
                        onChange={this.onChangeRate}
                    />
                </div>
            </div>
            <div className='col-sm-12' style={{
                fontSize: '0.9rem',
                color: 'grey',
                textAlign: 'right',
                marginTop: '20px'
            }}>
                <i>Found {this.state.receivableList.filter(r => r.Display).length} receivable(s)</i>
            </div>
        </div>
    }
    managerFilterComp() {
        return <div className='col-sm-5' style={{ padding: '20px 20px 0px 0px', float: 'left' }}>
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
                sortable={false}
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
                <div className='col-sm-12 row justify-content-center align-self-center'
                    style={{ display: this.state.showFilter ? 'flex' : 'none' }}>
                    <Nav tabs className='col-sm-10'>
                        <NavItem>
                            <NavLink className={classnames({ active: true })}>
                                <Icon name='filter' />
                                Filter
                            </NavLink>
                        </NavItem>
                    </Nav>
                    <TabContent activeTab='1' style={{ paddingBottom: '20px', borderTop: 'none' }}
                        className='border-shadow col-sm-10 row justify-content-center'>
                        <TabPane tabId='1' className='col-sm-12 row justify-content-center align-self-center'>
                            <div style={{
                                margin: '10px 0px 0px 15px',
                                display: isManager ? 'block' : 'none'
                            }}>
                                <Link to='/receivable/recent-add'>Recent added receivables</Link>
                            </div>
                            <div style={{
                                position: 'absolute', top: '10px', right: 0
                            }}>
                                <Button icon='window minimize' color='primary' style={{ width: 'auto' }}
                                    onClick={() => {
                                        this.setState({ showFilter: false });
                                    }} />
                            </div>
                            {this.managerFilterComp()}
                            <div className='col-sm-6' style={{ float: 'left' }}>
                                <Segment compact>
                                    <Checkbox toggle label='Show not confirmed receivable?'
                                        checked={!this.state.getConfirmed}
                                        onChange={(e, data) => {
                                            let value = !data.checked;
                                            this.toggleConfirmed(value);
                                        }} />
                                </Segment>
                            </div>
                            {this.statusFilterComp()}
                        </TabPane>
                    </TabContent>
                </div >
                <div className='col-sm-12 hungdtq-header'>
                    <div className='float-right'>
                        <div className='btn btn-rcm-primary rcm-btn'
                            style={{ zIndex: 10, position: 'relative' }}
                            onClick={this.refreshData}>
                            <a><i class="fas fa-redo"></i></a>
                        </div>
                        <div className='btn btn-rcm-primary rcm-btn'
                            style={{ zIndex: 10, position: 'relative' }}
                            onClick={() => {
                                this.setState(pre => ({ showFilter: !pre.showFilter }));
                            }}>
                            <a><i class="fas fa-filter"></i></a>
                        </div>
                    </div>
                </div>
                <div className='col-sm-12 middle-content-table'>
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
            width: 270
        },
        {
            label: 'Debtor',
            field: 'DebtorName',
            width: 270
        },
        {
            label: 'Collector',
            field: 'CollectorName',
            width: 270
        },
        {
            label: 'Debt amount',
            field: 'DebtAmount',
            width: 270
        },
        {
            label: 'Start day',
            field: 'PayableDay',
            width: 200
        },
        {
            label: 'Stage',
            field: 'CurrentStage',
            width: 200
        },
        {
            label: 'Progress',
            field: 'Progress',
            width: 200
        },
        {
            label: 'Status',
            field: 'Status',
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
                        let rs = b.ProgressPercent - a.ProgressPercent;
                        if (rs == 0) {
                            return compareIntDate(b.PayableDay, a.PayableDay);
                        } else {
                            return rs;
                        }
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
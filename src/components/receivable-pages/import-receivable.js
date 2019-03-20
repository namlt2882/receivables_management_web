import React from 'react';
import { connect } from 'react-redux'
import { CustomerAction } from './../../actions/customer-action'
import { ProfileAction } from './../../actions/profile-action'
import { CollectorAction } from './../../actions/collector-action'
import XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import Component from '../common/component'
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { ReceivableService } from '../../services/receivable-service';
import { Container, Header, Divider, Form, Button, Step, Icon, Checkbox, Table, Label } from 'semantic-ui-react';
import { UserService } from '../../services/user-service';
import { ProfileService } from '../../services/profile-service'
import { CustomerService } from '../../services/customer-service';
import { ifNullElseString } from '../../utils/utility';
import { MDBDataTable } from 'mdbreact'
import { dateToInt } from '../../utils/time-converter';
import { UtilityService } from '../../services/utility-service';
import { numAsDate } from '../../utils/time-converter';
import { describeStatus, getStatusColor } from './detail/receivable-detail';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { DatePicker } from '@progress/kendo-react-dateinputs';
import { NotificationManager } from 'react-notifications';

class ImportReceivable extends Component {
    constructor(props) {
        super(props);
        let showRecent = this.props.showRecent;
        this.state = {
            receivableData: null,
            contactData: null,
            fileWarning: '',
            selectCollector: null,
            profileId: '-1',
            loadingForm: false,
            maxLoading: 4,
            step: showRecent ? 4 : 1,
            currentDate: dateToInt(new Date()),
            validatedData: null,
            insertedData: showRecent ? JSON.parse(localStorage.getItem('recent_inserted_data')) : null,
            customer: null
        }
        this.setCollector = this.setCollector.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.validateReceivables = this.validateReceivables.bind(this);
        this.increaseStep = this.increaseStep.bind(this);
        this.decreaseStep = this.decreaseStep.bind(this);
        this.insertReceivable = this.insertReceivable.bind(this);
        this.setPayableDay = this.setPayableDay.bind(this);
        this.isNewCustomer = this.isNewCustomer.bind(this);
        this.changeNewCustomerCode = this.changeNewCustomerCode.bind(this);
        this.isCustomerCodeValid = this.isCustomerCodeValid.bind(this);
        this.createCustomerThenIncreaseStep = this.createCustomerThenIncreaseStep.bind(this);
    }

    increaseStep() {
        this.setState(pre => ({ step: pre.step + 1 }))
    }
    decreaseStep() {
        this.setState(pre => ({ step: pre.step - 1 }))
    }

    componentDidMount() {
        document.title = 'Import receivables';
        available1();
        CustomerService.getAll().then(res => {
            this.props.fetchCustomers(res.data);
            this.incrementLoading();
        })
        UserService.getCollectors().then(res => {
            this.props.fetchCollectors(res.data);
            this.incrementLoading();
        })
        if (!this.props.showRecent) {
            ProfileService.getAll().then(res => {
                this.props.fetchProfiles(res.data);
                this.incrementLoading();
            })
            UtilityService.getServerDate().then(res => {
                let currentDate = parseInt(res.data);
                this.setState({ currentDate: currentDate });
                this.incrementLoading();
            })
        } else {
            this.incrementLoading(2);
        }
    }

    handleFile = (e) => {
        this.setLoadingForm(true);
        var rABS = true;// true: readAsBinaryString ; false: readAsArrayBuffer
        var files = e.target.files, f = files[0];
        var reader = new FileReader();
        reader.onload = (e) => {
            var data = e.target.result;
            if (!rABS) data = new Uint8Array(data);
            try {
                var workbook = XLSX.read(data, { type: rABS ? 'binary' : 'array' });
            } catch (err) {
                console.log(err);
                this.setState({ fileWarning: 'Fail when attempt to read this file! Please check again!' })
                return;
            }
            /* DO SOMETHING WITH workbook HERE */
            var receivableSheet = null;
            var contactSheet = null;
            try {
                receivableSheet = workbook.Sheets['Receivable'];
                contactSheet = workbook.Sheets['Contact'];
                if (receivableSheet === undefined || contactSheet === undefined) {
                    throw 'Wrong format'
                }
            } catch (err) {
                console.log(err);
                this.setState({ fileWarning: 'Wrong file format!' })
                return;
            }
            const receivableData = XLSX.utils.sheet_to_json(receivableSheet);
            const contactData = XLSX.utils.sheet_to_json(contactSheet);
            let tmp = this.mapContactToReceivable(receivableData, contactData);
            this.setState({
                receivableData: tmp,
                contactData: contactData
            })
            console.log(receivableData);
            console.log(contactData);
            this.setState({ fileWarning: '' })
            this.increaseStep();
            this.validateReceivables();
        }
        try {
            if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
        } catch (e) { }
        this.setLoadingForm(false);
    }

    mapContactToReceivable = (receivableData, contactData) => {
        receivableData.map((rei) => {
            rei.CollectorId = null;
            rei.Debtor = null;
            rei.Contacts = [];
            rei.Profile = this.state.selectedProfile;
            rei.Customer = this.state.selectedCustomer;
        })
        contactData.map((contact) => {
            if (contact.IsDebtor === true) {
                receivableData[contact.ReceivableNo - 1].Debtor = contact;
            }
            receivableData[contact.ReceivableNo - 1].Contacts.push(contact);
        });
        return receivableData;
    }

    setCollector(no, collectorId) {
        var validatedData = this.state.validatedData;
        validatedData.map((rei, i) => {
            if (i === no) {
                rei.CollectorId = collectorId;
                return true;
            }
            return false;
        });
        this.setState({ validatedData: validatedData })
    }

    setPayableDay(no, value) {
        var validatedData = this.state.validatedData;
        validatedData.map((rei, i) => {
            if (i === no) {
                if (value === null) {
                    rei.PayableDay = null;
                    rei.CollectorId = null;
                } else {
                    rei.PayableDay = value;
                }
            }
        });
        this.setState({ validatedData: validatedData })
    }

    validateReceivables() {
        this.setLoadingForm(true);
        let currentDate = this.state.currentDate.toString();
        let year = parseInt(currentDate.substring(0, 4));
        let month = parseInt(currentDate.substring(4, 6));
        let day = parseInt(currentDate.substring(6));
        let payableDay = '' + year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day);
        var list = this.state.receivableData.map((rei) => {
            return {
                "Contacts": rei.Contacts.map((contact) => {
                    let address = `${ifNullElseString(contact.AddressNumber)} ${ifNullElseString(contact.Street)} Street`;
                    if (address.trim() !== 'Street') {
                        address += `, `
                    } else {
                        address = '';
                    }
                    address += `District ${ifNullElseString(contact.District)}`
                    if (address.trim() !== 'District') {
                        address += `, `
                    } else {
                        address = '';
                    }
                    address += `${ifNullElseString(contact.City)} City`
                    if (address.trim() === 'City') {
                        address = '';
                    }
                    return {
                        "Type": contact.IsDebtor ? 0 : 1,
                        "IdNo": '' + ifNullElseString(contact.IdNo),
                        "Name": ifNullElseString(contact.Name),
                        "Phone": '' + ifNullElseString(contact.Phone),
                        "Address": address
                    }
                }),
                "PayableDay": currentDate,
                "ProfileId": this.state.profileId == '-1' ? null : parseInt(this.state.profileId),
                "CollectorId": rei.CollectorId,
                "PrepaidAmount": rei.PrepaidAmount,
                "DebtAmount": rei.DebtAmount,
                "CustomerId": this.state.customer.Id,
                "LocationId": null
            };
        })
        ReceivableService.validate(list).then(res => {
            let resData = res.data;
            resData.map((r) => {
                r.Contacts.map(c => {
                    delete c.ReceivableId;
                })
            })
            this.setState({
                validatedData: resData
            })
            this.setLoadingForm(false);
        }).catch(err => {
            alert('Service unavailable!');
        })
    }

    insertReceivable() {
        this.setLoadingForm(true);
        ReceivableService.create(this.state.validatedData).then(res => {
            let insertedData = res.data;
            let currentDate = this.state.currentDate;
            let customer = this.state.customer;
            let profile = this.props.profiles.filter(p => p.Id === parseInt(this.state.profileId)).map(p => p.Name);
            localStorage.setItem('recent_customer', customer);
            localStorage.setItem('recent_profile', profile);
            localStorage.setItem('recent_inserted_data', JSON.stringify(insertedData));
            localStorage.setItem('recent_inserted_date', currentDate);
            this.setState({
                insertedData: insertedData,
                loadingForm: false,
                step: this.state.step + 1
            })
            alert(`Import ${insertedData.length} receivable(s) successfully!`)
        })
    }

    updateProfile(e) {
        this.setState({ profileId: e.target.value });
    }

    updateCustomer(val) {
        this.setState({
            customer: val
        });
    }

    changeNewCustomerCode(e) {
        let val = e.target.value;
        let customer = this.state.customer;
        if (val) {
            val = val.replace(/\s/g, '');
            val = val.toUpperCase();
            e.target.value = val;
        }
        customer.Code = val;
        this.setState({ customer: customer });
    }

    isNewCustomer() {
        let customer = this.state.customer;
        if (customer) {
            return !customer.Id;
        } else return false;
    }

    isCustomerCodeValid() {
        if (!this.isNewCustomer()) {
            return true;
        }
        let customer = this.state.customer;
        let code = customer.Code;
        if (code === '' || !code) {
            return false
        }
        if (this.props.customers.find(c => c.Code === code)) {
            return false
        }
        return true
    }

    warningCustomerCode() {
        let customer = this.state.customer;
        let code = customer.Code;
        if (code === '') {
            return 'Code can not be empty'
        }
        if (this.props.customers.find(c => c.Code === code)) {
            return 'This code is already existed'
        }
        return null;
    }

    IsValidate() {
        if (this.state.validatedData === null) {
            return false;
        } else {
            var isValidated = !this.state.validatedData
                .some((r) => {
                    if (r.PayableDay) {
                        return r.CollectorId === null;
                    } else return false;
                });
            return isValidated;
        }
    }
    createCustomerThenIncreaseStep() {
        this.setState({ loadingForm: true });
        let customer = this.state.customer;
        let data = {
            Code: customer.Code,
            Name: customer.Name,
            Phone: '',
            Address: ''
        }
        CustomerService.create(data).then(res => {
            let newCustomer = res.data;
            customer.Id = newCustomer.Id;
            this.props.addCustomer(customer);
            this.setState({
                loadingForm: false,
                customer: customer
            });
            NotificationManager.success('New customer', `Customer ${customer.Name} has been created!`, 3000, () => { });
            this.increaseStep();
        }).catch(err => {
            window.alert('Service unavailable!')
            this.setState({ loadingForm: false });
        })
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        let customers = this.props.customers;
        let customer = this.state.customer;
        let profiles = this.props.profiles;
        let isValidate = this.IsValidate();
        let data2 = tableData2;
        if (this.state.insertedData !== null && this.state.step === 4) {
            data2 = pushData2(this.state.insertedData, this.props.collectors, this.props.customers);
        }
        let isNewCustomer = this.isNewCustomer();
        let codeValid = this.isCustomerCodeValid();
        return (<Container>
            <Header className='text-center'>Import receivable</Header>
            <Form loading={this.state.loadingForm} onSubmit={() => { }} className='col-sm-12 row justify-content-center align-self-center'>
                <Step.Group size='mini' className='col-sm-10' style={{ display: this.state.step === 4 ? 'none' : 'flex' }}>
                    <Step active={this.state.step === 1}>
                        <Icon name='info' />
                        <Step.Content>
                            <Step.Title>Choose customer and profile</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step active={this.state.step === 2}>
                        <Icon name='file' />
                        <Step.Content>
                            <Step.Title>Choose import file</Step.Title>
                        </Step.Content>
                    </Step>
                    <Step active={this.state.step === 3}>
                        <Icon name='download' />
                        <Step.Content>
                            <Step.Title>Insert</Step.Title>
                        </Step.Content>
                    </Step>
                </Step.Group>
                {/* START STEP 1 */}
                {/* Customer */}
                <div className='form-group col-sm-4' style={{ display: this.state.step === 1 ? 'block' : 'none' }}>
                    <label className='bold-text'>Customer</label>
                    {/* <select ref='selectCustomer' className='form-control col-sm-6' value={this.state.customerId}
                        onChange={this.updateCustomer}>
                        <option value={-1}>--</option>
                        {customers.map((customer) =>
                            <option value={customer.Id}>{customer.Name}</option>
                        )}
                    </select> */}
                    <ComboBox data={customers}
                        dataItemKey='Id'
                        textField='Name'
                        placeholder='Customer'
                        value={customer}
                        className='form-control'
                        allowCustom={true}
                        onChange={(e) => {
                            let val = e.target.value;
                            this.updateCustomer(val);
                        }} />
                    {isNewCustomer ?
                        [<label className='bold-text'><br />Code for new customer:&nbsp;{customer.Name}</label>,
                        <input type='text' className='form-control' value={customer.Code}
                            onChange={this.changeNewCustomerCode} />,
                        <span style={{ color: 'red' }}><i>{this.warningCustomerCode()}</i><br /></span>] : null}
                    <Button color='primary' className='margin-btn'
                        disabled={customer === null
                            || this.state.profileId === '-1' || !codeValid}
                        onClick={() => {
                            if (isNewCustomer) {
                                this.createCustomerThenIncreaseStep();
                            } else {
                                this.increaseStep();
                            }
                        }}>Next</Button>
                </div>
                {/* Profile */}
                <div className='form-group col-sm-4' style={{ display: this.state.step === 1 ? 'block' : 'none' }}>
                    <label className='bold-text'>Profile</label>
                    <select ref='selectProfile' className='form-control' value={this.state.profileId}
                        onChange={this.updateProfile}>
                        <option value='-1'>--</option>
                        {profiles.map((profile) => <option value={profile.Id}>{profile.Name}</option>)}
                    </select>
                </div>
                {/* END STEP 1 */}
                {!this.props.showRecent ?
                    <div className='col-sm-8' style={{ display: this.state.step !== 1 ? 'block' : 'none' }}>
                        <span><b>Customer</b>: {customer ? customer.Name : null}</span><br />
                        <span><b>Profile</b>: {profiles.filter(p => p.Id === parseInt(this.state.profileId)).map(p => p.Name)}</span>
                    </div> :
                    <div className='col-sm-8' style={{ display: this.state.step !== 1 ? 'block' : 'none' }}>
                        <span><b>Customer</b>: {localStorage.getItem('recent_customer')}</span><br />
                        <span><b>Profile</b>: {localStorage.getItem('recent_profile')}</span>
                    </div>
                }
                {/* START STEP 2 */}
                {/* File */}
                <div className='form-group col-sm-8' style={{ display: this.state.step === 2 ? 'block' : 'none' }}>
                    <label className='bold-text'>Files</label>
                    <input type='file' onChange={this.handleFile} />
                    <span className='warning-text'>{this.state.fileWarning}<br /></span>
                    <Button color='secondary' className='margin-btn' onClick={this.decreaseStep}>Back</Button>
                </div>
                {/* END STEP 2 */}
                {/* START STEP 3 */}
                {/* Action */}
                <div className='col-sm-8' style={{ display: this.state.step === 3 ? 'block' : 'none' }}>
                    <Button color='primary'
                        disabled={!isValidate} onClick={this.insertReceivable}>Save</Button>
                </div>
                {/* END STEP 3 */}
                {this.state.validatedData !== null && this.state.step === 3 ?
                    <Container>
                        <Divider />
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>No</Table.HeaderCell>
                                    <Table.HeaderCell>Debtor</Table.HeaderCell>
                                    <Table.HeaderCell>Debt Amount</Table.HeaderCell>
                                    <Table.HeaderCell>Prepaid Amount</Table.HeaderCell>
                                    <Table.HeaderCell>Start date</Table.HeaderCell>
                                    <Table.HeaderCell>Collector</Table.HeaderCell>
                                    <Table.HeaderCell>Pending</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {this.state.validatedData.map((r, i) => {
                                    let debtor = r.Contacts.find(c => c.Type === 0);
                                    let isWaiting = r.PayableDay === undefined || r.PayableDay === null;
                                    let date = null;
                                    let min = new Date(numAsDate(this.state.currentDate));
                                    if (!isWaiting) {
                                        date = new Date(numAsDate(r.PayableDay));
                                    }
                                    return <Table.Row>
                                        <Table.Cell>{i + 1}</Table.Cell>
                                        <Table.Cell>{debtor ? debtor.Name : null}</Table.Cell>
                                        <Table.Cell>{r.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Table.Cell>
                                        <Table.Cell>{r.PrepaidAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Table.Cell>
                                        <Table.Cell>
                                            {!isWaiting ? <DatePicker min={min} value={date} onChange={(e) => {
                                                let value = e.target.value;
                                                this.setPayableDay(i, dateToInt(value));
                                            }} /> : null}
                                        </Table.Cell>
                                        <Table.Cell>
                                            {!isWaiting ? <ConnectedSelectCollector
                                                reiNo={i}
                                                collectorId={r.CollectorId}
                                                setCollector={this.setCollector} /> : null}
                                        </Table.Cell>
                                        <Table.Cell>
                                            <PendingCheckbox no={i} currentDate={this.state.currentDate} isWaiting={isWaiting}
                                                setPayableDay={this.setPayableDay} />
                                        </Table.Cell>
                                    </Table.Row>
                                })}
                            </Table.Body>
                        </Table>
                    </Container> : null}
                {/* START STEP 4 */}
                {this.state.insertedData !== null && this.state.step === 4 ?
                    <Container>
                        <Divider />
                        <MDBDataTable
                            className='hide-last-row'
                            striped
                            bordered
                            data={data2} />
                    </Container> : null}
            </Form>
        </Container>);
    }
}

class PendingCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isWaiting: this.props.isWaiting
        }
    }
    render() {

        return (<div>
            <Checkbox label='Is Pending?' checked={this.state.isWaiting}
                onChange={(e, data) => {
                    if (data.checked) {
                        this.props.setPayableDay(this.props.no, null);
                    } else {
                        this.props.setPayableDay(this.props.no, this.props.currentDate);
                    }
                    this.setState({ isWaiting: data.checked });
                }} />
        </div>);
    }
}

class SelectCollector extends React.Component {

    constructor(props) {
        super(props);
        this.state = {}
        this.onChangeCollector = this.onChangeCollector.bind(this);
        this.setCollector = this.setCollector.bind(this);
    }

    onChangeCollector = (e) => {
        var collector = e.target.value;
        if (collector != undefined && collector != null) {
            this.setCollector(collector.Id);
        } else {
            this.setCollector(null);
        }
    }

    setCollector = (id) => {
        this.props.setCollector(this.props.reiNo, id);
    }

    render() {
        return (<div className='full-combobox-holder'>
            <ComboBox data={this.props.collectors} allowCustom={false}
                textField='DisplayName2'
                placeholder='Collector'
                onChange={this.onChangeCollector} />
        </div>)
    }
}

const pushData2 = (receivableList, collectorList, customerList) => {
    let rows = [];
    let data = { ...tableData2 };
    if (receivableList) {
        rows = receivableList.map((r, i) => {
            let debtor = r.Contacts.find(c => c.Type === 0);
            let customer = customerList.find(cu => cu.Id === r.CustomerId);
            let collector = null;
            if (r.AssignedCollectors && r.AssignedCollectors.length > 0) {
                collector = collectorList.find(co => co.Id === r.AssignedCollectors[0].UserId)
            }
            let status = describeStatus(r.CollectionProgress.Status);
            let statusColor = getStatusColor(r.CollectionProgress.Status);
            return {
                No: (i + 1),
                DebtorName: debtor ? debtor.Name : null,
                CustomerName: customer ? customer.Name : null,
                DebtAmount: r.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 }),
                PayableDay: numAsDate(r.PayableDay),
                Collector: collector ? collector.DisplayName : null,
                Status: <Label color={statusColor}>{status}</Label>,
                action: <Link target='_blank' to={`/receivable/${r.Id}/view`}>View</Link>
            }
        });
    }
    data.rows = rows;
    return data;
}

const tableData2 = {
    columns: [
        {
            label: '',
            field: 'No',
            width: 150
        },
        {
            label: 'Debtor name',
            field: 'DebtorName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Customer name',
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
            label: 'Collector',
            field: 'Collector',
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
            label: 'Action',
            field: 'action',
            width: 150
        }
    ],
    rows: []
}

const mapStateToProps = state => {
    return {
        customers: state.customers,
        profiles: state.profiles,
        collectors: state.collectors
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchCustomers: (customers) => {
            dispatch(CustomerAction.setCustomers(customers));
        },
        fetchProfiles: (profiles) => {
            dispatch(ProfileAction.setProfiles(profiles))
        },
        fetchCollectors: (collectors) => {
            collectors.forEach(c => {
                c.DisplayName = `${c.FirstName} ${c.LastName} (${c.Username})`;
                c.DisplayName2 = `${c.FirstName} ${c.LastName} (${c.Username} - ${c.NumberOfAssignedReceivables})`;
            })
            collectors.sort((c1, c2) => -(c2.NumberOfAssignedReceivables - c1.NumberOfAssignedReceivables))
            dispatch(CollectorAction.setCollectors(collectors));
        },
        addCustomer: (customer) => {
            dispatch(CustomerAction.addCustomer(customer));
        }
    }
}
const ConnectedSelectCollector = connect(mapStateToProps)(SelectCollector);
export default connect(mapStateToProps, mapDispatchToProps)(ImportReceivable);
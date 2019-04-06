import { DatePicker } from '@progress/kendo-react-dateinputs';
import { ComboBox } from '@progress/kendo-react-dropdowns';
import { MDBDataTable } from 'mdbreact';
import React from 'react';
import { NotificationManager } from 'react-notifications';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Modal, ModalBody, ModalFooter } from 'reactstrap';
import { Button, Checkbox, Container, Divider, Form, Icon, Label, Step } from 'semantic-ui-react';
import XLSX from 'xlsx';
import { convertCurrency } from '../../reducers/match-point-reducer';
import { CustomerService } from '../../services/customer-service';
import { PointService } from '../../services/point-service';
import { ProfileService } from '../../services/profile-service';
import { ReceivableService } from '../../services/receivable-service';
import { UserService } from '../../services/user-service';
import { UtilityService } from '../../services/utility-service';
import { dateToInt, numAsDate } from '../../utils/time-converter';
import { IdGenerator, ifNullElseString } from '../../utils/utility';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { errorAlert, successAlert } from '../common/my-menu';
import EditProfile from '../profile-pages/edit-profile';
import { CollectorAction } from './../../actions/collector-action';
import { CustomerAction } from './../../actions/customer-action';
import { MatchPointAction } from './../../actions/match-point-action';
import { ProfileAction } from './../../actions/profile-action';
import { describeStatus, getStatusColor } from './detail/receivable-detail';
import { TopPopup } from '../common/top-popup';

class ImportReceivable extends Component {
    constructor(props) {
        super(props);
        let showRecent = this.props.showRecent;
        this.state = {
            isProfileModified: false,
            openModal: false,
            modalContent: null,
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
            customer: null,
            isLoadingCpp: false
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
        this.getAllCollectorCpp = this.getAllCollectorCpp.bind(this);
        this.skipStep1 = this.skipStep1.bind(this);
        this.viewProfileDetail = this.viewProfileDetail.bind(this);
        this.closeProfileDetail = this.closeProfileDetail.bind(this);
    }
    //#region Step
    increaseStep() {
        this.setState(pre => ({ step: pre.step + 1 }))
    }
    decreaseStep() {
        this.setState(pre => ({ step: pre.step - 1 }))
    }
    //#endregion
    componentDidMount() {
        document.title = 'Import receivables';
        available1();
        UserService.getCollectors().then(res => {
            this.props.setCollectors(res.data);
            this.incrementLoading();
        })
        if (!this.props.showRecent) {
            CustomerService.getAll().then(res => {
                this.props.setCustomers(res.data);
                this.incrementLoading();
            })
            ProfileService.getAll().then(res => {
                this.props.setProfiles(res.data);
                this.incrementLoading();
            })
            UtilityService.getServerDate().then(res => {
                let currentDate = parseInt(res.data);
                this.setState({ currentDate: currentDate });
                this.incrementLoading();
            })
            this.getAllCollectorCpp();
        } else {
            this.incrementLoading(3);
        }
    }
    //#region File
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
    //#endregion
    setCollector(no, collectorId) {
        var validatedData = this.state.validatedData;
        validatedData.map((rei, i) => {
            if (i === no) {
                this.props.changeCollector(rei.CollectorId, collectorId);
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
                    this.props.changeCollector(rei.CollectorId, null);
                    rei.PayableDay = null;
                    rei.CollectorId = null;
                } else {
                    rei.PayableDay = value;
                    let matchData = this.props.matchData;
                    if (matchData.isLoaded) {
                        matchData.suggestCollectorForReceivables([{
                            id: i,
                            amount: rei.convertedAmount
                        }], (receivableId, collectorId) => {
                            if (collectorId) {
                                rei.CollectorId = collectorId;
                            }
                        });
                        this.props.setMatchData(matchData);
                    }
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
            // start suggest collector
            let matchData = this.props.matchData;
            if (matchData.isLoaded) {
                matchData.suggestCollectorForReceivables(resData.map((r, i) => {
                    let amount = r.DebtAmount - r.PrepaidAmount;
                    amount = convertCurrency(amount); // Convert currency to dollar
                    r.convertedAmount = amount;
                    return {
                        id: i,
                        amount: amount
                    }
                }), (receivableId, collectorId) => {
                    if (collectorId) {
                        let foundRecei = resData[receivableId];
                        foundRecei.CollectorId = collectorId;
                    }
                });
                this.props.setMatchData(matchData);
            }
            this.setState({
                validatedData: resData
            })
            //end suggest collector
            this.setLoadingForm(false);
        }).catch(err => {
            console.error(err);
            errorAlert('Service unavailable!');
        })
    }

    insertReceivable() {
        this.setLoadingForm(true);
        ReceivableService.create(this.state.validatedData).then(res => {
            let insertedIds = res.data;
            let currentDate = this.state.currentDate;
            let customer = this.state.customer;
            let profile = this.props.profiles.filter(p => p.Id === parseInt(this.state.profileId)).map(p => p.Name);
            ReceivableService.getReceivablesByIds(insertedIds).then(res1 => {
                let insertedData = res1.data;
                localStorage.setItem('recent_profile', profile);
                localStorage.setItem('recent_inserted_data', JSON.stringify(insertedData));
                localStorage.setItem('recent_inserted_date', currentDate);
                this.setState({
                    insertedData: insertedData,
                    loadingForm: false,
                    step: this.state.step + 1
                })
                successAlert(`Import ${insertedIds.length} receivable(s) successfully!`)
            }).catch(err => {
                console.log(err);
                errorAlert('Fail in following steps after inserted receivables! Please try again later!');
            })
        }).catch(err => {
            console.log(err);
            errorAlert('Fail to inserted receivables! Please try again later!');
        })
    }

    updateProfile(e) {
        if (this.state.isProfileModified) {
            if (!window.confirm('The profile has been modified, if you change profile now all changes will be lost. Do you want to change profile?')) {
                // not change modified profile
                return;
            } else {
                let profiles = this.props.profiles;
                profiles = profiles.filter(p => p.Id >= 0);
                this.props.setProfiles(profiles);
            }
        }
        this.setState({ profileId: e.target.value, isProfileModified: false });
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
            NotificationManager.success('', `Customer ${customer.Name} has been created!`, 3000, () => { });
            this.increaseStep();
        }).catch(err => {
            errorAlert('Service unavailable!')
            this.setState({ loadingForm: false });
        })
    }
    //#region Suggestion
    getAllCollectorCpp() {
        this.setState({ isLoadingCpp: true });
        PointService.getAllCollectorCpp().then(res => {
            let data = res.data;
            this.props.setCppList(data);
            this.setState({ isLoadingCpp: false });
        }).catch(err => {
            console.error(err);
            errorAlert('Collector suggestion feature is OFF!');
            this.setState({ isLoadingCpp: false });
        })
    }
    //#endregion
    skipStep1(isNewCustomer) {
        if (isNewCustomer) {
            this.createCustomerThenIncreaseStep();
        } else {
            this.increaseStep();
        }
    }
    //#region Modify profile
    viewProfileDetail(e) {
        e.preventDefault();
        let profileId = parseInt(this.state.profileId);
        if (profileId < -1) {
            profileId = undefined;
        } else {
            // check loaded profiles
            let process = this.props.process;
            if (process && process.Id === profileId) {
                profileId = undefined;
            }
        }
        let modalContent = <EditProfile key={profileId} profileId={profileId} onChange={() => {
            this.setState({ isProfileModified: true })
        }} onSave={(profile) => {
            if (profile._isModified) {
                return;
            } else {
                profile._isModified = true;
            }
            // create new Id
            let newId = IdGenerator.generateId();
            if (newId == -1) {
                newId--;
            }
            profile.Id = newId;
            profile.Name = `${profile.Name} (modified)`;
            // set selected profile
            this.setState({ profileId: newId });
            // update profile list
            let newProfile = {
                Id: newId,
                Name: profile.Name
            }
            let profiles = this.props.profiles;
            profiles.push(newProfile);
            this.props.setProfiles(profiles);
        }} isPopup={true} />;
        this.setState({ openModal: true, modalContent: modalContent });

    }
    closeProfileDetail() {
        if (!this.props.processStatus.readOnly) {
            window.alert('Profile has been modified recently, please save changes first!');
            return;
        }
        this.setState({ openModal: false, modalContent: null });
    }
    //#endregion
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
            data2 = pushData2(this.state.insertedData, this.props.collectors);
        }
        let isNewCustomer = this.isNewCustomer();
        let codeValid = this.isCustomerCodeValid();
        let cacheData = localStorage.getItem('recent_inserted_data');
        return (<Container className='col-sm-12 row'>
            <div className="hungdtq-header"><h1>{this.props.showRecent ? 'Recently added receivables' : 'Import receivable'}</h1>
                <Divider />
            </div>
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
                <div className='col-sm-3' style={{ display: this.state.step === 1 ? 'block' : 'none' }}>
                    <label className='bold-text'>Partner</label>
                    <ComboBox data={customers}
                        dataItemKey='Id'
                        textField='Name'
                        placeholder='Partner'
                        value={customer}
                        className='form-control'
                        allowCustom={true}
                        onChange={(e) => {
                            let val = e.target.value;
                            this.updateCustomer(val);
                        }} />
                    {isNewCustomer ?
                        [<label className='bold-text'><br />Code for new Partner:&nbsp;{customer.Name}</label>,
                        <input type='text' className='form-control' value={customer.Code}
                            onChange={this.changeNewCustomerCode} />,
                        <span style={{ color: 'red' }}><i>{this.warningCustomerCode()}</i><br /></span>] : null}
                    <Button color='primary' className='margin-btn'
                        loading={this.state.isLoadingCpp}
                        disabled={this.state.isLoadingCpp || (customer === null
                            || this.state.profileId === '-1' || !codeValid)}
                        onClick={() => {
                            this.skipStep1(isNewCustomer);
                        }}>Next</Button>
                    {this.state.isLoadingCpp ? <i>Loading suggestion data...</i> : null}
                </div>
                {/* Profile */}
                <div className='col-sm-4 row' style={{ display: this.state.step === 1 ? 'flex' : 'none' }}>
                    <div className='col-sm-10'>
                        <label className='bold-text'>Profile</label>
                        <select ref='selectProfile' className='ui input' value={this.state.profileId}
                            onChange={this.updateProfile}>
                            <option value='-1'>--</option>
                            {profiles.map((profile) => <option value={profile.Id}>{profile.Name}</option>)}
                        </select>
                    </div>
                    <div className='col-sm-2' style={{ marginTop: '30px', display: this.state.profileId != -1 ? 'block' : 'none' }}>
                        <a href='' onClick={this.viewProfileDetail}>Detail</a>
                    </div>
                </div>
                <Modal isOpen={this.state.openModal} className='big-modal'>
                    <ModalBody>
                        {this.state.modalContent}
                    </ModalBody>
                    <ModalFooter>
                        <Button color='secondary' onClick={this.closeProfileDetail}>Close</Button>
                    </ModalFooter>
                </Modal>
                {/* END STEP 1 */}
                {!this.props.showRecent ?
                    <div className='col-sm-8' style={{ display: this.state.step !== 1 ? 'block' : 'none' }}>
                        <span><b>Profile</b>: {profiles.filter(p => p.Id === parseInt(this.state.profileId)).map(p => p.Name)}</span>
                    </div> :
                    (cacheData ? <div className='col-sm-8' style={{ display: this.state.step !== 1 ? 'block' : 'none' }}>
                        <span><b>Profile</b>: {localStorage.getItem('recent_profile')}</span>
                    </div> : <span style={{ fontSize: '2rem' }}>
                            No new receivable recently!
                            <Button color='primary' style={{ marginLeft: '20px' }}
                                onClick={() => { this.props.history.push('/receivable/add') }}>Add new</Button>
                        </span>)
                }
                {/* START STEP 2 */}
                {/* File */}
                <div className='form-group col-sm-8' style={{ display: this.state.step === 2 ? 'block' : 'none' }}>
                    <label className='bold-text'>Files</label>
                    <input type='file' onChange={this.handleFile} />
                    <span className='warning-text'>{this.state.fileWarning}<br /></span>
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
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>Partner</th>
                                    <th>Debtor</th>
                                    <th>Debt Amount</th>
                                    <th>Start date</th>
                                    <th>Collector</th>
                                    <th>Pending</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.validatedData.map((r, i) => {
                                    let debtor = r.Contacts.find(c => c.Type === 0);
                                    let isWaiting = r.PayableDay === undefined || r.PayableDay === null;
                                    let date = null;
                                    let min = new Date(numAsDate(this.state.currentDate));
                                    if (!isWaiting) {
                                        date = new Date(numAsDate(r.PayableDay));
                                    }
                                    let customer = this.props.customers.find(c => c.Id === r.CustomerId);
                                    return <tr>
                                        <td>{i + 1}</td>
                                        <td>{customer ? customer.Name : null}</td>
                                        <td>{debtor ? debtor.Name : null}</td>
                                        <td>{(r.DebtAmount - r.PrepaidAmount).toLocaleString(undefined, { minimumFractionDigits: 0 })}</td>
                                        <td ref={`datepicker-${i}`} style={{ boxSizing: 'border-box' }}>
                                            {!isWaiting ? <DatePicker popup={TopPopup}
                                                popupSettings={{ appendTo: this.refs[`datepicker-${i}`] }} min={min} value={date} onChange={(e) => {
                                                    let value = e.target.value;
                                                    this.setPayableDay(i, dateToInt(value));
                                                }} /> : null}
                                        </td>
                                        <td className='suggested'>
                                            {!isWaiting ? <ConnectedSelectCollector
                                                reiNo={i}
                                                collectorId={r.CollectorId}
                                                setCollector={this.setCollector}
                                                convertedAmount={r.convertedAmount} /> : null}
                                        </td>
                                        <td>
                                            <PendingCheckbox no={i} currentDate={this.state.currentDate} isWaiting={isWaiting}
                                                setPayableDay={this.setPayableDay} />
                                        </td>
                                    </tr>
                                })}
                            </tbody>
                        </table>
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
        let collectorId = this.props.collectorId;
        let selectedCollector = null;
        if (collectorId) {
            selectedCollector = this.props.collectors.find(c => c.Id === collectorId);
        }
        let matchData = this.props.matchData;
        let convertedAmount = this.props.convertedAmount;
        let suggestedCollector = [];
        let selectedCpp;
        if (convertedAmount) {
            let series = matchData.matchSeries.find(series => series.isMatch(convertedAmount));
            selectedCpp = series.cppModels.find(cpp => cpp.CollectorId === collectorId);
            let maxCpp = series.cppModels.length;
            if (maxCpp > 4) {
                maxCpp = 4;
            }
            suggestedCollector = series.cppModels.slice(0, maxCpp);
            suggestedCollector.forEach(sc => {
                let found = this.props.collectors.find(c => c.Id === sc.CollectorId);
                if (found) {
                    sc._collector = found;
                }
            })
        }
        return (<div className='full-combobox-holder suggtion-holder'>
            <div className={`suggested-item ${matchData.isLoaded ? 'on' : ''}`}>
                {suggestedCollector.length > 0 ?
                    <div>
                        <table style={{ width: '100%', fontSize: '0.8rem' }}>
                            {suggestedCollector.map(sc => <tr>
                                <td>{`${sc._collector.FirstName} ${sc._collector.LastName}`}</td>
                                <td>CPP:{sc.CPP.toFixed(2)}</td>
                                <td>CR:{sc.CurrentReceivable}</td>
                                <td>
                                    {collectorId === sc.CollectorId ?
                                        <Icon bordered inverted name='check' color='green' />
                                        : <Button color='primary' onClick={() => {
                                            this.setCollector(sc.CollectorId);
                                        }}>Choose</Button>}
                                </td>
                            </tr>)}
                        </table>
                    </div>
                    : <span>Not found any match collector!</span>}
            </div>
            <ComboBox data={this.props.collectors} allowCustom={false}
                defaultValue={selectedCollector}
                dataItemKey='Id'
                textField='DisplayName2'
                placeholder='Collector'
                onChange={this.onChangeCollector} />
            <div className='choosen-collector-info'>
                <span style={{ display: collectorId ? 'block' : 'none' }}>
                    <span style={{ color: 'red' }}>CPP</span>: {selectedCpp ? selectedCpp.CPP.toFixed(2) : ''} | <span style={{ color: 'blue' }}>Current receivable</span>: {selectedCpp ? selectedCpp.CurrentReceivable : ''}
                </span>
            </div>
        </div>)
    }
}

const pushData2 = (receivableList, collectorList) => {
    let rows = [];
    let data = { ...tableData2 };
    if (receivableList) {
        rows = receivableList.map((r, i) => {
            let collector = null;
            collector = collectorList.find(co => co.Id === r.AssignedCollectorId)
            let status = describeStatus(r.CollectionProgressStatus);
            let statusColor = getStatusColor(r.CollectionProgressStatus);
            return {
                No: (i + 1),
                CustomerName: r.CustomerName,
                DebtorName: r.DebtorName,
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
            label: 'Partner',
            field: 'CustomerName',
            sort: 'asc',
            width: 270
        },
        {
            label: 'Debtor name',
            field: 'DebtorName',
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
        collectors: state.collectors,
        matchData: state.matchData,
        process: state.process,
        processStatus: state.processStatus
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setCustomers: (customers) => {
            dispatch(CustomerAction.setCustomers(customers));
        },
        setProfiles: (profiles) => {
            dispatch(ProfileAction.setProfiles(profiles))
        },
        setCollectors: (collectors) => {
            collectors.forEach(c => {
                c.DisplayName = `${c.FirstName} ${c.LastName}`;
                c.DisplayName2 = `${c.FirstName} ${c.LastName} (${c.Username})`;
            })
            collectors.sort((c1, c2) => -(c2.NumberOfAssignedReceivables - c1.NumberOfAssignedReceivables))
            dispatch(CollectorAction.setCollectors(collectors));
        },
        addCustomer: (customer) => {
            dispatch(CustomerAction.addCustomer(customer));
        },
        setMatchData: (matchData) => {
            dispatch(MatchPointAction.setMatchData(matchData));
        },
        setCppList: (cppList) => {
            dispatch(MatchPointAction.setCppList(cppList));
        },
        changeCollector: (oldCollectorId, newCollectorId) => {
            dispatch(MatchPointAction.changeCollector(oldCollectorId, newCollectorId));
        }
    }
}
const ConnectedSelectCollector = connect(mapStateToProps, mapDispatchToProps)(SelectCollector);
export default connect(mapStateToProps, mapDispatchToProps)(ImportReceivable);
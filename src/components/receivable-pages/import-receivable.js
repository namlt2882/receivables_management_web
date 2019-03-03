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
import { Container, Header, Table, Divider, Form } from 'semantic-ui-react';
import { UserService } from '../../services/user-service';
import { ProfileService } from '../../services/profile-service'
import { CustomerService } from '../../services/customer-service';

class ImportReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receivableData: null,
            contactData: null,
            fileWarning: '',
            selectCollector: null,
            profileId: '-1',
            customerId: '-1',
            loadingForm: false,
            maxLoading: 3
        }
        this.setCollector = this.setCollector.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.insertReceivables = this.insertReceivables.bind(this);
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
        ProfileService.getAll().then(res => {
            this.props.fetchProfiles(res.data);
            this.incrementLoading();
        })
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

            this.setState({
                receivableData: this.mapContactToReceivable(receivableData, contactData),
                contactData: contactData
            })
            console.log(receivableData);
            console.log(contactData);
            this.setState({ fileWarning: '' })
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
        var receivableData = this.state.receivableData;
        receivableData.some((rei) => {
            if (rei.No === no) {
                rei.CollectorId = collectorId;
                return true;
            }
            return false;
        });
        this.setState({ receivableData: receivableData })
    }

    insertReceivables() {
        this.setLoadingForm(true);
        let currentDay = new Date();
        let year = currentDay.getFullYear();
        let month = currentDay.getMonth() + 1;
        let day = currentDay.getDate();
        let payableDay = '' + year + (month < 10 ? '0' + month : month) + (day < 10 ? '0' + day : day);
        var list = this.state.receivableData.map((rei) => {
            return {
                "Contacts": rei.Contacts.map((contact) => {
                    return {
                        "Type": contact.IsDebtor ? 0 : 1,
                        "IdNo": '' + contact.IdNo,
                        "Name": contact.Name,
                        "Phone": '' + contact.Phone,
                        "Address": `${contact.AddressNumber} ${contact.Street}, ${contact.District}, ${contact.City}`
                    }
                }),
                "PayableDay": payableDay,
                "ProfileId": this.state.profileId == '-1' ? null : parseInt(this.state.profileId),
                "CollectorId": rei.CollectorId,
                "PrepaidAmount": rei.PrepaidAmount,
                "DebtAmount": rei.DebtAmount,
                "CustomerId": this.state.customerId == '-1' ? null : parseInt(this.state.customerId),
                "LocationId": null
            };
        })
        this.props.insertReceivables(list).then(res => {
            this.setLoadingForm(true);
            alert('Insert successfully!')
            window.location.href = '/receivable';
        });
    }

    updateProfile(e) {
        this.setState({ profileId: e.target.value });
    }

    updateCustomer(e) {
        this.setState({ customerId: e.target.value });
    }

    IsValidate() {
        if (this.state.customerId == '-1') {
            return false;
        }
        if (this.state.profileId == '-1') {
            return false;
        }
        if (this.state.receivableData == null) {
            return false;
        } else {
            var validateCollector = !this.state.receivableData.some((rei) => rei.CollectorId == null);
            return validateCollector;
        }
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
        var customers = this.props.customers;
        var profiles = this.props.profiles;
        var isValidate = this.IsValidate();
        return (<div>
            <Container>
                <Header className='text-center'>Import receivable</Header>
                <Form loading={this.state.loadingForm} onSubmit={() => { }} className='row justify-content-center align-self-center'>
                    {/* Customer */}
                    <div className='form-group col-sm-4'>
                        <label className='bold-text'>Customer:</label>
                        <select className='form-control col-sm-6' value={this.state.customerId}
                            onChange={this.updateCustomer}>
                            <option value={-1}>--</option>
                            {customers.map((customer) =>
                                <option value={customer.Id}>{customer.Name}</option>
                            )}
                        </select>
                    </div>
                    {/* Profile */}
                    <div className='form-group col-sm-4'>
                        <label className='bold-text'>Profile:</label>
                        <select className='form-control' value={this.state.profileId}
                            onChange={this.updateProfile}>
                            <option value='-1'>--</option>
                            {profiles.map((profile) => <option value={profile.Id}>{profile.Name}</option>)}
                        </select>
                    </div>
                    {/* File */}
                    <div className='form-group col-sm-8'>
                        <label className='bold-text'>Files:</label>
                        <input type='file' onChange={this.handleFile} />
                        <span className='warning-text'>{this.state.fileWarning}</span>
                    </div>
                    {/* Action */}
                    <div className='col-sm-8'>
                        <button className='btn btn-primary' onClick={this.insertReceivables}
                            disabled={!isValidate}>Save</button>
                        <button className="btn btn-default"><Link to="/receivable">Cancel</Link></button>
                    </div>
                    {this.state.receivableData === null ? null : <div className='panel panel-primary'>
                        <Container>
                            <Divider />
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>No</Table.HeaderCell>
                                        <Table.HeaderCell>Debt Amount</Table.HeaderCell>
                                        <Table.HeaderCell>Prepaid Amount</Table.HeaderCell>
                                        <Table.HeaderCell>Debtor</Table.HeaderCell>
                                        <Table.HeaderCell>Contacts</Table.HeaderCell>
                                        <Table.HeaderCell>Collector</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.state.receivableData.map((rei) => {
                                        var index = -1;
                                        return <Table.Row>
                                            <Table.Cell>{rei.No}</Table.Cell>
                                            <Table.Cell>{rei.DebtAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Table.Cell>
                                            <Table.Cell>{rei.PrepaidAmount.toLocaleString(undefined, { minimumFractionDigits: 0 })}</Table.Cell>
                                            <Table.Cell>{rei.Debtor !== null ? rei.Debtor.Name : null}</Table.Cell>
                                            <Table.Cell>{rei.Contacts.map((contact) => {
                                                if (contact.IsDebtor) {
                                                    return null;
                                                }
                                                index++;
                                                if (index > 0) {
                                                    return ', ' + contact.Name;
                                                }
                                                return contact.Name;
                                            })}</Table.Cell>
                                            <Table.Cell>
                                                {/* Do not has collector */}
                                                <SelectCollector collectors={this.props.collectors}
                                                    receivable={rei}
                                                    setCollector={this.setCollector} />
                                            </Table.Cell>
                                        </Table.Row>
                                    })}
                                </Table.Body>
                            </Table>
                        </Container>
                    </div>}
                </Form>
            </Container>
        </div>);
    }
}

class SelectCollector extends Component {

    constructor(props) {
        super(props);
        this.state = {
            collectorId: '-1'
        }
        this.setCollector = this.setCollector.bind(this);
    }

    onChangeCollector = (e) => {
        var id = e.target.value;
        if (id === '-1') {
            this.setState({
                collectorId: '-1'
            })
            this.setCollector(null);
        } else {
            this.props.collectors.some((collector) => {
                if (collector.Id === id) {
                    this.setState({
                        collectorId: collector.Id
                    });
                    return true;
                }
                return false;
            })
            this.setCollector(id);
        }
    }

    setCollector = (id) => {
        this.props.setCollector(this.props.receivable.No, id);
    }

    render() {
        var collectorId = this.state.collectorId;
        return (<div className='form-group'>
            <select className='form-control' value={collectorId}
                onChange={this.onChangeCollector}>
                <option value='-1'>--</option>
                {this.props.collectors.map((collector) =>
                    <option value={collector.Id}>
                        {collector.FirstName + collector.LastName}
                    </option>)}
            </select>
        </div>)
    }
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
            dispatch(CollectorAction.setCollectors(collectors));
        },
        insertReceivables: (list) => {
            return ReceivableService.create(list).catch(err => {
                alert('Service unavailable!');
            })
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportReceivable);
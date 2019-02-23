import React, { Component } from 'react';
import { connect } from 'react-redux'
import { CustomerRequest } from './../../actions/CustomerAction'
import { ProfileRequest } from './../../actions/ProfileActions'
import { CollectorRequest } from './../../actions/CollectorAction'
import XLSX from 'xlsx';
import { Link } from 'react-router-dom';
import { ReceivableRequest } from '../../actions/ReceivableAction';
import { doWithFirstOne } from '../../utils/Utility';

class ImportReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receivableData: null,
            contactData: null,
            fileWarning: '',
            selectCollector: null,
            profileId: '-1',
            customerId: '-1'
        }
        this.setCollector = this.setCollector.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
        this.updateCustomer = this.updateCustomer.bind(this);
        this.insertReceivables = this.insertReceivables.bind(this);
    }

    componentDidMount() {
        this.props.fetchAllProfiles();
        this.props.fetchCustomers();
        this.props.fetchCollectors();
    }

    handleFile = (e) => {
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
        if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
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
        var list = this.state.receivableData.map((rei) => {
            var payableDay = parseInt('' + rei.Year +
                (rei.Month < 10 ? '0' : '') + rei.Month +
                (rei.Day < 10 ? '0' : '') + rei.Day);
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
        this.props.insertReceivables(list);
        alert('Insert success!');
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
        var customers = this.props.customers;
        var profiles = this.props.profiles;
        var isValidate = this.IsValidate();
        return (<div>
            <div className='row'>
                {/* Action */}
                <div className='col-sm-12'>
                    <div className='panel-action'>
                        <div>
                            <button className='btn btn-primary' onClick={this.insertReceivables}
                                disabled={!isValidate}>Save</button>
                            <button className="btn btn-default"><Link to="/receivable">Cancel</Link></button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='panel panel-primary'>
                <div className='panel-heading'>
                    <div className='panel-title text-center'>Import receivable</div>
                </div>
                <div className='panel-body row'>
                    {/* Customer */}
                    <div className='form-group col-sm-4 col-sm-offset-1'>
                        <label>Customer:</label>
                        <select className='form-control col-sm-6' value={this.state.customerId}
                            onChange={this.updateCustomer}>
                            <option value={-1}>--</option>
                            {customers.map((customer) =>
                                <option value={customer.Id}>{customer.Name}</option>
                            )}
                        </select>
                    </div>
                    {/* Profile */}
                    <div className='form-group col-sm-4 col-sm-offset-1'>
                        <label>Profile:</label>
                        <select className='form-control' value={this.state.profileId}
                            onChange={this.updateProfile}>
                            <option value='-1'>--</option>
                            {profiles.map((profile) => <option value={profile.Id}>{profile.Name}</option>)}
                        </select>
                    </div>
                    <div className='form-group col-sm-4 col-sm-offset-1'>
                        <label>Files:</label>
                        <input type='file' onChange={this.handleFile} />
                        <span className='warning-text'>{this.state.fileWarning}</span>
                    </div>
                </div>
            </div>
            {this.state.receivableData === null ? null : <div className='panel panel-primary'>
                <div className='panel-body'>
                    <table className='table table-bordered table-hover'>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>Debt Amount</th>
                                <th>Prepaid Amount</th>
                                <th>Debtor</th>
                                <th>Contacts</th>
                                <th>Collector</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.receivableData.map((rei) => {
                                var index = -1;
                                return <tr>
                                    <td>{rei.No}</td>
                                    <td>{rei.DebtAmount}</td>
                                    <td>{rei.PrepaidAmount}</td>
                                    <td>{rei.Debtor !== null ? rei.Debtor.Name : null}</td>
                                    <td>{rei.Contacts.map((contact) => {
                                        if (contact.IsDebtor) {
                                            return null;
                                        }
                                        index++;
                                        if (index > 0) {
                                            return ', ' + contact.Name;
                                        }
                                        return contact.Name;
                                    })}</td>
                                    <td>
                                        {/* Do not has collector */}
                                        <SelectCollector collectors={this.props.collectors}
                                            receivable={rei}
                                            setCollector={this.setCollector} />
                                    </td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>}
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
        fetchCustomers: () => {
            dispatch(CustomerRequest.fetchCustomers());
        },
        fetchAllProfiles: () => {
            dispatch(ProfileRequest.fetchProfiles())
        },
        fetchCollectors: () => {
            dispatch(CollectorRequest.fetchCollectors());
        },
        insertReceivables: (list) => {
            dispatch(ReceivableRequest.insertReceivables(list));
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportReceivable);
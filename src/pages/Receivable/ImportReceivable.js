import React, { Component } from 'react';
import { connect } from 'react-redux'
import { CustomerRequest } from './../../actions/CustomerAction'
import { ProfileRequest } from './../../actions/ProfileActions'
import XLSX from 'xlsx';
import { Link } from 'react-router-dom';

class ImportReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receivableData: null,
            contactData: null,
            fileWarning: ''
        }
    }

    componentDidMount() {
        this.props.fetchAllProfiles();
        this.props.fetchCustomers();
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
            rei.Debtor = null;
            rei.Contacts = [];
        })
        contactData.map((contact) => {
            if (contact.IsDebtor === true) {
                receivableData[contact.ReceivableNo - 1].Debtor = contact;
            } else {
                receivableData[contact.ReceivableNo - 1].Contacts.push(contact);
            }
        });
        return receivableData;
    }

    render() {
        var customers = this.props.customers;
        var profiles = this.props.profiles;
        return (<div>
            <div className='row'>
                {/* Action */}
                <div className='col-sm-12'>
                    <div className='panel-action'>
                        <div>
                            <button className='btn btn-primary'>Save</button>
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
                        <select className='form-control col-sm-6'>
                            <option value={-1}>--</option>
                            {customers.map((customer) =>
                                <option value={customer.Id}>{customer.Name}</option>
                            )}
                        </select>
                    </div>
                    {/* Profile */}
                    <div className='form-group col-sm-4 col-sm-offset-1'>
                        <label>Profile:</label>
                        <select className='form-control'>
                            <option value={-1}>--</option>
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
                                        index++;
                                        if (index > 0) {
                                            return ', ' + contact.Name;
                                        }
                                        return contact.Name;
                                    })}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                </div>
            </div>}
        </div>);
    }
}

const mapStateToProps = state => {
    return {
        customers: state.customers,
        profiles: state.profiles
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchCustomers: () => {
            dispatch(CustomerRequest.fetchCustomers());
        },
        fetchAllProfiles: () => {
            dispatch(ProfileRequest.fetchProfiles())
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportReceivable);
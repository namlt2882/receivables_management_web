import React, { Component } from 'react';
import { connect } from 'react-redux'
import { CustomerRequest } from './../../actions/CustomerAction'
import { ProfileRequest } from './../../actions/ProfileActions'
import { CollectorRequest } from './../../actions/CollectorAction'
import XLSX from 'xlsx';
import { Link } from 'react-router-dom';

class ImportReceivable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            receivableData: null,
            contactData: null,
            fileWarning: '',
            selectCollector: null
        }
        this.addCollector = this.addCollector.bind(this);
        this.removeCollector = this.removeCollector.bind(this);
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
            rei.Collectors = [];
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

    addCollector(no, collector) {
        var receivableData = this.state.receivableData;
        receivableData.some((rei) => {
            if (rei.No === no) {
                rei.Collectors.push(collector);
                return true;
            }
            return false;
        });
        this.setState({ receivableData: receivableData })
    }

    removeCollector(no, collectorId) {
        var receivableData = this.state.receivableData;
        receivableData.some((rei) => {
            if (rei.No === no) {
                rei.Collectors = rei.Collectors.filter((collector) => collector.Id !== collectorId);
                return true;
            }
            return false;
        });
        this.setState({ receivableData: receivableData })
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
                                        index++;
                                        if (index > 0) {
                                            return ', ' + contact.Name;
                                        }
                                        return contact.Name;
                                    })}</td>
                                    <td>
                                        {/* Collector list */}

                                        {rei.Collectors.length > 0 ?
                                            <div className='row collector-simple-list'>
                                                {/*Already has collector */}
                                                {rei.Collectors.map((collector) => {
                                                    var name = collector.FirstName + collector.LastName;
                                                    return <div className='col-sm-12 row no-padding-right'>
                                                        <div className='col-sm-9 no-padding-right' style={{ overflow: 'auto' }}>{name}</div>
                                                        {/* Remove button */}
                                                        <div className='col-sm-2'>
                                                            <a style={{ cursor: 'pointer' }} onClick={() => { this.removeCollector(rei.No, collector.Id) }}>
                                                                <i class="fas fa-minus-circle"></i>
                                                            </a>
                                                        </div>
                                                    </div>;
                                                })}
                                            </div> :
                                            //Do not has collector
                                            <ImportCollectorForm collectors={this.props.collectors.filter((collector) => {
                                                return rei.Collectors.filter(clt => collector.Id === clt.Id).length == 0;
                                            })}
                                                receivable={rei}
                                                addCollector={this.addCollector} />}

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

class ImportCollectorForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedCollector: null,
            selectedCollectorId: '-1'
        }
    }

    onChangeCollector = (e) => {
        var Id = e.target.value;
        if (Id === '-1') {
            this.setState({
                selectedCollectorId: '-1',
                selectedCollector: null
            })
        } else {
            this.props.collectors.some((collector) => {
                if (collector.Id === Id) {
                    this.setState({
                        selectedCollectorId: collector.Id,
                        selectedCollector: collector
                    });
                    return true;
                }
                return false;
            })
        }
    }

    addCollector = () => {
        this.props.addCollector(this.props.receivable.No, this.state.selectedCollector);
    }

    render() {
        var selectedCollector = this.state.selectedCollector;
        var selectedCollectorId = this.state.selectedCollectorId;
        return (<div className='form-group'>
            <select className='form-control' value={selectedCollectorId}
                onChange={this.onChangeCollector}>
                <option value='-1'>--</option>
                {this.props.collectors.map((collector) =>
                    <option value={collector.Id}>
                        {collector.FirstName + collector.LastName}
                    </option>)}
            </select>
            <button className='btn btn-primary' onClick={this.addCollector}>Add</button>
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
        }
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ImportReceivable);
import React from 'react';
import { connect } from 'react-redux';
import Component from '../common/component';
import { available1 } from '../common/loading-page';
import { CustomerService } from '../../services/customer-service';
import { CustomerAction } from '../../actions/customer-action';
import ConfirmModal from '../modal/ConfirmModal';

class CustomerActionPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            message: '',
            customer: {
                Name: '',
                Code: '',
                Phone: '',
                Address: '',
                Id: null,
                viewMode: 2,
            },
            Name: '',
            Code: '',
            Phone: '',
            Address: '',
            Id: null,
            title: 'Add new customer',
        }

        this.callbackFromModal = this.callbackFromModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onCodeChange = this.onCodeChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onClear = this.onClear.bind(this);
    }

    changeMode() {
        this.setState({
            viewMode: 1
        })
    }

    callbackFromModal() {
        this.setState({ modalShow: false });
        if (this.state.Id) {
            CustomerService.update(this.state.customer).then(res => {
                if (res.status === 200) {
                    this.props.history.push(`/customers/${this.props.match.params.id}/view`);
                    this.setState({
                        viewMode: 0
                    });
                } else {
                    prompt('Failed to execute action');
                }
            });
        } else {
            CustomerService.create(this.state.customer).then(res => {
                if (res.status === 200) {
                    this.props.history.push(`/customers/`);
                } else if (res.status) {
                    prompt('Failed to execuaction');
                }
            });
        }

    }

    openModal() {
        var { match } = this.props;
        let tmpMes = 'Are you sure want add new customer?';
        if (match) {
            if (match.params.id) {
                tmpMes = 'Are you sure want edit?';
            }
        }

        let customer = this.state.customer;
        customer.Name = this.state.Name;
        customer.Id = this.state.Id;
        customer.Phone = this.state.Phone;
        customer.Address = this.state.Address;
        customer.Code = this.state.Code;

        this.setState({
            customer: customer,
            message: tmpMes,
            modalShow: true
        });
    }

    onNameChange(e) {
        this.setState({
            Name: e.target.value
        })
    }

    onCodeChange(e) {
        this.setState({
            Code: e.target.value
        })
    }

    onAddressChange(e) {
        this.setState({
            Address: e.target.value
        })
    }

    onPhoneChange(e) {
        this.setState({
            Phone: e.target.value
        })
    }

    onClear() {
        let customer = this.props.customer;
        if (customer.Id) {
            this.setState({
                Name: customer.Name,
                Code: customer.Code,
                Phone: customer.Phone,
                Address: customer.Address,
            });
        } else {
            this.setState({
                Name: '',
                Code: '',
                Phone: '',
                Address: '',
            });
        }

    }

    // Dispatch action và lưu itemEditing vào store
    componentDidMount() {
        document.title = "Add new customer"
        var { match } = this.props;
        if (match) {
            var id = match.params.id;
            if (id) {
                document.title = "Customer detail";
                this.setState({
                    messageId: id,
                    title: 'Customer Detail',
                    viewMode: 0
                });

                CustomerService.get(id).then(res => {
                    this.props.setCustomer(res.data);
                    this.incrementLoading();
                    console.log(res.data);
                    this.setState({
                        Id: res.data.Id,
                        Code: res.data.Code,
                        Name: res.data.Name,
                        Phone: res.data.Phone,
                        Address: res.data.Address,
                        customer: res.data
                    });
                });
            }
        }
        available1();
    }

    render() {
        var viewMode = this.state.viewMode;
        let modalClose = () => {
            this.setState({
                modalShow: false
            });
            window.event.stopPropagation();
        };
        return (
            <div style={{
                width: "100%", paddingTop: "10px"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12" >
                    <div className="hungdtq-header">
                        <h1>{this.state.title}</h1>
                    </div>
                    <div className="hungdtq-Wrapper">
                        <div className="hungdtq-Container" style={{ paddingTop: "2rem" }}>
                            <table className="UserDetailTable">
                                <tbody>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Name</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="form-control disabled"
                                                value={this.state.Name}
                                                onChange={this.onNameChange}
                                            />
                                            <input
                                                type="text"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                className="form-control"
                                                value={this.state.Name}
                                                onChange={this.onNameChange}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Code</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                type="text"
                                                className="form-control"
                                                value={this.state.Code}
                                                onChange={this.onCodeChange}
                                            />
                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="form-control disabled"
                                                value={this.state.Code}
                                                onChange={this.onContentChange}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Phone</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                className="form-control"
                                                value={this.state.Phone}
                                                onChange={this.onPhoneChange}
                                            />
                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="form-control disabled"
                                                value={this.state.Phone}
                                                onChange={this.onPhoneChange}
                                            />

                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Address</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={this.state.Address}
                                                onChange={this.onAddressChange}
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                            />

                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="form-control disabled"
                                                value={this.state.Address}
                                                onChange={this.onAddressChange}
                                            />

                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr></tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1"></td>
                                        <td className="UserDetailTable-Col2"></td>
                                        <td className="UserDetailTable-Col3">
                                            <button style={{ display: viewMode === 0 ? 'inline-block' : 'none', width: '10rem' }} className="btn btn-primary" onClick={(e) => { e.stopPropagation(); this.changeMode() }}>Edit</button>
                                            <button style={{ display: viewMode === 1 ? 'inline-block' : 'none', width: '10rem' }} className="btn btn-primary" onClick={(e) => { e.stopPropagation(); this.openModal() }}>Save</button>
                                            <button style={{ width: '10rem', display: viewMode === 2 ? 'inline-block' : 'none' }} className="btn btn-primary" onClick={(e) => { e.stopPropagation(); this.openModal() }}>Submit</button>
                                            <button style={{ display: viewMode !== 0 ? 'inline-block' : 'none', width: '5rem', width: '5rem' }} className="btn btn-basic" onClick={this.onClear}>Reset</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <ConfirmModal
                    show={this.state.modalShow}
                    onHide={modalClose}
                    header={'Add new form'}
                    body={this.state.message}
                    object={this.state.profileMessageForm}
                    callback={this.callbackFromModal}
                />
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        customer: state.customer
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setCustomer: (customer) => {
            dispatch(CustomerAction.setCustomer(customer));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomerActionPage);

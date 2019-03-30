import React from 'react';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import { CustomerAction } from '../../actions/customer-action';
import { CustomerService } from '../../services/customer-service';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import ConfirmModal from '../modal/ConfirmModal';
import { successAlert, errorAlert } from '../common/my-menu'

const nameChangeMessageErr = "Name must have 10 to 100 characters.";
const codeChangeMessageErr = "Code must have 4 to 50 characters.";
const phoneChangeMessageErr = "Phone is not valid.";

class CustomerActionPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            maxLoading: 1,
            modalShow: false,
            message: '',
            customer: {
                Name: '',
                Code: '',
                Phone: '',
                Address: '',
                Id: null,
            },
            Name: '',
            Code: '',
            Phone: '',
            Address: '',
            Id: null,
            title: 'Add new partner',
            viewMode: 2,

            nameInputErr: true,
            nameChangeMessageErr: '',

            codeInputErr: true,
            codeChangeMessageErr: '',

            phoneInputErr: true,
            phoneChangeMessageErr: '',
        }

        this.callbackFromModal = this.callbackFromModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onPhoneChange = this.onPhoneChange.bind(this);
        this.onAddressChange = this.onAddressChange.bind(this);
        this.onCodeChange = this.onCodeChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onClear = this.onClear.bind(this);

        this.onNameBlur = this.onNameBlur.bind(this);
        this.onCodeBlur = this.onCodeBlur.bind(this);
        this.onPhoneBlur = this.onPhoneBlur.bind(this);

    }

    onPhoneBlur(e) {
        let phone = e.target.value.trim();
        var regrex = new RegExp("(09|01[2|6|8|9]|1800)+([0-9]{4,8})");

        if (!regrex.test(phone)) {
            this.setState({
                phoneInputErr: true,
                phoneChangeMessageErr: phoneChangeMessageErr
            });
            return;
        } else {
            this.setState({
                phoneInputErr: false,
                phoneChangeMessageErr: ''
            });
        }

        if (phone.length < 7) {
            this.setState({
                phoneInputErr: true,
                phoneChangeMessageErr: phoneChangeMessageErr
            });
            return;
        } else {
            this.setState({
                phoneInputErr: false,
                phoneChangeMessageErr: ''
            });
        }
    }

    onCodeBlur(e) {
        let code = e.target.value;
        if (code.length < 2 || code.length > 50) {
            this.setState({
                codeInputErr: true,
                codeChangeMessageErr: codeChangeMessageErr
            });
        } else {
            this.setState({
                codeInputErr: false,
                codeChangeMessageErr: ''
            });
        }
    }

    onNameBlur(e) {
        let name = e.target.value;
        if (name.length < 10 || name.length > 100) {
            this.setState({
                nameInputErr: true,
                nameInputErrMessage: nameChangeMessageErr
            });
        } else {
            this.setState({
                nameInputErr: false,
                nameInputErrMessage: ''
            });
        }
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
                this.props.history.push(`/customers/${this.props.match.params.id}/view`);
                this.setState({
                    viewMode: 0
                });
                successAlert(`The partner ${this.state.Name} has been updated!`);
            }).catch(err => {
                console.error(err);
                errorAlert('Failed to execute this action, please try again later!');
            });
        } else {
            CustomerService.create(this.state.customer).then(res => {
                this.props.history.push(`/customers/`);
                successAlert(`The partner ${this.state.Name} has been created!`);
            }).catch(err => {
                console.error(err);
                errorAlert('Failed to execute this action, please try again later!');
            });
        }

    }

    openModal() {

        let { nameInputErr, phoneInputErr, codeInputErr } = this.state;
        if (nameInputErr || phoneInputErr || codeInputErr) {
            return;
        }

        var { match } = this.props;
        let tmpMes = 'Are you sure want add new partner?';
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
            Code: e.target.value.toUpperCase()
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
        document.title = "Add new partner"
        var { match } = this.props;
        if (match) {
            var id = match.params.id;
            if (id) {
                document.title = "Partner detail";
                this.setState({
                    messageId: id,
                    title: 'Partner Detail',
                    viewMode: 0
                });

                CustomerService.get(id).then(res => {
                    this.props.setCustomer(res.data);
                    this.incrementLoading();
                    this.setState({
                        Id: res.data.Id,
                        Code: res.data.Code,
                        Name: res.data.Name,
                        Phone: res.data.Phone,
                        Address: res.data.Address,
                        customer: res.data,

                        nameInputErr: false,
                        codeInputErr: false,
                        phoneInputErr: false,
                    });
                });
            } else {
                this.incrementLoading();
            }
        }
        available1();
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }
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
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                                <h1>{this.state.title}</h1>
                            </div>
                            <div className="d-inline-block hungdtq-headerbtn-container">
                                <div className="btn btn-rcm-primary rcm-btn" onClick={() => {
                                    this.props.history.push('/customers')
                                }}>
                                    <a><i className="fas fa-arrow-left"></i></a>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
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
                                                className="rcm-form-control hungdtq-disabled"
                                                value={this.state.Name}
                                                onChange={this.onNameChange}
                                            />
                                            <input
                                                type="text"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none', width: "40%" }}
                                                className="rcm-form-control"
                                                value={this.state.Name}
                                                onChange={this.onNameChange}
                                                onBlur={this.onNameBlur}
                                                autoComplete="off"
                                            />
                                        </td>
                                        <td>
                                            <i className="error-validation-message">
                                                {this.state.nameChangeMessageErr}
                                            </i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Code</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                style={{ display: viewMode !== 0 ? 'block' : 'none', width: "20%" }}
                                                type="text"
                                                className="rcm-form-control"
                                                value={this.state.Code}
                                                onChange={this.onCodeChange}
                                                autoComplete="off"
                                                onBlur={this.onCodeBlur}
                                            />
                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="rcm-form-control hungdtq-disabled"
                                                value={this.state.Code}
                                            />
                                        </td>
                                        <td>
                                            <i className="error-validation-message">
                                                {this.state.codeChangeMessageErr}
                                            </i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Phone</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="phone"
                                                style={{ display: viewMode !== 0 ? 'block' : 'none', width: "20%" }}
                                                className="rcm-form-control"
                                                value={this.state.Phone}
                                                onChange={this.onPhoneChange}
                                                autoComplete="off"
                                                onBlur={this.onPhoneBlur}
                                            />
                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="rcm-form-control hungdtq-disabled"
                                                value={this.state.Phone}
                                            />

                                        </td>
                                        <td>
                                            <i className="error-validation-message">
                                                {this.state.phoneChangeMessageErr}
                                            </i>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Address</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <input
                                                type="text"
                                                className="rcm-form-control"
                                                value={this.state.Address}
                                                onChange={this.onAddressChange}
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                autoComplete="off"
                                            />

                                            <input
                                                type="text"
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                className="rcm-form-control hungdtq-disabled"
                                                value={this.state.Address}
                                            />

                                        </td>
                                        <td>
                                            <i className="error-validation-message">
                                                {this.state.addressChangeMessageErr}
                                            </i>
                                        </td>
                                    </tr>
                                    <tr></tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1"></td>
                                        <td className="UserDetailTable-Col2"></td>
                                        <td className="UserDetailTable-Col3" style={{ paddingTop: '1.5rem' }}>
                                            <Button color='primary' style={{ display: viewMode === 0 ? 'inline-block' : 'none', width: '10rem' }}
                                                onClick={(e) => { e.stopPropagation(); this.changeMode() }}>Edit</Button>

                                            <Button color='primary' style={{ display: viewMode === 1 ? 'inline-block' : 'none', width: '10rem' }}
                                                onClick={(e) => { e.stopPropagation(); this.openModal() }}>Save</Button>

                                            <Button color='primary' style={{ width: '10rem' }} style={{ display: viewMode === 2 ? 'inline-block' : 'none' }}
                                                onClick={(e) => { e.stopPropagation(); this.openModal() }}>Submit</Button>

                                            <Button style={{ display: viewMode !== 0 ? 'inline-block' : 'none', width: '10rem' }}
                                                onClick={this.onClear}>Reset</Button>
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

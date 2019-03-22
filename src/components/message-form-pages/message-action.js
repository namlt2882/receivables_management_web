import React from 'react';
import { connect } from 'react-redux';
import Component from '../common/component';
import { available1 } from '../common/loading-page';
import { ProfileMessageFormService } from '../../services/profile-message-form-service';
import { MessageFormAction } from '../../actions/message-form-action';
import ConfirmModal from '../modal/ConfirmModal';
import Textarea from 'react-textarea-autosize';
import { Link } from 'react-router-dom';


class MessageActionPage extends Component {

    constructor(props) {
        super(props);

        this.state = {
            modalShow: false,
            message: '',
            profileMessageForm: {
                Name: '',
                Content: '',
                Type: 0,
                id: null,
            },
            Name: '',
            Content: '',
            Type: 0,
            id: null,
            viewMode: 2,
            title: 'Add new form',
        }

        this.callbackFromModal = this.callbackFromModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onContentChange = this.onContentChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onClear = this.onClear.bind(this);
        this.changeMode = this.changeMode.bind(this);
    }

    changeMode() {
        this.setState({
            viewMode: 1
        })
    }

    callbackFromModal() {
        this.setState({ modalShow: false });
        if (this.state.Id) {
            ProfileMessageFormService.update(this.state.profileMessageForm).then(res => {
                if (res.status === 200) {
                    this.setState({
                        viewMode: 0
                    });
                    this.props.history.push(`/messages/${this.props.match.params.id}/view`);
                } else {
                    prompt('Failed to execute action');
                }
            });
        } else {
            ProfileMessageFormService.create(this.state.profileMessageForm).then(res => {
                if (res.status === 200) {
                    this.props.history.push(`/messages/`);
                } else if (res.status) {
                    prompt('Failed to execuaction');
                }
            });
        }

    }

    openModal() {
        var { match } = this.props;
        let tmpMes = 'Are you sure want add new message form?';
        if (match) {
            if (match.params.id) {
                tmpMes = 'Are you sure want edit?';
            }
        }

        let form = this.state.profileMessageForm;
        form.Name = this.state.Name;
        form.Id = this.state.Id;
        form.Content = this.state.Content;
        form.Type = this.state.Type;

        this.setState({
            profileMessageForm: form,
            message: tmpMes,
            modalShow: true
        });
    }

    onNameChange(e) {
        this.setState({
            Name: e.target.value
        })
    }

    onContentChange(e) {
        this.setState({
            Content: e.target.value
        })
    }

    onTypeChange(e) {
        this.setState({
            Type: e.target.value
        })
    }

    onClear() {
        let message = this.props.message;
        if (message.Id) {
            this.setState({
                Name: message.Name,
                Content: message.Content,
                Type: message.Type,
            });
        } else {
            this.setState({
                Name: '',
                Content: '',
                Type: 0,
            });
        }

    }

    // Dispatch action và lưu itemEditing vào store
    componentDidMount() {
        document.title = "Add new form"
        available1();
        var { match } = this.props;
        if (match) {
            var id = match.params.id;
            if (id) {
                document.title = "Form detail";
                this.setState({
                    messageId: id,
                    title: 'Form Detail',
                    viewMode: 0
                });

                ProfileMessageFormService.getDetail(id).then(res => {
                    this.props.setMessage(res.data);
                    this.incrementLoading();
                    console.log(res.data);
                    this.setState({
                        Id: res.data.Id,
                        Name: res.data.Name,
                        Content: res.data.Content,
                        Type: res.data.Type,
                        profileMessageForm: res.data
                    });
                });
            }
        }
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
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                            <h1>{this.state.title}</h1>
                            </div>
                            <div className="d-inline-block hungdtq-headerbtn-container">
                                <div className="btn btn-rcm-primary rcm-btn">
                                    <Link to="/messages"><i class="fas fa-arrow-left"></i></Link>
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
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                type="text"
                                                className="rcm-form-control hungdtq-disabled"
                                                value={this.state.Name}
                                                onChange={this.onNameChange}
                                            />
                                            <input
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                type="text"
                                                className="rcm-form-control"
                                                value={this.state.Name}
                                                onChange={this.onNameChange}
                                            />

                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Content</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <Textarea
                                                style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                disabled
                                                type="text"
                                                minRows={1}
                                                className="rcm-form-control detailTextArea hungdtq-disabled"
                                                value={this.state.Content}
                                                onChange={this.onContentChange}
                                            />
                                            <Textarea
                                                style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                type="text"
                                                className="rcm-form-control detailTextArea"
                                                value={this.state.Content}
                                                onChange={this.onContentChange}
                                            />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1">Type</td>
                                        <td className="UserDetailTable-Col2">:</td>
                                        <td className="UserDetailTable-Col3">
                                            <div style={{ paddingTop: '0.5rem', display: viewMode != 0 ? 'block' : 'none' }}>
                                                <div className="d-inline" style={{paddingRight: '5px'}}>
                                                    <input type="radio" value='0' checked={this.state.Type == 0} onChange={this.onTypeChange} />
                                                    <i>SMS</i>
                                                </div>
                                                <div className="d-inline">
                                                    <input type="radio" value='1' checked={this.state.Type == 1} onChange={this.onTypeChange} />
                                                    <i>Call</i>
                                                </div>
                                            </div>
                                            <div style={{ paddingTop: '0.5rem', display: viewMode != 0 ? 'none' : 'block'}}>
                                                <div className="d-inline">
                                                    <i>{this.state.Type == 0 ? 'SMS' : 'Call'}</i>
                                                </div>
                                                
                                            </div>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr></tr>
                                    <tr>
                                        <td className="UserDetailTable-Col1"></td>
                                        <td className="UserDetailTable-Col2"></td>
                                        <td className="UserDetailTable-Col3">
                                            <button style={{ display: viewMode === 0 ? 'inline-block' : 'none', width: '10rem' }} className="btn btn-rcm-primary" onClick={(e) => { e.stopPropagation(); this.changeMode() }}>Edit</button>
                                            <button style={{ display: viewMode === 1 ? 'inline-block' : 'none', width: '10rem' }} className="btn btn-rcm-primary" onClick={(e) => { e.stopPropagation(); this.openModal() }}>Save</button>
                                            <button style={{ width: '10rem' }} style={{ display: viewMode === 2 ? 'inline-block' : 'none' }} className="btn btn-rcm-primary" onClick={(e) => { e.stopPropagation(); this.openModal() }}>Submit</button>
                                            <button style={{ display: viewMode !== 0 ? 'inline-block' : 'none', width: '5rem' }} className="btn btn-rcm-secondary" onClick={this.onClear}>Reset</button>
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
        message: state.message
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        setMessage: (message) => {
            dispatch(MessageFormAction.setMessage(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageActionPage);

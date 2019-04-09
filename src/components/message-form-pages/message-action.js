import React from 'react';
import { connect } from 'react-redux';
import Textarea from 'react-textarea-autosize';
import { Button } from 'semantic-ui-react';
import { MessageFormAction } from '../../actions/message-form-action';
import { ProfileMessageFormService } from '../../services/profile-message-form-service';
import Component from '../common/component';
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import ConfirmModal from '../modal/ConfirmModal';
import { successAlert, errorAlert } from '../common/my-menu'

const messageLength = 200;
const amount = "[AMOUNT]";
const name = "[NAME]";

const nameChangeMessageErr = 'Name must have 10 to 255 characters.';
const contentChangeMessageErr = 'Content must have at least 200 characters and contains [AMOUNT], [NAME] tag';

class MessageActionPage extends Component {

    contentTextArea = React.createRef();

    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1,
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
            length: messageLength,
            nameInputErr: true,
            nameInputErrMessage: '',
            contentInputErr: true,
            contentInputErrMessage: '',
        }

        this.callbackFromModal = this.callbackFromModal.bind(this);
        this.openModal = this.openModal.bind(this);
        this.onTypeChange = this.onTypeChange.bind(this);
        this.onContentChange = this.onContentChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onClear = this.onClear.bind(this);
        this.changeMode = this.changeMode.bind(this);
        this.addLabelToMessage = this.addLabelToMessage.bind(this);

        this.onNameBlur = this.onNameBlur.bind(this);
        this.onContentBlur = this.onContentBlur.bind(this);
    }


    onContentBlur(e) {
        let content = e.target.value;

        if (!content.includes(name) || !content.includes(amount)) {
            this.setState({
                contentInputErr: true,
                contentInputErrMessage: contentChangeMessageErr
            });
            return;
        } else {
            this.setState({
                contentInputErr: false,
                contentInputErrMessage: ''
            });
        }

        content = content.replace(amount, '');
        content = content.replace(name, '');

        if (content.length < 10) {
            this.setState({
                contentInputErr: true,
                contentInputErrMessage: contentChangeMessageErr
            });
            return;
        } else {
            this.setState({
                contentInputErr: false,
                contentInputErrMessage: ''
            });
        }
    }

    onNameBlur(e) {
        let name = e.target.value;
        if (name.length < 10 || name.length > 255) {
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


    addLabelToMessage(type) {
        let content = this.state.Content;
        let pos = this.textarea.selectionStart;

        if (!content.includes(type)) {
            content = [content.slice(0, pos), ' ' + type + ' ', content.slice(pos)].join('');
            this.setState({ Content: content.trim() })
        }
        this.textarea.focus();
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
                this.setState({
                    viewMode: 0
                });
                this.props.history.push(`/messages/${this.props.match.params.id}/view`);
                successAlert(`The ${this.state.Type === 0 ? 'SMS' : 'Phone call'} message "${this.state.Name}" has been updated!`)
            }).catch(err => {
                console.error(err);
                errorAlert('Failed to execute this action, please try again later!');
            });
        } else {
            ProfileMessageFormService.create(this.state.profileMessageForm).then(res => {
                this.props.history.push(`/messages/`);
                successAlert(`The ${this.state.Type === 0 ? 'SMS' : 'Phone call'} message "${this.state.Name}" has been created!`)
            }).catch(err => {
                console.error(err);
                errorAlert('Failed to execute this action, please try again later!');
            });
        }

    }

    openModal() {

        let { nameInputErr, contentInputErr } = this.state;

        if (nameInputErr || contentInputErr) {
            return;
        }

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
        let content = e.target.value;
        content = content.replace(amount, '');
        content = content.replace(name, '');

        if (content.length <= messageLength) {
            this.setState({
                Content: e.target.value,
                length: messageLength - content.length
            })
        }
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

        this.setState({
            nameInputErr: true,
            nameInputErrMessage: '',
            contentInputErr: true,
            contentInputErrMessage: '',
        });

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

                    let content = res.data.Content;
                    content = content.replace(amount, '');
                    content = content.replace(name, '');

                    this.setState({
                        Id: res.data.Id,
                        Name: res.data.Name,
                        Content: res.data.Content,
                        Type: res.data.Type,
                        profileMessageForm: res.data,
                        length: messageLength - content.length,
                        nameInputErr: false,
                        contentInputErr: false
                    });
                });
            } else {
                this.incrementLoading();
            }
        }
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
                                    this.props.history.push('/messages');
                                }}>
                                    <a><i class="fas fa-arrow-left"></i></a>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                    <div className="hungdtq-Wrapper">
                        <div className="hungdtq-Container" style={{ paddingTop: "2rem" }}>
                            <form
                                style={{ width: "100%" }}
                                onSubmit={(e) => { e.preventDefault() }}
                            >
                                <table className="MessageDetailTable">
                                    <tbody>
                                        <tr>
                                            <td className="MessageDetailTable-Col1">Name</td>
                                            <td className="MessageDetailTable-Col2">:</td>
                                            <td className="MessageDetailTable-Col3">
                                                <input
                                                    style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                    disabled
                                                    type="text"
                                                    className="rcm-form-control hungdtq-disabled"
                                                    value={this.state.Name}
                                                />
                                                <input
                                                    style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                    type="text"
                                                    className="rcm-form-control"
                                                    value={this.state.Name}
                                                    onChange={this.onNameChange}
                                                    autoComplete="off"
                                                    onBlur={this.onNameBlur}
                                                />

                                            </td>
                                            <td className="MessageDetailTable-Col4">
                                                <i className="error-validation-message">
                                                    {this.state.nameInputErrMessage}
                                                </i>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="MessageDetailTable-Col1">Content</td>
                                            <td className="MessageDetailTable-Col2">:</td>
                                            <td className="MessageDetailTable-Col3">
                                                <Textarea
                                                    style={{ display: viewMode === 0 ? 'block' : 'none' }}
                                                    disabled
                                                    type="text"
                                                    minRows={1}
                                                    className="rcm-form-control detailTextArea hungdtq-disabled"
                                                    value={this.state.Content}
                                                    minRows={3}
                                                />
                                                <Textarea
                                                    ref={this.contentTextArea}
                                                    style={{ display: viewMode !== 0 ? 'block' : 'none' }}
                                                    type="text"
                                                    className="rcm-form-control detailTextArea"
                                                    value={this.state.Content}
                                                    onChange={this.onContentChange}
                                                    minRows={3}
                                                    onBlur={this.onContentBlur}
                                                    ref={this.Textarea}
                                                    inputRef={tag => (this.textarea = tag)}
                                                />
                                            </td>
                                            <td className="MessageDetailTable-Col4">
                                                <i className="error-validation-message">
                                                    {this.state.contentInputErrMessage}
                                                </i>
                                            </td>
                                        </tr>
                                        <tr style={{ display: viewMode !== 0 ? 'table-row' : 'none', width: '5rem' }}>
                                            <td className="MessageDetailTable-Col1"></td>
                                            <td className="MessageDetailTable-Col2"></td>
                                            <td className="MessageDetailTable-Col3">
                                                <div className="message-edit-tags">

                                                    <div className="d-inline float-left message-edit-count">
                                                        <i>Tags: </i>
                                                        <button className="btn btn-rcm-secondary btn-rotate" onClick={(e) => this.addLabelToMessage(name)}> NAME </button>
                                                        <button className="btn btn-rcm-secondary btn-rotate" onClick={(e) => this.addLabelToMessage(amount)}> AMOUNT </button>
                                                    </div>
                                                    <div className="d-inline float-right">
                                                        <i>{this.state.length} character(s) left</i>

                                                    </div>
                                                </div>
                                            </td>
                                            <td className="MessageDetailTable-Col4"></td>
                                        </tr>
                                        <tr>
                                            <td className="MessageDetailTable-Col1">Type</td>
                                            <td className="MessageDetailTable-Col2">:</td>
                                            <td className="MessageDetailTable-Col3">
                                                <div style={{ paddingTop: '0.5rem', display: viewMode != 0 ? 'block' : 'none' }}>
                                                    <div className="d-inline" style={{ paddingRight: '5px' }}>
                                                        <input type="radio" value='0' checked={this.state.Type == 0} onChange={this.onTypeChange} />
                                                        <i>SMS</i>
                                                    </div>
                                                    <div className="d-inline">
                                                        <input type="radio" value='1' checked={this.state.Type == 1} onChange={this.onTypeChange} />
                                                        <i>Call</i>
                                                    </div>
                                                </div>
                                                <div style={{ paddingTop: '0.5rem', display: viewMode != 0 ? 'none' : 'block' }}>
                                                    <div className="d-inline">
                                                        <i>{this.state.Type == 0 ? 'SMS' : 'Call'}</i>
                                                    </div>

                                                </div>
                                            </td>
                                            <td className="MessageDetailTable-Col4"></td>
                                        </tr>
                                        <tr></tr>
                                        <tr>
                                            <td className="MessageDetailTable-Col1"></td>
                                            <td className="MessageDetailTable-Col2"></td>
                                            <td className="MessageDetailTable-Col3" style={{ paddingTop: '1.5rem' }}>
                                                {/* Edit button */}
                                                <Button color='primary' style={{
                                                    display: viewMode === 0 ? 'inline-block' : 'none', width: '10rem'
                                                }} onClick={(e) => { e.stopPropagation(); this.changeMode() }}>Edit</Button>

                                                {/* Save button */}
                                                <Button color='primary' style={{
                                                    display: viewMode === 1 ? 'inline-block' : 'none', width: '10rem'
                                                }} onClick={(e) => { e.stopPropagation(); this.openModal() }}>Save</Button>

                                                {/* Submit button */}
                                                <Button color='primary' style={{ width: '10rem' }} style={{
                                                    display: viewMode === 2 ? 'inline-block' : 'none'
                                                }} onClick={(e) => { e.stopPropagation(); this.openModal() }}>Submit</Button>

                                                {/* Reset button */}
                                                <Button style={{
                                                    display: viewMode !== 0 ? 'inline-block' : 'none', width: '10rem'
                                                }} onClick={this.onClear}>Reset</Button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
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

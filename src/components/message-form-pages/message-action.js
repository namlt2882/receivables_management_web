import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { actAddMessageRequest } from '../../actions/message-form-action';
import { connect } from 'react-redux';
class MessageActionPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            txtName: '',
            selCustomer: '',
            selType: '',
            txtContent: ''
        };
    }
    // Dispatch action và lưu itemEditing vào store
    // componentDidMount() {
    //     var { match } = this.props;
    //     if (match) {
    //         var id = match.params.id;
    //         this.props.onEditUser(id);
    //     }
    // }
    // Nhận lại props sau khi mapStateToProps
    // componentWillReceiveProps(nextProps) {
    //     if (nextProps) {
    //         var { message } = nextProps;
    //         this.setState({
    //             id: message.id,
    //             txtName: message.name,              
    //             selCustomer: message.customer,
    //             selType: message.type,
    //             txtContent: message.content
    //         });
    //     }
    // }

    onChange = (event) => {
        var target = event.target;
        var name = target.name;
        //var value = target.type === 'select' ? target.selected : target.value;
        var value = target.value;
        this.setState({
            [name]: value
        });
    }

    onSave = (event) => {
        event.preventDefault();
        var { id, txtName, txtContent, selCustomer, selType } = this.state;
        var { history } = this.props;
        var message = {
            id: id,
            name: txtName,

            customer: selCustomer,
            type: selType,
            content: txtContent
        };
        this.props.onAddMessage(message);
        history.goBack();
    }

    render() {
        var { txtName, txtContent, selCustomer, selType } = this.state;
        return (
            <div>

                <div className="panel panel-primary col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="panel-heading">
                        <h3 className="panel-title text-center">Messages List</h3>
                    </div>
                    <div className="panel-body">
                        <form onSubmit={this.onSave} className="form-row">
                            <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <label>Name:</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="txtName"
                                    value={txtName}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <label>Content: </label>
                                <textarea
                                    type="text"
                                    className="form-control"
                                    name="txtContent"
                                    value={txtContent}
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <label>Customer:</label>
                                <select
                                    className="form-control"
                                    type="select"
                                    name="selCustomer"
                                    value={selCustomer}
                                    onChange={this.onChange}
                                    selected={selCustomer}
                                >
                                    <option>NG ACB</option>
                                    <option>NG VIETCOM</option>
                                </select>
                            </div>
                            <div className="form-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                                <label>Type:</label>
                                <select
                                    className="form-control"
                                    type="select"
                                    name="selType"
                                    value={selType}
                                    onChange={this.onChange}
                                    checked={selType}
                                >
                                    <option>Call</option>
                                    <option>SMS</option>
                                </select>
                            </div>
                            <div className="mb-15 col-xs-12 col-sm-12 col-md-12 col-lg-12">
                                <button type="submit" className="btn btn-primary">
                                    <span className="fas fa-save mr-5"></span>Save
                    </button>&nbsp;&nbsp;&nbsp;
                    <Link to="/message-list" className="btn btn-danger">
                                    <span className="fas fa-ban mr-5"></span>Cancel
                    </Link>
                            </div>
                        </form>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        onAddMessage: (message) => {
            dispatch(actAddMessageRequest(message));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageActionPage);

/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import MessageItem from './message-item';
import MessageList from './message-list';
import { Link } from 'react-router-dom';
import { actFetchMessageRequest } from '../../actions/message-form-action';
class ListMessage extends Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         messages: []
    //     };
    // }

    // lifecycle này được gọi sau khi component render lần đầu tiên
    componentDidMount() {
        this.props.fetchAllMessages();
    }

    render() {
        var { messages } = this.props;
        return (
            <div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 mgb-15">
                <div className="col-xs-6 col-sm-6 col-md-6 col-lg-6">
                    <Link to="/message/add" className="btn btn-info mb-15">
                        <span className="fas fa-user-plus mr-5"></span> Add   
                    </Link>
                    </div>
                    <div className="input-group col-xs-6 col-sm-6 col-md-6 col-lg-6">
                        <input
                            name="keyword"
                            type="text"
                            className="form-control"
                            placeholder="Enter keyword ..."
                        />
                        <span className="input-group-btn">
                            <button
                                type="button"
                                className="btn btn-info"
                            >
                                <span className="fa fa-search mr-5"></span>Search
                                </button>
                        </span>
                    </div>
                </div>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <MessageList>
                        {/* props nay goi la props chilren */}
                        {this.showMessages(messages)}
                    </MessageList>
                </div>
            </div>
        );
    }

    showMessages(messages) {
        var result = null;
        if (messages && messages.length > 0) {
            result = messages.map((message, index) => {
                return (
                    <MessageItem
                        key={index}
                        message={message}
                        index={index}
                    />
                );
            });
        }
        return result;
    }
}

const mapStateToProps = state => {
    return {
        messages: state.messages
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllMessages: () => {
            dispatch(actFetchMessageRequest());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListMessage);

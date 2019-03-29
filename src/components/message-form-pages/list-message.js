/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { connect } from 'react-redux';
import MessageItem from './message-item';
import MessageList from './message-list';
import { Link } from 'react-router-dom';
import { MessageFormAction } from '../../actions/message-form-action';
import Component from '../common/component';
import { ProfileMessageFormService } from '../../services/profile-message-form-service';
import { available1, PrimaryLoadingPage } from '../common/loading-page';

import './message.scss';


class ListMessage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            filterVal: ""
        };
    }

    // lifecycle này được gọi sau khi component render lần đầu tiên
    componentDidMount() {
        document.title = 'Message Forms';
        ProfileMessageFormService.getAll().then(res => {
            this.props.fetchAllMessages(res.data);
            this.incrementLoading();
        });
        available1();
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }

        var { messages } = this.props;
        var { filterVal } = this.state;
        return (
            <div style={{
                width: "100%"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="hungdtq-header">
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                                <h1>Message form management</h1>
                            </div>
                            <div className="d-inline-block hungdtq-headerbtn-container">
                                <div className="btn btn-rcm-primary rcm-btn">
                                    <Link to="/messages/add"><i className="fas fa-plus"></i></Link>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                    </div>
                    <div className="hungdtq-Wrapper">
                        <div className="hungdtq-Container">
                            <div className="tableSearchBox">
                                <input
                                    type="text"
                                    className="rcm-form-control"
                                    placeholder="Search by form name..."
                                    onChange={e => this.setState({ filterVal: e.target.value })}
                                    value={filterVal}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <MessageList>
                            {messages
                                .filter(function (message) {
                                    if (filterVal) {
                                        return message.Name
                                            .toLowerCase()
                                            .includes(filterVal
                                                .toLowerCase()
                                                .trim())
                                    } else {
                                        return message;
                                    }
                                })
                                .map((message, index) =>
                                    <MessageItem
                                        key={index}
                                        message={message}
                                        index={index}
                                    />)}
                        </MessageList>

                    </div>

                    <div className="hungdtq-Wrapper" style={{ display: (this.props.messages == null || this.props.messages.length === 0) ? 'block' : 'none' }}>
                        <div className="hungdtq-Container">
                            <p>There is no message form.</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
        messages: state.messages
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllMessages: (messages) => {
            dispatch(MessageFormAction.setMessages(messages));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListMessage);

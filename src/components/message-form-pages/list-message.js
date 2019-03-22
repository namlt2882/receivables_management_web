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

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         messages: []
    //     };
    // }

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

        var messages = this.props.messages;
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
                    <div>
                        <MessageList>
                            {/* props nay goi la props chilren */}
                            {this.showMessages(messages)}
                        </MessageList>

                    </div>

                    <div className="hungdtq-Wrapper" style={{ display: (messages == null || messages.length === 0) ? 'block' : 'none' }}>
                        <div className="hungdtq-Container">
                            <p>There is no message form.</p>
                        </div>
                    </div>
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
        fetchAllMessages: (messages) => {
            dispatch(MessageFormAction.setMessages(messages));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListMessage);

import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageList extends Component {

    render() {
        return (

            <div className="hungdtq-Wrapper">
                <div className="hungdtq-Container">
                    <table className="table table-hover messageTable">
                        <thead className="thead-blue">
                            <tr>
                                <th  >ID</th>
                                <th className="messageNameCol">Name</th>
                                <th className="messageTypeCol">Type</th>
                                <th className="messageStatusCol">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.props.children}
                        </tbody>
                    </table>
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

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MessageList);

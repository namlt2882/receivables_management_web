import React, { Component } from 'react';
import { connect } from 'react-redux';

class MessageList extends Component {

    render() {
        return (

            <div className="hungdtq-Wrapper">
                <div className="hungdtq-Container">
                    <table className="table table-hover messageTable table-strip">
                        <thead className="thead-blue">
                            <tr>
                                <th >ID</th>
                                <th >Name</th>
                                <th >Type</th>
                                <th >Status</th>
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

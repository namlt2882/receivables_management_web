import React, { Component } from 'react';
import { Tooltip } from 'reactstrap'

class MyToolTip extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tooltipOpen: false
        }
        this.toggle = this.toggle.bind(this);
    }
    toggle() {
        this.setState({
            tooltipOpen: !this.state.tooltipOpen
        });
    }
    render() {
        let target = this.props.target;
        let message = this.props.message;
        return (
            <Tooltip placement="right" delay={0}
                isOpen={this.state.tooltipOpen} target={target} toggle={this.toggle}>
                {message}
            </Tooltip>
        );
    }
}

export default MyToolTip;

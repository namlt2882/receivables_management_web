import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Table, Badge } from 'reactstrap';
import { numAsDate, numAsTime } from '../../../utils/time-converter';
import Component from '../../common/component';
import { Button, Divider } from 'semantic-ui-react';

class ActionHistory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        }
        this.showHistory = this.showHistory.bind(this);
        this.closeModel = this.closeModel.bind(this);
    }
    componentDidMount() {

    }
    showHistory(e) {
        e.preventDefault();
        this.setState({
            modal: true
        });
    }
    closeModel() {
        this.setState({ modal: false });
    }
    render() {
        let stages = this.props.stages;
        let isEmpty = true;
        return (<div>
            <a href='' onClick={this.showHistory} style={{ float: 'right' }}><i>SMS and phone call history</i></a>
            <Modal isOpen={this.state.modal} className='big-modal'>
                <ModalHeader toggle={this.toggle}>SMS and Phone call history</ModalHeader>
                <ModalBody>
                    {stages.map((stage, i) => {
                        let actions = stage.Actions.filter(a => a.Status !== 1);
                        if (isEmpty && actions.length > 0) {
                            isEmpty = false;
                        }
                        if (actions.length <= 0) {
                            return null;
                        }
                        return <div>
                            {i >= 1 ? <Divider /> : null}
                            <span><h3>{stage.Name}</h3></span>
                            <Table className='info-table' striped>
                                <tbody>
                                    {actions.map((action, i) => {
                                        return <ActionRecord action={action} key={i} />
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    })}
                    {isEmpty ? <span>Sorry, SMS and phone call history is empty!</span> : null}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={this.closeModel}>Close</Button>
                </ModalFooter>
            </Modal>
        </div>);
    }
}

class ActionRecord extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        let action = this.props.action;
        let date = numAsDate(action.ExcutionDay);
        let time = numAsTime(action.StartTime);
        let color = 'warning';
        switch (action.Status) {
            case 1:
                color = 'secondary'
                break;
            case 2:
                color = 'success'
                break;
        }
        return (<tr>
            <td>{action.Name}</td>
            <td>
                <span>At{` ${date} ${time}`}</span>
                <span style={{ float: 'right' }}>
                    <Badge color={color}>{describeActionStatus(action.Status)}</Badge>
                </span>
            </td>
        </tr>);
    }
}

const describeActionStatus = (status) => {
    switch (status) {
        case 1:
            return 'Not done';
        case 2: return 'Done';
        default: return 'Late';
    }
}

export default ActionHistory;
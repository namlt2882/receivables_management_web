import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Table, Badge } from 'reactstrap';
import { numAsDate, numAsTime } from '../../utils/time-converter';
import Component from '../common/component';

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
        return (<div>
            <a href='' onClick={this.showHistory} style={{ float: 'right' }}><i>SMS and phone call history</i></a>
            <Modal isOpen={this.state.modal} className='big-modal'>
                <ModalHeader toggle={this.toggle}>SMS and Phone call history</ModalHeader>
                <ModalBody>
                    {stages.map((stage) => <div>
                        <span>{stage.Name}</span>
                        <Table className='info-table' striped>
                            <tbody>
                                {stage.Actions.map((action, i) => {
                                    return <ActionRecord action={action} key={i} />
                                })}
                            </tbody>
                        </Table>
                    </div>)}
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
        return (<tr>
            <td>{action.Name}</td>
            <td>
                <span>At{` ${date} ${time}`}</span>
                <span style={{ float: 'right' }}>
                    <Badge color='success'>Done</Badge>
                </span>
            </td>
        </tr>);
    }
}

export default ActionHistory;
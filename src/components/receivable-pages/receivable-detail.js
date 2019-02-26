import React from 'react';
import Component from '../common/component'
import { available1, PrimaryLoadingPage } from '../common/loading-page';
import { ReceivableService } from '../../services/receivable-service';
import { Table, Card, CardBody, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import Contact from './contact-pages/contact'
import './receivable.scss'
import { numAsDate } from '../../utils/time-converter';
import { CustomerService } from '../../services/customer-service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faCreditCard } from '@fortawesome/free-solid-svg-icons'
library.add(faCreditCard);

class ReceivableDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 2,
            receivable: null,
            customer: null
        }
    }
    componentDidMount() {
        available1();
        let recceiId = this.props.match.params.id;
        ReceivableService.get(recceiId).then(res => {
            let receivable = res.data;
            this.setState({ receivable: receivable });
            this.incrementLoading();
            CustomerService.get(receivable.CustomerId).then(res2 => {
                this.setState({ customer: res2.data })
                this.incrementLoading();
            })
        })
    }
    edit(e) {
        e.preventDefault();
    }
    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />;
        }
        let receivable = this.state.receivable;
        let contacts = receivable != null ? receivable.Contacts : [];
        let debtor = null;
        contacts = contacts.filter((c) => {
            if (c.Type == 0) {
                debtor = c;
                return false;
            } else return true;
        })
        return (<div className='col-sm-12 row'>
            {/* receivable information */}
            <div className='col-sm-6'>
                <Card>
                    <CardTitle>
                        <FontAwesomeIcon icon='credit-card' color='black' size='md' style={{ marginRight: '10px' }} />
                        Receivable Info
                        </CardTitle>
                    <CardBody>
                        <Table className='info-table' hover>
                            <tbody>
                                <tr>
                                    <td>Debt amount:</td>
                                    <td>{receivable.DebtAmount}</td>
                                </tr>
                                <tr>
                                    <td>Prepaid amount:</td>
                                    <td>{receivable.PrepaidAmount}</td>
                                </tr>
                                <tr>
                                    <td>Customer:</td>
                                    <td>{this.state.customer.Name}</td>
                                </tr>
                                <tr>
                                    <td>Due day:</td>
                                    <td>{numAsDate(receivable.PayableDay)}</td>
                                </tr>
                                <tr>
                                    <td>Collector:</td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <td>Status:</td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </Table>
                        <a href='' onClick={this.edit}>Edit</a>
                    </CardBody>
                </Card>
            </div>
            {/* contacts */}
            <div className='col-sm-6'>
                {/* Debtor */}
                <Contact title='Debtor' isDebtor={true} contacts={debtor !== null ? [debtor] : []} style={{ marginBottom: '20px' }} />
                {/* Relatives */}
                <Contact title='Relatives' isDebtor={false} contacts={contacts} />
            </div>
        </div>);
    }
}

export default ReceivableDetail;
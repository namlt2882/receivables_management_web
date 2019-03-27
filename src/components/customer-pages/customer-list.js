import React from 'react';
import { connect } from 'react-redux';
import Component from '../common/component';
import { available } from '../common/loading-page';
import { Link } from 'react-router-dom';
import { CustomerService } from '../../services/customer-service';
import { CustomerAction } from '../../actions/customer-action';
import { PrimaryLoadingPage } from '../common/loading-page';

import './customer.scss';

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxLoading: 1
        };
    }

    componentDidMount() {
        document.title = 'Customers';
        available(resolve => setTimeout(resolve, 400));
        CustomerService.getAll().then(res => {
            this.props.fetchAllCustomers(res.data);
            this.incrementLoading();
        })
    }

    handleClick(customerId) {
        if (customerId) {
            this.props.history.push(`/customers/${customerId}/view`);
        }
    }

    render() {
        if (this.isLoading()) {
            return <PrimaryLoadingPage />
        }

        var customers = this.props.customers;

        var index = 1;
        return (
            <div style={{
                width: "100%"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="hungdtq-header">
                        <div>
                            <div className="d-inline-block hungdtq-header-text">
                                <h1>Customer management</h1>
                            </div>
                            <div className="d-inline-block hungdtq-headerbtn-container">
                                <div className="btn btn-rcm-primary rcm-btn">
                                    <Link to="/customers/add"><i className="fas fa-plus"></i></Link>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                    </div>

                    <div>
                        <div className="hungdtq-Wrapper">
                            <div className="hungdtq-Container">

                                <table fixed="true" style={{ display: customers ? 'table' : 'none' }} className="table table-hover table-strip">
                                    <thead className="thead-blue">
                                        <tr>
                                            <th className="customerIndexCol">No.</th>
                                            <th className="customerNameCol">Name</th>
                                            <th className="customerCodeCol">Code</th>
                                            <th className="customerNumberOfReceivableCol">Number of Receivable</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {customers.map(customer =>
                                            <tr
                                                style={{ cursor: "pointer" }}
                                                onClick={this.handleClick.bind(this, customer.Id)}>

                                                <td className="customerIndexCol">{index++}</td>
                                                <td className="customerNameCol">{customer.Name}</td>
                                                <td className="customerCodeCol">{customer.Code}</td>
                                                <td className="customerNumberOfReceivableCol">{customer.NumberOfReceivable}</td>
                                            </tr>)}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="hungdtq-Wrapper" style={{ display: (customers == null || customers.length === 0) ? 'block' : 'none' }}>
                            <div className="hungdtq-Container">
                                <p>There is no customer.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        customers: state.customers
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        fetchAllCustomers: (customers) => {
            dispatch(CustomerAction.setCustomers(customers));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserList);
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
    componentDidMount() {
        document.title = 'Customers';
        available(resolve => setTimeout(resolve, 400));
        //CustomerService.getAll().then(res => {
        //    this.props.fetchAllCustomers(res.data);
        //   console.log("testing data: " + res.data);
        //   this.incrementLoading();
        //})
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
        if (customers.length == 0 || !Array.isArray(customers)) {
            CustomerService.getAll().then(res => {
                this.props.fetchAllCustomers(res.data);
                console.log("testing data: " + res.data);
                this.incrementLoading();
            })
        }

        var index = 1;
        return (
            <div style={{
                width: "100%"
            }}>
                <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                    <div className="hungdtq-header">
                        <h1>Customer management</h1>
                    </div>
                    <div className="hungdtq-Wrapper">
                        <div className="hungdtq-Container">
                            <div className="hungdtq-headerbtn-container">
                                <div className="btn btn-success">
                                    <Link to="/customers/add"><i className="fas fa-plus"></i></Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>


                        <div className="hungdtq-Wrapper">
                            <div className="hungdtq-Container">

                                <table fixed style={{ display: customers ? 'table' : 'none' }} className="table table-hover">
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
                                            <tr style={{cursor: "pointer"}} onClick={this.handleClick.bind(this, customer.Id)}>

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
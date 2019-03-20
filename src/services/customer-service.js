import { Request, AuthRequest } from '../utils/request'

export const CustomerService = {
    get: (id) => {
        return AuthRequest.get(`Customer/${id}`);
    },
    getAll: () => {
        return AuthRequest.get('Customer');
    },
    create: (customer) => {
        return AuthRequest.post('Customer', customer);
    }
}
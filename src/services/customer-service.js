import { Request, AuthRequest } from '../utils/request'

export const CustomerService = {
    get: (id) => {
        return AuthRequest.get(`Customer/${id}`);
    },
    getAll: () => {
        return AuthRequest.get('Customer');
    },
    update: (customer) => {
        return AuthRequest.put('Customer', customer);
    },
    create: (customer) => {
        return AuthRequest.post('Customer', customer);
    }
}
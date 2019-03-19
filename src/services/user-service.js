import { Request, AuthRequest } from '../utils/request'

export const UserService = {
    getCollectors: () => {
        return AuthRequest.get('User/GetCollector');
    },
    getCollectorDetail: (id) => {
        return AuthRequest.get(`User/GetCollectorById/${id}`);
    },
    updateCollector: (collector) => {
        return  AuthRequest.put(`User/`, collector);
    },
    addCollector: (collector) => {
        return AuthRequest.post('User/', collector)
    }
}
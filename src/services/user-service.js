import { Request, AuthRequest } from '../utils/request'

export const UserService = {
    getCollectors: () => {
        return AuthRequest.get('User/GetCollector');
    },
    getCollectorDetail: (id) => {
        return AuthRequest.get(`User/GetCollectorById/${id}`);
    }
}
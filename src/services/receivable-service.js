import { Request, AuthRequest } from '../utils/request'

export const ReceivableService = {
    get: (id) => {
        return AuthRequest.get(`Receivable/${id}`);
    },
    getAll: () => {
        return AuthRequest.get(`Receivable`);
    },
    create: (list) => {
        return AuthRequest.post(`Receivable`, list);
    }
}
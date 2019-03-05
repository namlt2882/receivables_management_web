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
    },
    closeReceivable: (id) => {
        return AuthRequest.post(`Receivable/CloseReceivable?receivableId=${id}`);
    },
    changeCollector: (data) => {
        return AuthRequest.post('Receivable/ChangeAsignedCollector', data);
    },
    update: (receivable) => {
        return AuthRequest.put('Receivable', receivable);
    }
}
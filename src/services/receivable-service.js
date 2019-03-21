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
    closeReceivable: (data) => {
        return AuthRequest.put(`Receivable/CloseReceivable`, data);
    },
    changeCollector: (data) => {
        return AuthRequest.post('Receivable/ChangeAsignedCollector', data);
    },
    update: (receivable) => {
        return AuthRequest.put('Receivable', receivable);
    },
    validate: (list) => {
        return AuthRequest.post('Receivable/Validate', list);
    },
    confirm: (id) => {
        return AuthRequest.put('Receivable/Confirm', { Id: id });
    },
    assignReceivable: (id, collectorId, payableDay) => {
        return AuthRequest.put('Receivable/AssignReceivable', [{
            Id: id,
            CollectorId: collectorId,
            PayableDay: payableDay
        }]);
    }
}
import { Request, AuthRequest } from '../utils/request'

export const TaskService = {
    getReceivableTodayTask: (receivableId) => {
        return AuthRequest.get(`Task/GetReceivableTodayTask?receivableId=${receivableId}`);
    },
    getCollectorTodayTask: (id) => {
        return AuthRequest.get(`Task/GetCollectorTodayTask?collectorId=${id}`);
    }
}
import { Request, AuthRequest } from '../utils/request'

export const TaskService = {
    getReceivableTodayTask: (receivableId) => {
        return AuthRequest.get(`Task/GetReceivableTodayTask?receivableId=${receivableId}`);
    }
}
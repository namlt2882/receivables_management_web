import { AuthRequest } from '../utils/request';

export const PointService = {
    getAllCollectorCpp: () => {
        return AuthRequest.get('Point/GetAllCollectorCpp');
    }
}
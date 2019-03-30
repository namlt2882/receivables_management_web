import { AuthRequest } from '../utils/request';

export const UtilityService = {
    getServerDate: () => {
        return AuthRequest.get('Utility/GetServerDay');
    }
}
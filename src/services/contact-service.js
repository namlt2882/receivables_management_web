import { AuthRequest } from '../utils/request'

export const ContactService = {
    update: (data) => {
        return AuthRequest.put('Contact', data);
    },
    create: (data) => {
        return AuthRequest.post('Contact', data);
    }
}
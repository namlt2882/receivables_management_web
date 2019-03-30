import { AuthRequest } from '../utils/request';

export const ProfileMessageFormService = {
    getDetail: (id) => {
        return AuthRequest.get(`ProfileMessageForm/${id}`);
    },
    create: (profile) => {
        return AuthRequest.post('ProfileMessageForm', profile);
    },
    getAllMessageForms: () => {
        return AuthRequest.get('ProfileMessageForm');
    },
    update: (messageForm) => {
        return AuthRequest.put('ProfileMessageForm', messageForm);
    },
    getAll: () => {
        return AuthRequest.get('ProfileMessageForm');
    }
}
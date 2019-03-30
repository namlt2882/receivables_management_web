import { AuthRequest } from '../utils/request';

export const ProfileService = {
    getDetail: (id) => {
        return AuthRequest.get(`Profile/${id}`);
    },
    create: (profile) => {
        return AuthRequest.post('Profile', profile);
    },
    getAllMessageForms: () => {
        return AuthRequest.get('ProfileMessageForm');
    },
    update: (profile) => {
        return AuthRequest.put('Profile');
    },
    getAll: () => {
        return AuthRequest.get('Profile');
    }
}
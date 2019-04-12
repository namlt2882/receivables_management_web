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
        return AuthRequest.put('Profile', profile);
    },
    getAll: () => {
        return AuthRequest.get('Profile');
    },
    getAllWithDetail: () => {
        return AuthRequest.get('Profile/GetAllWithDetail');
    }
}
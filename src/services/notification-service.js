import { Request, AuthRequest } from '../utils/request'

export const NotificationService = {
    getMyNotification: () => {
        return AuthRequest.get('Notification');
    },
    toggleSeen: (id) => {
        return AuthRequest.put(`Notification/ToggleSeen/${id}`);
    }
}
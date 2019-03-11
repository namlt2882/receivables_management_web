import { Request, AuthRequest } from '../utils/request'

export const NotificationService = {
    getMyNotification: () => {
        return AuthRequest.get('Notification');
    }
}
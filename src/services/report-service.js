import { AuthRequest } from '../utils/request';

export const ReportService = {
    getOverallReport: () => {
        return AuthRequest.get(`Report/`);
    }
}
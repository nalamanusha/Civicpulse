import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Grievances APIs
export const getGrievances = () => apiClient.get('/grievances');
export const createGrievance = (grievanceData) => apiClient.post('/grievances', grievanceData);
export const updateGrievanceStatus = (id, status) => apiClient.put(`/grievances/${id}/status`, { status });

// Welfare Schemes APIs
export const getWelfareSchemes = () => apiClient.get('/schemes');

// Governance Analytics APIs
export const getAnalyticsData = () => apiClient.get('/analytics');

export default apiClient;
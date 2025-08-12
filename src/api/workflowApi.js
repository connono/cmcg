// src/api/workflowApi.js
import axios from 'axios';

// 配置API基础URL
const apiClient = axios.create({
    baseURL: 'http://192.168.56.56/api/workflows',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// 设置CSRF令牌(如果使用Laravel默认身份验证)
const token = document.head.querySelector('meta[name="csrf-token"]');
if (token) {
    apiClient.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
}

export const deployWorkflow = async (name, xml) => {
    try {
        const response = await apiClient.post('/deploy', { name, xml });
        return response.data;
    } catch (error) {
        console.error('部署工作流失败', error);
        throw error;
    }
};

export const getWorkflow = async (name) => {
    try {
        const response = await apiClient.get(`/${name}`);
        return response.data;
    } catch (error) {
        console.error('获取工作流失败', error);
        throw error;
    }
};

export const getDefinitions = async () => {
    try {
        const response = await apiClient.get('/definitions');
        return response.data.definitions;
    } catch (error) {
        console.error('获取流程定义失败', error);
        throw error;
    }
};

export const startProcess = async (processKey, variables, businessKey) => {
    try {
        const response = await apiClient.post('/start', {
            processKey,
            variables,
            businessKey
        });
        return response.data;
    } catch (error) {
        console.error('启动流程失败', error);
        throw error;
    }
};
/**
 * AI助手组件
 * 提供智能文本解析、图片OCR识别和Excel解析功能
 */
class AIAssistant {
    /**
     * 初始化AI助手
     * @param {string} apiBaseUrl - API基础URL
     */
    constructor(apiBaseUrl = 'http://localhost:5000') {
        this.apiBaseUrl = apiBaseUrl;
        this.endpoints = {
            textParse: '/api/text/parse',
            imageOcr: '/api/image/ocr',
            documentParse: '/api/document/parse'
        };
        console.log('AI助手初始化完成，API地址:', this.apiBaseUrl);
    }

    /**
     * 解析文本内容
     * @param {string} text - 要解析的文本
     * @returns {Promise} - 解析结果Promise
     */
    parseText(text) {
        console.log('解析文本:', text);
        return new Promise((resolve, reject) => {
            fetch(`${this.apiBaseUrl}${this.endpoints.textParse}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`请求失败: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('解析结果:', data);
                if (data.success && data.data) {
                    resolve(data.data);
                } else {
                    reject(new Error(data.error || '解析失败'));
                }
            })
            .catch(error => {
                console.error('文本解析错误:', error);
                reject(error);
            });
        });
    }

    /**
     * 处理图片OCR识别
     * @param {File} file - 图片文件
     * @returns {Promise} - OCR识别结果Promise
     */
    processImage(file) {
        console.log('处理图片OCR:', file.name);
        
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);

            fetch(`${this.apiBaseUrl}${this.endpoints.imageOcr}`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`请求失败: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('OCR结果:', data);
                if (data.success && data.data) {
                    resolve(data.data);
                } else {
                    reject(new Error(data.error || 'OCR识别失败'));
                }
            })
            .catch(error => {
                console.error('OCR处理错误:', error);
                reject(error);
            });
        });
    }

    /**
     * 处理Excel文档
     * @param {File} file - Excel文件
     * @returns {Promise} - 文档处理结果Promise
     */
    processDocument(file) {
        console.log('处理文档:', file.name);
        
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('document', file);

            fetch(`${this.apiBaseUrl}${this.endpoints.documentParse}`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`请求失败: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('文档处理结果:', data);
                if (data.success && data.data) {
                    resolve(data.data);
                } else {
                    reject(new Error(data.error || '文档处理失败'));
                }
            })
            .catch(error => {
                console.error('文档处理错误:', error);
                reject(error);
            });
        });
    }

    /**
     * 检查服务状态
     * @returns {Promise} - 服务状态检查结果Promise
     */
    checkStatus() {
        return fetch(`${this.apiBaseUrl}/api/health`)
            .then(response => response.json())
            .then(data => {
                console.log('服务状态:', data);
                return data;
            })
            .catch(error => {
                console.error('服务状态检查失败:', error);
                throw error;
            });
    }
}

// 如果在浏览器环境中，将AIAssistant添加到window对象
if (typeof window !== 'undefined') {
    window.AIAssistant = AIAssistant;
}

// 如果在Node.js环境中，导出AIAssistant类
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AIAssistant;
} 
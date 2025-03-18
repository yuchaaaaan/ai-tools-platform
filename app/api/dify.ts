import { ToolResult, UrlAnalyzerResult } from '../types';

const DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY;
const DIFY_API_BASE_URL = process.env.NEXT_PUBLIC_DIFY_API_BASE_URL;

export async function analyzeText(url: string): Promise<UrlAnalyzerResult> {
    try {
        const response = await fetch(`${DIFY_API_BASE_URL}/v1/workflows/run`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DIFY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                users: 'default_user',
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('API Error:', error);
            throw new Error(error.error || 'URL分析に失敗しました');
        }

        const data = await response.json();
        console.log('API Response:', data);

        if (!data || typeof data !== 'object') {
            throw new Error('無効なレスポンス形式です');
        }

        return {
            text: data.output?.text || '要約を生成できませんでした',
            body: data.title || 'タイトルなし'
        };
    } catch (error) {
        console.error('Error in analyzeText:', error);
        throw error;
    }
}

export async function generateImage(prompt: string, style: string): Promise<ToolResult> {
    const response = await fetch(`${DIFY_API_BASE_URL}/v1/chat-messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${DIFY_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `${style}スタイルで以下の説明に基づいて画像を生成してください：${prompt}`,
            response_mode: 'blocking',
        }),
    });

    if (!response.ok) {
        throw new Error('画像生成に失敗しました');
    }

    const data = await response.json();
    return {
        imageUrl: 'https://via.placeholder.com/400x300', // 実際の画像URLに置き換える
        generationTime: '2.5秒',
        style,
    };
}

export async function visualizeData(data: string, chartType: string): Promise<ToolResult> {
    const response = await fetch(`${DIFY_API_BASE_URL}/v1/chat-messages`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${DIFY_API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            query: `以下のCSVデータを${chartType}で可視化してください：${data}`,
            response_mode: 'blocking',
        }),
    });

    if (!response.ok) {
        throw new Error('データ可視化に失敗しました');
    }

    const responseData = await response.json();
    return {
        chartUrl: 'https://via.placeholder.com/600x400', // 実際のグラフURLに置き換える
        dataPoints: 50,
        chartType,
    };
} 
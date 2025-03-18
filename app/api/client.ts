import { ToolResult, UrlAnalyzerResult, ImageGeneratorResult, DataVisualizerResult, EmailEvaluatorResult, ChunkGeneratorResult } from '../types';
import { API_CONFIG } from './config';

// 環境変数のチェック
if (!process.env.NEXT_PUBLIC_DIFY_API_BASE_URL) {
    throw new Error('Dify APIのベースURLが設定されていません');
}

export async function analyzeText(url: string): Promise<UrlAnalyzerResult> {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_DIFY_API_BASE_URL}/v1/workflows/run`;
        console.log('Calling URL Analyzer API:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_URL_ANALYZER_API_KEY}`,
            },
            body: JSON.stringify({
                workflow_id: "url-summary",
                inputs: {
                    URL: url
                },
                response_mode: "blocking",
                user: "default-user"
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: '不明なエラーが発生しました' }));
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(errorData.message || `URL分析に失敗しました (${response.status})`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        return {
            text: data.data?.outputs?.text || '要約を取得できませんでした',
            body: data.data?.outputs?.body || '本文を取得できませんでした'
        };
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

export async function generateImage(prompt: string, style: string): Promise<ImageGeneratorResult> {
    const response = await fetch(API_CONFIG.imageGenerator.endpoint, {
        method: API_CONFIG.imageGenerator.method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
        },
        body: JSON.stringify({
            prompt,
            style,
            workflow_id: 'image_generator',
            inputs: {
                prompt,
                style,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: '不明なエラーが発生しました' }));
        throw new Error(error.error || '画像生成に失敗しました');
    }

    const data = await response.json();
    return {
        imageUrl: data.output?.image_url || '',
        generationTime: data.output?.generation_time || '',
        style: data.output?.style || style,
    };
}

export async function visualizeData(data: string, chartType: string): Promise<DataVisualizerResult> {
    const response = await fetch(API_CONFIG.dataVisualizer.endpoint, {
        method: API_CONFIG.dataVisualizer.method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_DIFY_API_KEY}`,
        },
        body: JSON.stringify({
            data,
            chartType,
            workflow_id: 'data_visualizer',
            inputs: {
                data,
                chart_type: chartType,
            },
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: '不明なエラーが発生しました' }));
        throw new Error(error.error || 'データ可視化に失敗しました');
    }

    const responseData = await response.json();
    return {
        chartUrl: responseData.output?.chart_url || '',
        dataPoints: responseData.output?.data_points || 0,
        chartType: responseData.output?.chart_type || chartType,
    };
}

export async function evaluateEmail(position: string, special_notes: string, email_content: string): Promise<EmailEvaluatorResult> {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_DIFY_API_BASE_URL}/v1/workflows/run`;
        console.log('Calling Email Evaluator API:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_EMAIL_EVALUATOR_API_KEY}`,
            },
            body: JSON.stringify({
                workflow_id: "営業メールの評価",
                inputs: {
                    position,
                    special_notes,
                    email_content
                },
                response_mode: "blocking",
                user: "default-user"
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: '不明なエラーが発生しました' }));
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(errorData.message || `メール評価に失敗しました (${response.status})`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        return {
            kaizen: data.data?.outputs?.kaizen || 'メールの評価を取得できませんでした'
        };
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
}

export async function generateChunk(text_miibo: string): Promise<ChunkGeneratorResult> {
    try {
        const apiUrl = `${process.env.NEXT_PUBLIC_DIFY_API_BASE_URL}/v1/workflows/run`;
        console.log('Calling Chunk Generator API:', apiUrl);

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CHUNK_GENERATOR_API_KEY}`,
            },
            body: JSON.stringify({
                workflow_id: "CHUNK付与bot",
                inputs: {
                    text_miibo
                },
                response_mode: "blocking",
                user: "default-user"
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: '不明なエラーが発生しました' }));
            console.error('API Error Response:', {
                status: response.status,
                statusText: response.statusText,
                error: errorData
            });
            throw new Error(errorData.message || `CHUNK生成に失敗しました (${response.status})`);
        }

        const data = await response.json();
        console.log('API Response:', data);

        return {
            text_result: data.data?.outputs?.text_result || 'CHUNKを生成できませんでした'
        };
    } catch (error) {
        console.error('API Call Error:', error);
        throw error;
    }
} 
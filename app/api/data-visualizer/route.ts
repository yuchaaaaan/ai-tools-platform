import { NextResponse } from 'next/server';
import { DataVisualizerResult } from '../../types';

// データ可視化用のAPI設定
const API_KEY = process.env.DATA_VISUALIZER_API_KEY;
const API_BASE_URL = process.env.DATA_VISUALIZER_API_BASE_URL;

if (!API_KEY || !API_BASE_URL) {
    throw new Error('データ可視化用のAPI設定が不完全です');
}

export async function POST(request: Request) {
    try {
        const { data, chartType } = await request.json();

        if (!data || !chartType) {
            return NextResponse.json(
                { error: 'CSVデータとグラフタイプが必要です' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/v1/chat-messages`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: `以下のCSVデータを${chartType}で可視化してください：${data}`,
                response_mode: 'blocking',
            }),
        });

        if (!response.ok) {
            throw new Error('データ可視化APIの呼び出しに失敗しました');
        }

        const responseData = await response.json();
        const result: DataVisualizerResult = {
            chartUrl: 'https://via.placeholder.com/600x400', // 実際のグラフURLに置き換える
            dataPoints: 50,
            chartType,
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('データ可視化エラー:', error);
        return NextResponse.json(
            { error: 'データ可視化に失敗しました' },
            { status: 500 }
        );
    }
} 
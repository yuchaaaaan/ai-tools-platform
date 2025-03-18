import { NextResponse } from 'next/server';
import { ImageGeneratorResult } from '../../types';

// 画像生成用のAPI設定
const API_KEY = process.env.IMAGE_GENERATOR_API_KEY;
const API_BASE_URL = process.env.IMAGE_GENERATOR_API_BASE_URL;

if (!API_KEY || !API_BASE_URL) {
    throw new Error('画像生成用のAPI設定が不完全です');
}

export async function POST(request: Request) {
    try {
        const { prompt, style } = await request.json();

        if (!prompt || !style) {
            return NextResponse.json(
                { error: '画像の説明とスタイルが必要です' },
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
                query: `${style}スタイルで以下の説明に基づいて画像を生成してください：${prompt}`,
                response_mode: 'blocking',
            }),
        });

        if (!response.ok) {
            throw new Error('画像生成APIの呼び出しに失敗しました');
        }

        const data = await response.json();
        const result: ImageGeneratorResult = {
            imageUrl: 'https://via.placeholder.com/400x300', // 実際の画像URLに置き換える
            generationTime: '2.5秒',
            style,
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('画像生成エラー:', error);
        return NextResponse.json(
            { error: '画像生成に失敗しました' },
            { status: 500 }
        );
    }
} 
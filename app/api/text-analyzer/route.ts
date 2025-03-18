import { NextResponse } from 'next/server';
import { UrlAnalyzerResult } from '../../types';

// URL分析用のAPI設定
const API_KEY = process.env.TEXT_ANALYZER_API_KEY;
const API_BASE_URL = process.env.TEXT_ANALYZER_API_BASE_URL;

if (!API_KEY || !API_BASE_URL) {
    throw new Error('URL分析用のAPI設定が不完全です');
}

export async function POST(request: Request) {
    try {
        const { url } = await request.json();

        if (!url) {
            return NextResponse.json(
                { error: 'URLが入力されていません' },
                { status: 400 }
            );
        }

        const response = await fetch(`${API_BASE_URL}/workflows/run`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                url,
                users: 'default_user', // 必須パラメータ
            }),
        });

        if (!response.ok) {
            throw new Error('URL分析APIの呼び出しに失敗しました');
        }

        const data = await response.json();
        const result: UrlAnalyzerResult = {
            text: data.output?.text || '要約を生成できませんでした',
            body: data.title || 'タイトルなし'
        };

        return NextResponse.json(result);
    } catch (error) {
        console.error('URL分析エラー:', error);
        return NextResponse.json(
            { error: 'URL分析に失敗しました' },
            { status: 500 }
        );
    }
} 
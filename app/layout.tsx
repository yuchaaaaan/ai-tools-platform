import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'AIツールプラットフォーム',
    description: 'URL要約、画像生成、データ可視化などのAIツールを提供するプラットフォーム',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body>{children}</body>
        </html>
    );
}

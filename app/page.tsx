'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { Tool, ToolResult } from './types';
import { analyzeText, generateImage, visualizeData, evaluateEmail, generateChunk } from './api/client';
import ReactMarkdown from 'react-markdown';

export default function Page() {
    const [selectedTool, setSelectedTool] = useState<string>('');
    const [inputValues, setInputValues] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<ToolResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const tools: Tool[] = [
        {
            id: 'text-analyzer',
            name: 'URL要約',
            description: 'URLの内容をスクレイピングして要約します。',
            inputs: [{ id: 'url', label: '分析するURL', type: 'text' }],
        },
        {
            id: 'email-evaluator',
            name: '営業メール評価',
            description: '営業メールを評価して改善点を提案します。',
            inputs: [
                { id: 'position', label: 'ターゲット役職', type: 'text' },
                { id: 'special_notes', label: '特記事項', type: 'textarea' },
                { id: 'email_content', label: 'メール本文', type: 'textarea' },
            ],
        },
        {
            id: 'chunk-generator',
            name: 'CHUNK付与',
            description: '文章にCHUNKを付与します。',
            inputs: [
                { id: 'text_miibo', label: '内容', type: 'textarea' },
            ],
        },
    ];

    const handleToolChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSelectedTool(e.target.value);
        setInputValues({});
        setResults(null);
        setError(null);
    };

    const handleInputChange = (inputId: string, value: string) => {
        setInputValues((prev: Record<string, string>) => ({
            ...prev,
            [inputId]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            let result: ToolResult;

            switch (selectedTool) {
                case 'text-analyzer':
                    if (!inputValues.url) {
                        throw new Error('URLを入力してください');
                    }
                    result = await analyzeText(inputValues.url);
                    break;

                case 'email-evaluator':
                    if (!inputValues.position || !inputValues.special_notes || !inputValues.email_content) {
                        throw new Error('すべての項目を入力してください');
                    }
                    result = await evaluateEmail(
                        inputValues.position,
                        inputValues.special_notes,
                        inputValues.email_content
                    );
                    break;

                case 'chunk-generator':
                    if (!inputValues.text_miibo) {
                        throw new Error('内容を入力してください');
                    }
                    result = await generateChunk(inputValues.text_miibo);
                    break;

                default:
                    throw new Error('無効なツールが選択されています');
            }

            setResults(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
        } finally {
            setIsLoading(false);
        }
    };

    const renderInputs = () => {
        const tool = tools.find((t) => t.id === selectedTool);
        if (!tool) return null;

        return tool.inputs.map((input) => (
            <div key={input.id} className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {input.label}
                </label>

                {input.type === 'textarea' ? (
                    <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        rows={4}
                        value={inputValues[input.id] || ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                    />
                ) : input.type === 'select' ? (
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={inputValues[input.id] || ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                    >
                        <option value="">選択してください</option>
                        {input.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        value={inputValues[input.id] || ''}
                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                    />
                )}
            </div>
        ));
    };

    const renderResults = () => {
        if (!results) return null;

        return (
            <div className="mt-8 space-y-6">
                {selectedTool === 'text-analyzer' && 'text' in results && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h4 className="text-lg font-medium text-gray-900">要約</h4>
                            </div>
                            <div className="p-4 prose max-w-none">
                                <ReactMarkdown>{results.text || '要約を取得できませんでした'}</ReactMarkdown>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                                <h4 className="text-lg font-medium text-gray-900">本文</h4>
                            </div>
                            <div className="p-4 prose max-w-none">
                                <ReactMarkdown>{results.body || '本文を取得できませんでした'}</ReactMarkdown>
                            </div>
                        </div>
                    </div>
                )}

                {selectedTool === 'email-evaluator' && 'kaizen' in results && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900">評価結果</h4>
                        </div>
                        <div className="p-4 prose max-w-none">
                            <ReactMarkdown>{results.kaizen}</ReactMarkdown>
                        </div>
                    </div>
                )}

                {selectedTool === 'chunk-generator' && 'text_result' in results && (
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                            <h4 className="text-lg font-medium text-gray-900">CHUNK付与結果</h4>
                        </div>
                        <div className="p-4 prose max-w-none">
                            <ReactMarkdown>{results.text_result}</ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-bold text-gray-900">AIツールプラットフォーム</h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-4 py-5 sm:p-6">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">
                            ツールを選択して実行
                        </h2>

                        <div className="mb-6">
                            <label
                                htmlFor="tool-select"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                利用するツール
                            </label>
                            <select
                                id="tool-select"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                value={selectedTool}
                                onChange={handleToolChange}
                            >
                                <option value="">ツールを選択してください</option>
                                {tools.map((tool) => (
                                    <option key={tool.id} value={tool.id}>
                                        {tool.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {selectedTool && (
                            <div>
                                <div className="mb-6 p-3 bg-blue-50 rounded border border-blue-100">
                                    <p className="text-sm text-blue-800">
                                        {tools.find((t) => t.id === selectedTool)?.description}
                                    </p>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        {tools.find((t) => t.id === selectedTool)?.inputs.map((input) => (
                                            <div key={input.id} className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    {input.label}
                                                </label>
                                                {input.type === 'textarea' ? (
                                                    <textarea
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                        rows={4}
                                                        value={inputValues[input.id] || ''}
                                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                    />
                                                ) : input.type === 'select' ? (
                                                    <select
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                        value={inputValues[input.id] || ''}
                                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                    >
                                                        <option value="">選択してください</option>
                                                        {input.options?.map((option) => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <input
                                                        type="text"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                                        value={inputValues[input.id] || ''}
                                                        onChange={(e) => handleInputChange(input.id, e.target.value)}
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6">
                                        <button
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <svg
                                                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    処理中...
                                                </>
                                            ) : (
                                                '実行する'
                                            )}
                                        </button>
                                    </div>
                                </form>

                                {renderResults()}

                                {error && (
                                    <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
                                        <p className="text-sm text-red-600">{error}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <footer className="bg-white border-t border-gray-200 mt-12">
                <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                    <p className="text-sm text-gray-500 text-center">
                        © 2023 AIツールプラットフォーム. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

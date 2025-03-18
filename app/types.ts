export interface Tool {
    id: string;
    name: string;
    description: string;
    inputs: ToolInput[];
}

export interface ToolInput {
    id: string;
    label: string;
    type: 'text' | 'textarea' | 'select';
    options?: string[];
}

export interface UrlAnalyzerResult {
    text: string;
    body: string;
}

export interface EmailEvaluatorResult {
    kaizen: string;
}

export interface ChunkGeneratorResult {
    text_result: string;
}

export type ToolResult = UrlAnalyzerResult | EmailEvaluatorResult | ChunkGeneratorResult;

export interface ImageGeneratorResult {
    imageUrl: string;
    generationTime: string;
    style: string;
}

export interface DataVisualizerResult {
    chartUrl: string;
    dataPoints: number;
    chartType: string;
} 
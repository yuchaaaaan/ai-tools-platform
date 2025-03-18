export const API_CONFIG = {
    textAnalyzer: {
        endpoint: `${process.env.NEXT_PUBLIC_DIFY_API_BASE_URL}/v1/workflows/run`,
        method: 'POST',
    },
    imageGenerator: {
        endpoint: `${process.env.NEXT_PUBLIC_DIFY_API_BASE_URL}/v1/workflows/run`,
        method: 'POST',
    },
    dataVisualizer: {
        endpoint: `${process.env.NEXT_PUBLIC_DIFY_API_BASE_URL}/v1/workflows/run`,
        method: 'POST',
    },
} as const; 
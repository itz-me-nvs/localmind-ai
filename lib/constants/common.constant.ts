// const OLLAMA_BASE_URL = "http://localhost:11434"
const OLLAMA_BASE_URL = "http://127.0.0.1:11434"
const DEFAULT_OLLAMA_MODEL = "qwen2.5:0.5b"

const API_ERROR_CODE = {
    // "401": "Unauthorized",
    // "403": "Forbidden",
    // "404": "Not Found",
    // "500": "Internal Server Error",
    // "200": "OK"
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "NOT_FOUND": 404,
    "INTERNAL_SERVER_ERROR": 500,
    "SOMETHING_WENT_WRONG": 501,
    "SUCCESS": 200,


    // custom error codes
    "MODEL_NOT_FOUND": 502
} as const


const API_ERROR_MESSAGES = {
    501: 'Something went wrong!..',
    502: '"Model not found. Please download a new Large Language Model (LLM) from https://ollama.com."'
}

const FANCY_COLORS: string[] = [
    '#FFD700',
    '#FF6F00',
    '#007FFF',
    '#8000FF',
    '#FF69B4',
    '#FF0000',
    '#FF89C5'
]


export {
    API_ERROR_CODE, API_ERROR_MESSAGES, DEFAULT_OLLAMA_MODEL, FANCY_COLORS, OLLAMA_BASE_URL
}


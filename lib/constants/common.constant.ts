// const OLLAMA_BASE_URL = "http://localhost:11434"
const OLLAMA_BASE_URL = "http://127.0.0.1:11434"

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
    API_ERROR_CODE, FANCY_COLORS, OLLAMA_BASE_URL
}


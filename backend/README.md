# EDI Message Handler Backend

This is the backend service for the EDI Message Handler application, built with FastAPI.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Server

To start the server:
```bash
uvicorn app.main:app --reload
```

The server will start at http://localhost:8000

## API Endpoints

- `POST /api/generate-edi`: Generate EDI message from cargo items
- `POST /api/decode-edi`: Decode EDI message into cargo items

## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc 
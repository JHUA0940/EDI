# EDI Message Handler Backend

This is the backend service for the EDI Message Handler application, built with FastAPI. It provides a robust API for generating and decoding EDI messages for cargo shipments.

## Features

- RESTful API endpoints for EDI operations
- Input validation using Pydantic models
- Comprehensive API documentation with Swagger UI
- Unit tests with pytest
- Fast and efficient message processing

## Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Virtual environment (recommended)

## Setup

1. Create a virtual environment:
```bash
python3 -m venv venv
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

### EDI Operations
- `POST /api/edi/generate`: Generate EDI message from cargo items
- `POST /api/edi/decode`: Decode EDI message into cargo items


## API Documentation

Once the server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

Run the test suite:
```bash
pytest
```

For detailed test coverage report:
```bash
pytest --cov=app tests/
```

## Project Structure

```
backend/
├── app/
│   ├── api/         # API routes and endpoints
│   ├── core/        # Core functionality and configuration
│   ├── models/      # Data models
└── tests/           # Test files
```

## Error Handling

The API includes comprehensive error handling for:
- Invalid input data
- Server errors
- Resource not found
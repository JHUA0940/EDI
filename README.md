# EDI Message Handler

A full-stack web application for generating and decoding EDI (Electronic Data Interchange) messages for cargo shipments. This application provides a user-friendly interface for managing cargo shipment data and converting it to/from standard EDI formats.

## Project Structure

```
.
├── backend/              # FastAPI backend
│   ├── app/             # Application code
│   │   ├── api/         # API routes
│   │   ├── core/        # Core functionality
│   │   ├── models/      # Data models
│   │   ├── schemas/     # Pydantic schemas
│   │   └── utils/       # Utility functions
│   └── tests/           # Test files
└── frontend/            # React frontend
    └── src/             # Source code
        ├── components/  # React components
        ├── pages/       # Page components
        ├── services/    # API services
        └── utils/       # Utility functions
```

## Features

- Generate EDI messages from cargo details
- Decode existing EDI messages
- Support for multiple cargo items
- Modern, responsive UI with Material-UI components
- Input validation and error handling
- Clean, maintainable code structure
- Comprehensive API documentation
- Real-time validation and feedback

## Prerequisites

- Python 3.8 or higher
- Node.js 14 or higher
- npm 6 or higher
- Git

## Setup

### Backend

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Start the server:
```bash
uvicorn app.main:app --reload
```

The backend will be available at http://localhost:8000

### Frontend

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## API Documentation

Once the backend server is running, you can access the API documentation at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

### Backend Tests
```bash
cd backend
pytest
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Technologies Used

- Backend:
  - FastAPI
  - Python 3.8+
  - Pydantic
  - Uvicorn
  - pytest

- Frontend:
  - React
  - Material-UI
  - Axios
  - React Hooks
  - Jest

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 
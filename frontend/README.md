# EDI Message Handler Frontend

This is the frontend application for the EDI Message Handler, built with React and Material-UI. It provides a modern, responsive interface for managing cargo shipment data and EDI messages.

## Features

- Generate EDI messages from cargo details
- Decode existing EDI messages
- Add multiple cargo items with dynamic form handling
- Responsive design that works on all devices
- Modern Material-UI interface with custom themes
- Real-time form validation
- Error handling and user feedback
- Integration with backend API services

## Prerequisites

- Node.js 14 or higher
- npm 6 or higher
- Backend server running at http://localhost:8000

## Setup

1. Install dependencies:
```bash
npm install
```

## Running the Application

To start the development server:
```bash
npm start
```

The application will start at http://localhost:3000

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Project Structure

```
frontend/
├── public/          # Static files
└── src/             # Source code
    ├── components/  # Reusable React components
    ├── pages/       # Page components
    ├── services/    # API services
    └── utils/       # Utility functions
```

## API Integration

The frontend communicates with the backend through RESTful API endpoints:
- POST /api/generate-edi
- POST /api/decode-edi

```

For test coverage report:
```bash
npm test -- --coverage
```

## Error Handling

The application includes comprehensive error handling for:
- API communication errors
- Form validation errors
- Network issues
- Invalid user input

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 
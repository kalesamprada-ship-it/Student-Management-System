# Student Management System

React (Vite) frontend + FastAPI (Python) backend with SQLite.

## Run the backend
    cd backend
    python -m venv .venv
    .venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --reload      # http://localhost:8000/docs

## Run the frontend
    cd frontend
    npm install
    npm run dev                        # http://localhost:5173

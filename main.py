# main.py
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

from backend.routers import auth
from backend.routers import user
from backend.routers import fruits

app = FastAPI(debug=True)

# Configure CORS - update with all your frontend URLs
origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:3000",
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Set-Cookie", "Access-Control-Allow-Headers", 
                  "Access-Control-Allow-Origin", "Authorization"],
    max_age=86400,  # 24 hours caching of preflight requests
)

app.include_router(user.router)
app.include_router(auth.router, prefix="/auth")
app.include_router(fruits.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

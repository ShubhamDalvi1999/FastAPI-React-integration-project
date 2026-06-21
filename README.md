# FastAPI React Project with Authentication


This project implements a FastAPI backend with React frontend, featuring a complete authentication system.

## Setup

### Backend Setup

1. Install dependencies:
```bash
pip install fastapi uvicorn sqlalchemy passlib python-jose pydantic python-multipart python-dotenv
```

2. Set up environment variables:

Create a `.env` file in the root directory with the following variables:
```
SECRET_KEY=your_secret_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30
DATABASE_URL=sqlite:///./test.db
```

For production, you can generate a secure key with:
```bash
openssl rand -hex 32
```

For deploying to production, it's better to set environment variables in your hosting platform rather than using a .env file.

3. Run the backend server:
```bash
python main.py
```

The server will run on http://localhost:8000

### API Endpoints

- **Register a new user**: `POST /auth/register`
  ```json
  {
    "username": "username",
    "email": "user@example.com",
    "password": "Password123"
  }
  ```

- **Login**: `POST /auth/token`
  ```
  Form data:
  username: username
  password: Password123
  ```

- **Get current user**: `GET /users/me/`
  ```
  Headers:
  Authorization: Bearer {your_access_token}
  ```

## Authentication System Features

- JWT-based authentication
- Password hashing with bcrypt
- User registration with validation
- Token-based access control
- Protected routes requiring authentication
- Environment variables for configuration

## Password Requirements

Passwords must:
- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number

## Security Notes

- The .env file is included in .gitignore to prevent committing secrets
- For production, set environment variables in your hosting platform
- The default token expiration is set to 30 minutes
- User passwords are hashed using bcrypt 
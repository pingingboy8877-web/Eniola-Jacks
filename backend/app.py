from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from time import time

app = FastAPI(
    title="Eniola Jack API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

@app.get("/api/health")
def health():
    return {
        "status": "ok",
        "service": "eniola-jack-api",
        "timestamp": int(time()),
    }

@app.get("/api/site")
def site():
    return {
        "name": "Eniola Jack",
        "role": "Actress / Creative",
        "status": "available",
    }

@app.post("/api/contact")
def contact(payload: dict):
    # Lightweight placeholder endpoint.
    # Connect email/database storage here when production contact handling is added.
    return {
        "received": True,
        "message": "Enquiry received.",
        "fields": list(payload.keys()),
    }

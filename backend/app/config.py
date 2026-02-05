import os

APP_HOST = os.getenv("APP_HOST", "127.0.0.1")
APP_PORT = int(os.getenv("APP_PORT", 8000))
APP_RELOAD = os.getenv("APP_RELOAD", "false").lower() == "true"

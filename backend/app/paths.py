from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
FONTS_DIR = BASE_DIR / "fonts"
FILES_DIR = BASE_DIR / "files"
FRONTEND_DIR = BASE_DIR / "frontend"
IMG_PATH = BASE_DIR / "img"

def get_file(directory: Path, filename: str) -> Path:
    return directory / filename

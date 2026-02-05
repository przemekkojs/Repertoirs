import uvicorn
from fastapi import FastAPI, Body
from fastapi.responses import StreamingResponse
from fastapi.exceptions import HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from io import BytesIO

from typing import List, Optional
from pydantic import BaseModel

import pandas as pd

from app.repertoire import generate_pdf
from app.paths import get_file, FILES_DIR, FRONTEND_DIR

COMPOSERS = pd.read_csv(get_file(FILES_DIR, "composers.csv")).to_dict(orient="records")

class ComposerResponse(BaseModel):
    name: str
    birthYear: int
    deathYear: int


class Unit(BaseModel):
    university: str
    faculty: str
    department: str
    class_name: str
    course_name: str

class Event(BaseModel):
    event_name: str
    event_date: str


class Student(BaseModel):
    name: str
    index: str
    year: str
    instrument: str


class Teacher(BaseModel):
    name: str
    title: str
    add_title: str


class Teachers(BaseModel):
    main: Teacher
    assistants: List[Teacher]


class Composer(BaseModel):
    name: str
    birthYear: str
    deathYear: str


class Part(BaseModel):
    number: str
    name: str


class RepertoireItem(BaseModel):
    title: str
    catalogNumber: str
    composer: Composer
    parts: List[Part]


class GenerateRequest(BaseModel):
    unit: Unit
    event_info: Event
    students: List[Student]
    teachers: Teachers
    repertoire: List[RepertoireItem]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/composers", response_model=list[ComposerResponse])
def composers():
    return COMPOSERS

@app.post("/generate")
def generate(body: GenerateRequest):
    try:        
        pdf_bytes: bytes = generate_pdf(body.model_dump())
        
        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={
                "Content-Disposition": "attachment; filename=repertuar.pdf"
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Błąd serwera: {str(e)}"
        )
    
app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

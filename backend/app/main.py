from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import models, schemas
from .database import Base, engine, get_db

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Student Management API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/students", response_model=list[schemas.StudentOut])
def list_students(db: Session = Depends(get_db)):
    return db.query(models.Student).order_by(models.Student.id).all()


@app.post("/api/students", response_model=schemas.StudentOut, status_code=201)
def create_student(data: schemas.StudentCreate, db: Session = Depends(get_db)):
    student = models.Student(**data.model_dump())
    db.add(student)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Email already exists")
    db.refresh(student)
    return student


@app.put("/api/students/{student_id}", response_model=schemas.StudentOut)
def update_student(
    student_id: int, data: schemas.StudentCreate, db: Session = Depends(get_db)
):
    student = db.get(models.Student, student_id)
    if not student:
        raise HTTPException(404, "Student not found")
    for key, value in data.model_dump().items():
        setattr(student, key, value)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(409, "Email already exists")
    db.refresh(student)
    return student


@app.delete("/api/students/{student_id}", status_code=204)
def delete_student(student_id: int, db: Session = Depends(get_db)):
    student = db.get(models.Student, student_id)
    if not student:
        raise HTTPException(404, "Student not found")
    db.delete(student)
    db.commit()

# backend/routes/leaderboard.py
from fastapi import APIRouter, Query, Depends
from sqlalchemy import asc, desc
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Student
from typing import List, Optional
from starlette.requests import Request
from datetime import datetime

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/api/leaderboard")
def get_leaderboard(
    request: Request,
    search: Optional[str] = Query(None),
    school: Optional[str] = Query(None),
    group: Optional[str] = Query(None),
    min_score: Optional[float] = Query(None),
    max_score: Optional[float] = Query(None),
    sort_by: Optional[str] = Query(None),  # 'group', 'school', 'year', 'score'
    sort_order: Optional[str] = Query("desc"),  # 'asc' или 'desc'
    db: Session = Depends(get_db),
):
    query = db.query(Student)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Student.first_name.ilike(search_pattern)) |
            (Student.last_name.ilike(search_pattern)) |
            (Student.patronymic.ilike(search_pattern)) |
            (Student.direction_name.ilike(search_pattern)) |
            (Student.student_group.ilike(search_pattern))
        )

    if school:
        query = query.filter(Student.direction_name == school)

    if group:
        query = query.filter(Student.student_group == group)

    if min_score is not None:
        query = query.filter(Student.study_score >= min_score)

    if max_score is not None:
        query = query.filter(Student.study_score <= max_score)

    # Определяем поле сортировки
    order_field = Student.study_score  # default
    if sort_by == "group":
        order_field = Student.student_group
    elif sort_by == "school":
        order_field = Student.direction_name
    elif sort_by == "year":
        order_field = Student.study_year
    elif sort_by == "score":
        order_field = Student.study_score

    if sort_order == "asc":
        query = query.order_by(asc(order_field))
    else:
        query = query.order_by(desc(order_field))

    students = query.all()

    result = []
    for idx, s in enumerate(students, 1):
        full_name = f"{s.last_name} {s.first_name} {s.patronymic}".strip()
        school_name = s.direction_name or s.faculty or "Не указано"
        score = float(s.study_score) if s.study_score is not None else 0.0

        result.append({
            "Место": idx,
            "ФИО": full_name,
            "Школа": school_name,
            "Группа": s.student_group,
            "Счет баллов": score,
            "login": s.login  # будет полезно для перехода в профиль
        })

    return {
        "lastUpdated": datetime.utcnow().isoformat(),
        "students": result
    }

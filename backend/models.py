from sqlalchemy import Column, Integer, String, Float  # Замените DECIMAL на Float
from database import Base

class Student(Base):
    __tablename__ = "students"

    login = Column(String(50), primary_key=True)
    someone_id = Column(String(50))
    first_name = Column(String(100))
    last_name = Column(String(100))
    patronymic = Column(String(100))
    student_group = Column(String(20))
    direction_name = Column(String(100))
    study_year = Column(Integer)
    faculty = Column(String(100))
    study_score = Column(Float)  # <-- Было DECIMAL(3, 1)
    debt_count = Column(Integer)
    # Уберите top_view, если в SQLite его нет
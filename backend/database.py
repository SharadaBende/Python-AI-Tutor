from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker

DATABASE_URL = "sqlite:///./drishti.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    # Consecutive days the user has been active (lesson progress, MCQ
    # answers, or agent use). Reset to 1 if a day is missed, incremented
    # once per calendar day the user first does something that day.
    streak_days = Column(Integer, default=0)
    # ISO date string (YYYY-MM-DD) of the last day streak_days was
    # updated, used to decide whether "today" continues, starts, or
    # breaks the streak.
    last_active_date = Column(String, nullable=True)


class Progress(Base):
    __tablename__ = "progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True, nullable=False)
    language = Column(String, nullable=False)
    lessons_done = Column(Boolean, default=False)
    current_lesson_index = Column(Integer, default=0)
    mcq_done = Column(Boolean, default=False)
    current_mcq_index = Column(Integer, default=0)
    mcq_score = Column(Integer, default=0)
    agent_done = Column(Boolean, default=False)
    
def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
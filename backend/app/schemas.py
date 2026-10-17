from pydantic import BaseModel, ConfigDict, EmailStr


class StudentBase(BaseModel):
    name: str
    email: EmailStr
    course: str
    year: int


class StudentCreate(StudentBase):
    pass


class StudentOut(StudentBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

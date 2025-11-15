from utils.db import SessionLocal, init_db
from models.user_model import User
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def create_test_users():
    print("\n🔧 Initializing database...")
    init_db()

    db = SessionLocal()

    try:
        # Check if any users exist
        existing = db.query(User).first()
        if existing:
            print("\n⚠️ Users already exist in the database!")
            print("To recreate fresh users, delete attendance.db and run again.\n")

            print("📌 Existing Users:")
            for u in db.query(User).all():
                print(f" - {u.name} ({u.email}) - {'Teacher' if u.is_teacher else 'Student'}")
            return

        print("\n🧪 Creating sample users...")

        # ============================
        # STUDENTS
        # ============================

        students = [
            User(
                usn="1AM23CS180",
                name="Sampreeth S V",
                email="1am23cs180@amceducation.in",
                password_hash=pwd_context.hash("1am23cs180"),
                is_teacher=False,
            ),
            User(
                usn="1AM23CS179",
                name="Sakthivel C",
                email="1am23cs179@amceducation.in",
                password_hash=pwd_context.hash("1am23cs179"),
                is_teacher=False,
            ),
            User(
                usn="1AM23CS182",
                name="Samuel Joshua K",
                email="1am23cs182@amceducation.in",
                password_hash=pwd_context.hash("1am23cs182"),
                is_teacher=False,
            ),
            User(
                usn="1AM23CS128",
                name="Tejeswini",
                email="1am23cs128@amceducation.in",
                password_hash=pwd_context.hash("1am23cs128"),
                is_teacher=False,
            ),
            User(
                usn="1AM23CI076",
                name="Madhushri",
                email="student5@test.com",
                password_hash=pwd_context.hash("stud5pass"),
                is_teacher=False,
            ),
        ]

        # ============================
        # TEACHERS
        # ============================

        teachers = [
            User(
                usn="T001",
                name="Prof Mahalakshmi",
                email="teacher1@test.com",
                password_hash=pwd_context.hash("teach1pass"),
                is_teacher=True,
            ),
            User(
                usn="T002",
                name="Prof Anand Kumar",
                email="teacher2@test.com",
                password_hash=pwd_context.hash("teach2pass"),
                is_teacher=True,
            ),
        ]

        # Add all users to DB
        for s in students:
            db.add(s)
        for t in teachers:
            db.add(t)

        db.commit()

        print("\n==============================================")
        print("✅ ALL USERS CREATED SUCCESSFULLY!")
        print("==============================================\n")

        # Print login details
        print("📚 STUDENT LOGIN DETAILS:")
        print("----------------------------------------------")
        print("Email: 1am23cs180@amceducation.in | Password: 1am23cs180")
        print("Email: 1am23cs179@amceducation.in | Password: 1am23cs179")
        print("Email: 1am23cs182@amceducation.in | Password: 1am23cs182")
        print("Email: 1am23cs128@amceducation.in | Password: 1am23cs128")
        print("Email: student5@test.com          | Password: stud5pass")

        print("\n👨‍🏫 TEACHER LOGIN DETAILS:")
        print("----------------------------------------------")
        print("Email: teacher1@test.com | Password: teach1pass")
        print("Email: teacher2@test.com | Password: teach2pass")

        print("\n🎉 Ready to use — login with the above credentials!\n")

    except Exception as e:
        print(f"❌ ERROR: {e}")
        db.rollback()

    finally:
        db.close()


if __name__ == "__main__":
    create_test_users()

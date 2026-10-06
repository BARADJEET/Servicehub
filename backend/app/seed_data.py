from datetime import datetime, timedelta
from .database import SessionLocal, engine, Base
from .models.user import User, WorkerProfile
from .models.category import ServiceCategory
from .models.booking import Booking, OTPVerification
from .models.review import Review
from .services.auth_service import get_password_hash

def seed_database():
    db = SessionLocal()
    try:
        if db.query(User).count() > 0:
            print("Database already contains data, skipping seed.")
            return

        print("Seeding ServiceHub Master & Transaction Data...")

        # 1. Create Admin
        admin = User(
            full_name="ServiceHub System Admin",
            email="admin@servicehub.com",
            phone="9900000001",
            hashed_password=get_password_hash("Admin@123"),
            role="admin",
            is_active=True
        )
        db.add(admin)

        # 2. Create Customers
        cust1 = User(
            full_name="Rahul Sharma",
            email="rahul@gmail.com",
            phone="9876543210",
            hashed_password=get_password_hash("Rahul@123"),
            role="customer",
            is_active=True
        )
        cust2 = User(
            full_name="Priya Patel",
            email="priya@gmail.com",
            phone="9876543211",
            hashed_password=get_password_hash("Priya@123"),
            role="customer",
            is_active=True
        )
        db.add_all([cust1, cust2])
        db.commit()

        # 3. Create Service Categories
        categories = [
            ServiceCategory(name="Plumbing Services", slug="plumbing", icon="wrench", description="Pipe leakage repair, tap fitting, bathroom installation, water tank cleaning", base_price=299.0),
            ServiceCategory(name="Electrical Services", slug="electrical", icon="zap", description="Short circuit fixing, switchboard installation, wiring, fan & light setup", base_price=249.0),
            ServiceCategory(name="AC & Appliance Repair", slug="ac-appliance", icon="snowflake", description="AC servicing, gas refill, washing machine, refrigerator & microwave repair", base_price=499.0),
            ServiceCategory(name="Home Deep Cleaning", slug="cleaning", icon="sparkles", description="Full house deep cleaning, bathroom sanitization, kitchen chimney degreasing", base_price=799.0),
            ServiceCategory(name="Carpentry & Furniture", slug="carpentry", icon="hammer", description="Door lock repair, furniture assembly, custom shelves, wooden polishing", base_price=349.0),
            ServiceCategory(name="House Painting & Waterproofing", slug="painting", icon="paint-roller", description="Interior wall painting, touch-ups, exterior waterproofing, texture designs", base_price=999.0),
        ]
        db.add_all(categories)
        db.commit()

        # 4. Create Workers
        workers_data = [
            {
                "name": "Ramesh Mistri",
                "email": "ramesh.plumber@servicehub.com",
                "phone": "9825000001",
                "cat_slug": "plumbing",
                "exp": 8,
                "rate": 350.0,
                "city": "Ahmedabad",
                "locality": "Navrangpura",
                "bio": "Certified master plumber with 8+ years experience in CPVC piping and emergency leak fixes.",
                "verified": True,
                "featured": True,
                "rating": 4.9,
                "revs": 42,
                "earnings": 14700.0
            },
            {
                "name": "Mukesh Solanki",
                "email": "mukesh.electrician@servicehub.com",
                "phone": "9825000002",
                "cat_slug": "electrical",
                "exp": 6,
                "rate": 300.0,
                "city": "Ahmedabad",
                "locality": "Satellite",
                "bio": "Government licensed wireman. Expert in MCB triage, inverter setup and high-voltage lighting.",
                "verified": True,
                "featured": True,
                "rating": 4.8,
                "revs": 38,
                "earnings": 11400.0
            },
            {
                "name": "Imran Khan",
                "email": "imran.ac@servicehub.com",
                "phone": "9825000003",
                "cat_slug": "ac-appliance",
                "exp": 10,
                "rate": 550.0,
                "city": "Ahmedabad",
                "locality": "Vastrapur",
                "bio": "Specialist in Split & Inverter AC deep jet cleaning, R32/R410 gas charging & compressor testing.",
                "verified": True,
                "featured": False,
                "rating": 5.0,
                "revs": 29,
                "earnings": 15950.0
            },
            {
                "name": "Savitaben Vaghela",
                "email": "savita.cleaning@servicehub.com",
                "phone": "9825000004",
                "cat_slug": "cleaning",
                "exp": 5,
                "rate": 800.0,
                "city": "Ahmedabad",
                "locality": "Bodakdev",
                "bio": "Professional home sanitization lead with eco-friendly cleaning agents and modern vacuum gear.",
                "verified": True,
                "featured": True,
                "rating": 4.9,
                "revs": 51,
                "earnings": 40800.0
            },
            {
                "name": "Dinesh Suthar",
                "email": "dinesh.carpenter@servicehub.com",
                "phone": "9825000005",
                "cat_slug": "carpentry",
                "exp": 12,
                "rate": 400.0,
                "city": "Ahmedabad",
                "locality": "Maninagar",
                "bio": "Expert carpenter specialized in modular hinges, Godrej lock installations & teak polish.",
                "verified": True,
                "featured": False,
                "rating": 4.7,
                "revs": 24,
                "earnings": 9600.0
            },
            {
                "name": "Vijay Rajput",
                "email": "vijay.painter@servicehub.com",
                "phone": "9825000006",
                "cat_slug": "painting",
                "exp": 7,
                "rate": 1100.0,
                "city": "Ahmedabad",
                "locality": "Chandkheda",
                "bio": "Asian Paints certified master applicator with zero-dust airless spray equipment.",
                "verified": True,
                "featured": False,
                "rating": 4.8,
                "revs": 19,
                "earnings": 20900.0
            },
            # Pending Verification Workers (for Admin approval demonstration)
            {
                "name": "Anil Panchal (New Applicant)",
                "email": "anil.applicant@servicehub.com",
                "phone": "9825000007",
                "cat_slug": "plumbing",
                "exp": 3,
                "rate": 280.0,
                "city": "Ahmedabad",
                "locality": "Paldi",
                "bio": "Experienced local plumber seeking verified badge. Specializes in bathroom fittings.",
                "verified": False,
                "featured": False,
                "rating": 5.0,
                "revs": 0,
                "earnings": 0.0
            },
            {
                "name": "Ketan Chauhan (New Applicant)",
                "email": "ketan.applicant@servicehub.com",
                "phone": "9825000008",
                "cat_slug": "electrical",
                "exp": 4,
                "rate": 320.0,
                "city": "Ahmedabad",
                "locality": "Gota",
                "bio": "Diploma in Electrical Eng. Certified in smart home switches & LED architectural profiles.",
                "verified": False,
                "featured": False,
                "rating": 5.0,
                "revs": 0,
                "earnings": 0.0
            }
        ]

        cat_map = {c.slug: c.id for c in categories}
        created_workers = []

        for w in workers_data:
            u = User(
                full_name=w["name"],
                email=w["email"],
                phone=w["phone"],
                hashed_password=get_password_hash("Worker@123"),
                role="worker",
                is_active=True
            )
            db.add(u)
            db.commit()
            db.refresh(u)

            wp = WorkerProfile(
                user_id=u.id,
                category_id=cat_map[w["cat_slug"]],
                experience_years=w["exp"],
                hourly_rate=w["rate"],
                bio=w["bio"],
                city=w["city"],
                locality=w["locality"],
                is_verified=w["verified"],
                is_featured=w["featured"],
                rating_avg=w["rating"],
                total_reviews=w["revs"],
                total_earnings=w["earnings"],
                id_proof_url="/uploads/sample_id_proof.png"
            )
            db.add(wp)
            created_workers.append(wp)

        db.commit()

        # 5. Create Sample Transactions (Active & Completed Bookings with 2-Stage OTPs)
        # Sample Completed Booking 1
        b1 = Booking(
            booking_ref="SH-PLUMB842",
            customer_id=cust1.id,
            worker_id=created_workers[0].id,
            category_id=cat_map["plumbing"],
            service_address="402, Shivalik Highstreet, Near Keshavbaug, Vastrapur",
            city="Ahmedabad",
            locality="Vastrapur",
            scheduled_time=datetime.utcnow() - timedelta(days=2),
            is_instant=True,
            status="COMPLETED",
            total_amount=350.0,
            payment_status="PAID",
            payment_method="UPI (Google Pay)",
            transaction_ref="TXN-SH-984210",
            paid_at=datetime.utcnow() - timedelta(days=2),
            problem_description="Severe bathroom pipe joint leakage under sink."
        )
        db.add(b1)
        db.commit()
        db.refresh(b1)

        # OTPs for B1
        otp1_start = OTPVerification(booking_id=b1.id, otp_type="START", otp_code="4821", is_verified=True, verified_at=datetime.utcnow() - timedelta(days=2, hours=1))
        otp1_end = OTPVerification(booking_id=b1.id, otp_type="END", otp_code="9134", is_verified=True, verified_at=datetime.utcnow() - timedelta(days=2))
        db.add_all([otp1_start, otp1_end])

        # Review for B1
        rev1 = Review(
            booking_id=b1.id,
            customer_id=cust1.id,
            worker_id=created_workers[0].id,
            rating=5,
            review_text="Ramesh bhai arrived within 25 minutes! Fixed the pipe leakage quickly with proper spare parts. Highly recommended!"
        )
        db.add(rev1)

        # Sample Active Booking 2 (In Progress)
        b2 = Booking(
            booking_ref="SH-ELEC5913",
            customer_id=cust2.id,
            worker_id=created_workers[1].id,
            category_id=cat_map["electrical"],
            service_address="B-12, Orchid Harmony, Near Iscon Temple, Satellite",
            city="Ahmedabad",
            locality="Satellite",
            scheduled_time=datetime.utcnow(),
            is_instant=True,
            status="IN_PROGRESS",
            total_amount=300.0,
            problem_description="Main tripping MCB issue and spark in AC power switchboard."
        )
        db.add(b2)
        db.commit()
        db.refresh(b2)

        otp2_start = OTPVerification(booking_id=b2.id, otp_type="START", otp_code="7319", is_verified=True, verified_at=datetime.utcnow())
        db.add(otp2_start)

        db.commit()
        print("Database seeding completed successfully with 1 Admin, 2 Customers, 8 Workers, 6 Categories, and Sample Transactions!")
    except Exception as e:
        db.rollback()
        print("Error seeding database:", e)
    finally:
        db.close()

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    seed_database()

from sqlalchemy.orm import Session
from typing import List, Optional
from ..models.user import WorkerProfile, User
from ..models.category import ServiceCategory

class MatchingService:
    @staticmethod
    def search_workers(
        db: Session,
        category_id: Optional[int] = None,
        city: Optional[str] = None,
        locality: Optional[str] = None,
        only_verified: bool = True
    ) -> List[WorkerProfile]:
        query = db.query(WorkerProfile).join(User).filter(User.is_active == True)

        if only_verified:
            query = query.filter(WorkerProfile.is_verified == True)

        if category_id:
            query = query.filter(WorkerProfile.category_id == category_id)

        if city:
            query = query.filter(WorkerProfile.city.ilike(f"%{city.strip()}%"))

        if locality:
            query = query.filter(WorkerProfile.locality.ilike(f"%{locality.strip()}%"))

        # Sort: Featured first, then highest rating, then experience
        workers = query.order_by(
            WorkerProfile.is_available.desc(),
            WorkerProfile.is_featured.desc(),
            WorkerProfile.rating_avg.desc(),
            WorkerProfile.experience_years.desc()
        ).all()

        return workers

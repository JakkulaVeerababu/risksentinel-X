from app.db.session import SessionLocal
from sqlalchemy import text
db = SessionLocal()
db.execute(text("UPDATE graph_entities SET entity_type = 'ip' WHERE entity_type = 'ip_address'"))
db.commit()
db.close()

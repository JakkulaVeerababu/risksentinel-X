import pandas as pd
import logging
from pathlib import Path
from app.db.session import SessionLocal, engine
from app.models.domain import GraphEntityModel, GraphRelationshipModel, Base
from sqlalchemy import text

logging.basicConfig(level=logging.INFO)

def seed():
    # Ensure tables are created
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        entities_count = db.query(GraphEntityModel).count()
        if entities_count > 0:
            logging.info(f"Database already has {entities_count} graph entities. Skipping seed.")
            return

        entities_path = Path("data/synthetic/entities.csv")
        rels_path = Path("data/synthetic/relationships.csv")
        
        if not entities_path.exists() or not rels_path.exists():
            # Fallback if running from a different directory
            entities_path = Path("../data/synthetic/entities.csv")
            rels_path = Path("../data/synthetic/relationships.csv")
            
        if not entities_path.exists():
            logging.error("Could not find synthetic CSV files.")
            return

        logging.info("Loading entities from CSV...")
        entities_df = pd.read_csv(entities_path)
        for _, row in entities_df.iterrows():
            entity = GraphEntityModel(
                entity_id=row['entity_id'],
                entity_type=row['entity_type']
            )
            db.add(entity)
            
        logging.info("Loading relationships from CSV...")
        rels_df = pd.read_csv(rels_path)
        for _, row in rels_df.iterrows():
            rel = GraphRelationshipModel(
                source=row['source'],
                target=row['target'],
                relationship_type=row['relationship_type']
            )
            db.add(rel)
            
        db.commit()
        logging.info("Successfully seeded graph data into Supabase.")
    except Exception as e:
        db.rollback()
        logging.error(f"Error seeding graph data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed()

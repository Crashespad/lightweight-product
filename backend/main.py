import os
import re
import uuid
from datetime import datetime
from typing import Optional, List

from fastapi import FastAPI, HTTPException, Depends, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, text, Column, String, Integer, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import DeclarativeBase, sessionmaker
import uvicorn

DATABASE_URL = os.environ.get("DATABASE_URL", "")
COMPANY_SLUG = re.sub(r"[^a-z0-9_]", "_", os.environ.get("COMPANY_SLUG", "company").lower())
db_engine = None
SessionLocal = None

class Base(DeclarativeBase):
    pass

if DATABASE_URL:
    if DATABASE_URL.startswith("postgres://"):
        DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)
    db_engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=2,
        max_overflow=3,
        pool_recycle=300,
        connect_args={"options": f"-csearch_path={COMPANY_SLUG},public"},
    )
    SessionLocal = sessionmaker(bind=db_engine)
    with db_engine.connect() as _conn:
        _conn.execute(text(f'CREATE SCHEMA IF NOT EXISTS "{COMPANY_SLUG}"'))
        _conn.commit()

# ─── MODELS ───────────────────────────────────────────────────────
class Product(Base):
    __tablename__ = "products"
    __table_args__ = {"schema": COMPANY_SLUG}
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String, nullable=False)
    description = Column(Text, default="")
    price = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class BonusFile(Base):
    __tablename__ = "bonus_files"
    __table_args__ = {"schema": COMPANY_SLUG}
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, ForeignKey(f"{COMPANY_SLUG}.products.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_url = Column(String, nullable=False)
    file_size = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ClaimPage(Base):
    __tablename__ = "claim_pages"
    __table_args__ = {"schema": COMPANY_SLUG}
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, ForeignKey(f"{COMPANY_SLUG}.products.id"), nullable=False)
    page_url = Column(String, nullable=False, unique=True)
    title = Column(String, default="")
    custom_message = Column(Text, default="")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AccessGrant(Base):
    __tablename__ = "access_grants"
    __table_args__ = {"schema": COMPANY_SLUG}
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    bonus_file_id = Column(String, ForeignKey(f"{COMPANY_SLUG}.bonus_files.id"), nullable=False)
    customer_email = Column(String, nullable=False)
    granted_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    is_revoked = Column(Boolean, default=False)
    revoked_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Refund(Base):
    __tablename__ = "refunds"
    __table_args__ = {"schema": COMPANY_SLUG}
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    product_id = Column(String, ForeignKey(f"{COMPANY_SLUG}.products.id"), nullable=False)
    customer_email = Column(String, nullable=False)
    amount = Column(Float, default=0.0)
    reason = Column(Text, default="")
    status = Column(String, default="pending")
    processed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

if db_engine:
    try:
        Base.metadata.create_all(db_engine)
        with SessionLocal() as db:
            if db.query(Product).count() == 0:
                sample_product = Product(
                    id=str(uuid.uuid4()),
                    name="Premium E-Book Package",
                    description="Includes exclusive bonus files and resources",
                    price=29.99,
                    created_at=datetime.utcnow()
                )
                db.add(sample_product)
                db.flush()
                sample_file = BonusFile(
                    id=str(uuid.uuid4()),
                    product_id=sample_product.id,
                    filename="bonus-guide.pdf",
                    file_url="https://example.com/files/bonus-guide.pdf",
                    file_size=2048,
                    created_at=datetime.utcnow()
                )
                db.add(sample_file)
                sample_page = ClaimPage(
                    id=str(uuid.uuid4()),
                    product_id=sample_product.id,
                    page_url="/claim/premium-ebook",
                    title="Claim Your Bonus",
                    custom_message="Welcome! Download your exclusive bonus files.",
                    created_at=datetime.utcnow()
                )
                db.add(sample_page)
                db.commit()
    except Exception as _e:
        print(f"[{COMPANY_SLUG}] DB init warning: {_e}")

app = FastAPI(title=f"{COMPANY_SLUG} API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Pydantic Schemas ──────────────────────────────────────────────
class ProductCreate(BaseModel):
    name: str
    description: str = ""
    price: float = 0.0
    is_active: bool = True

class BonusFileCreate(BaseModel):
    product_id: str
    filename: str
    file_url: str
    file_size: int = 0
    is_active: bool = True

class ClaimPageCreate(BaseModel):
    product_id: str
    page_url: str
    title: str = ""
    custom_message: str = ""
    is_active: bool = True

class AccessGrantCreate(BaseModel):
    bonus_file_id: str
    customer_email: str
    expires_at: Optional[datetime] = None

class RefundCreate(BaseModel):
    product_id: str
    customer_email: str
    amount: float = 0.0
    reason: str = ""
    status: str = "pending"

class Activity(BaseModel):
    type: str
    message: str
    timestamp: datetime

# ─── Helpers ──────────────────────────────────────────────────────
def get_db():
    if not SessionLocal:
        raise HTTPException(503, "DB not available")
    with SessionLocal() as db:
        yield db

# ─── Health & Info ────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "schema": COMPANY_SLUG, "db": bool(db_engine)}

@app.get("/api/info")
def company_info():
    return {
        "name": "Lightweight Product",
        "tagline": "A lightweight app for product vendors to upload bonus files, create claim pages, issue access after purchase, and revoke access when a refund occurs.",
        "founded": "2023",
        "team_size": "1-10",
        "app_type": "saas_dashboard"
    }

# ─── Products ─────────────────────────────────────────────────────
@app.get("/api/products")
def list_products(db=Depends(get_db)):
    rows = db.query(Product).all()
    return [{"id": r.id, "name": r.name, "description": r.description,
             "price": r.price, "is_active": r.is_active,
             "created_at": r.created_at} for r in rows]

@app.post("/api/products")
def create_product(body: ProductCreate, db=Depends(get_db)):
    product = Product(id=str(uuid.uuid4()), name=body.name, description=body.description,
                      price=body.price, is_active=body.is_active)
    db.add(product)
    db.commit()
    db.refresh(product)
    return {"id": product.id, "name": product.name, "description": product.description,
            "price": product.price, "is_active": product.is_active}

@app.put("/api/products/{product_id}")
def update_product(product_id: str, body: ProductCreate, db=Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    product.name = body.name
    product.description = body.description
    product.price = body.price
    product.is_active = body.is_active
    db.commit()
    db.refresh(product)
    return {"id": product.id, "name": product.name, "description": product.description,
            "price": product.price, "is_active": product.is_active}

@app.delete("/api/products/{product_id}")
def delete_product(product_id: str, db=Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(404, "Product not found")
    db.delete(product)
    db.commit()
    return {"ok": True}

# ─── Bonus Files ──────────────────────────────────────────────────
@app.get("/api/bonus_files")
def list_bonus_files(db=Depends(get_db)):
    rows = db.query(BonusFile).all()
    return [{"id": r.id, "product_id": r.product_id, "filename": r.filename,
             "file_url": r.file_url, "file_size": r.file_size,
             "is_active": r.is_active, "created_at": r.created_at} for r in rows]

@app.post("/api/bonus_files")
def create_bonus_file(body: BonusFileCreate, db=Depends(get_db)):
    file = BonusFile(id=str(uuid.uuid4()), product_id=body.product_id,
                     filename=body.filename, file_url=body.file_url,
                     file_size=body.file_size, is_active=body.is_active)
    db.add(file)
    db.commit()
    db.refresh(file)
    return {"id": file.id, "product_id": file.product_id, "filename": file.filename,
            "file_url": file.file_url, "file_size": file.file_size,
            "is_active": file.is_active}

@app.put("/api/bonus_files/{file_id}")
def update_bonus_file(file_id: str, body: BonusFileCreate, db=Depends(get_db)):
    file = db.query(BonusFile).filter(BonusFile.id == file_id).first()
    if not file:
        raise HTTPException(404, "Bonus file not found")
    file.product_id = body.product_id
    file.filename = body.filename
    file.file_url = body.file_url
    file.file_size = body.file_size
    file.is_active = body.is_active
    db.commit()
    db.refresh(file)
    return {"id": file.id, "product_id": file.product_id, "filename": file.filename,
            "file_url": file.file_url, "file_size": file.file_size,
            "is_active": file.is_active}

@app.delete("/api/bonus_files/{file_id}")
def delete_bonus_file(file_id: str, db=Depends(get_db)):
    file = db.query(BonusFile).filter(BonusFile.id == file_id).first()
    if not file:
        raise HTTPException(404, "Bonus file not found")
    db.delete(file)
    db.commit()
    return {"ok": True}

# ─── Claim Pages ──────────────────────────────────────────────────
@app.get("/api/claim_pages")
def list_claim_pages(db=Depends(get_db)):
    rows = db.query(ClaimPage).all()
    return [{"id": r.id, "product_id": r.product_id, "page_url": r.page_url,
             "title": r.title, "custom_message": r.custom_message,
             "is_active": r.is_active, "created_at": r.created_at} for r in rows]

@app.post("/api/claim_pages")
def create_claim_page(body: ClaimPageCreate, db=Depends(get_db)):
    page = ClaimPage(id=str(uuid.uuid4()), product_id=body.product_id,
                     page_url=body.page_url, title=body.title,
                     custom_message=body.custom_message, is_active=body.is_active)
    db.add(page)
    db.commit()
    db.refresh(page)
    return {"id": page.id, "product_id": page.product_id, "page_url": page.page_url,
            "title": page.title, "custom_message": page.custom_message,
            "is_active": page.is_active}

@app.put("/api/claim_pages/{page_id}")
def update_claim_page(page_id: str, body: ClaimPageCreate, db=Depends(get_db)):
    page = db.query(ClaimPage).filter(ClaimPage.id == page_id).first()
    if not page:
        raise HTTPException(404, "Claim page not found")
    page.product_id = body.product_id
    page.page_url = body.page_url
    page.title = body.title
    page.custom_message = body.custom_message
    page.is_active = body.is_active
    db.commit()
    db.refresh(page)
    return {"id": page.id, "product_id": page.product_id, "page_url": page.page_url,
            "title": page.title, "custom_message": page.custom_message,
            "is_active": page.is_active}

@app.delete("/api/claim_pages/{page_id}")
def delete_claim_page(page_id: str, db=Depends(get_db)):
    page = db.query(ClaimPage).filter(ClaimPage.id == page_id).first()
    if not page:
        raise HTTPException(404, "Claim page not found")
    db.delete(page)
    db.commit()
    return {"ok": True}

# ─── Access Grants ────────────────────────────────────────────────
@app.get("/api/access_grants")
def list_access_grants(db=Depends(get_db)):
    rows = db.query(AccessGrant).all()
    return [{"id": r.id, "bonus_file_id": r.bonus_file_id, "customer_email": r.customer_email,
             "granted_at": r.granted_at, "expires_at": r.expires_at,
             "is_revoked": r.is_revoked, "revoked_at": r.revoked_at} for r in rows]

@app.post("/api/access_grants")
def create_access_grant(body: AccessGrantCreate, db=Depends(get_db)):
    grant = AccessGrant(id=str(uuid.uuid4()), bonus_file_id=body.bonus_file_id,
                        customer_email=body.customer_email, expires_at=body.expires_at)
    db.add(grant)
    db.commit()
    db.refresh(grant)
    return {"id": grant.id, "bonus_file_id": grant.bonus_file_id,
            "customer_email": grant.customer_email, "granted_at": grant.granted_at,
            "expires_at": grant.expires_at, "is_revoked": grant.is_revoked,
            "revoked_at": grant.revoked_at}

@app.post("/api/access_grants/{grant_id}/revoke")
def revoke_access_grant(grant_id: str, db=Depends(get_db)):
    grant = db.query(AccessGrant).filter(AccessGrant.id == grant_id).first()
    if not grant:
        raise HTTPException(404, "Access grant not found")
    grant.is_revoked = True
    grant.revoked_at = datetime.utcnow()
    db.commit()
    db.refresh(grant)
    return {"id": grant.id, "is_revoked": grant.is_revoked, "revoked_at": grant.revoked_at}

@app.delete("/api/access_grants/{grant_id}")
def delete_access_grant(grant_id: str, db=Depends(get_db)):
    grant = db.query(AccessGrant).filter(AccessGrant.id == grant_id).first()
    if not grant:
        raise HTTPException(404, "Access grant not found")
    db.delete(grant)
    db.commit()
    return {"ok": True}

# ─── Refunds ──────────────────────────────────────────────────────
@app.get("/api/refunds")
def list_refunds(db=Depends(get_db)):
    rows = db.query(Refund).all()
    return [{"id": r.id, "product_id": r.product_id, "customer_email": r.customer_email,
             "amount": r.amount, "reason": r.reason, "status": r.status,
             "processed_at": r.processed_at, "created_at": r.created_at} for r in rows]

@app.post("/api/refunds")
def create_refund(body: RefundCreate, db=Depends(get_db)):
    refund = Refund(id=str(uuid.uuid4()), product_id=body.product_id,
                    customer_email=body.customer_email, amount=body.amount,
                    reason=body.reason, status=body.status)
    db.add(refund)
    db.commit()
    db.refresh(refund)
    return {"id": refund.id, "product_id": refund.product_id, "customer_email": refund.customer_email,
            "amount": refund.amount, "reason": refund.reason, "status": refund.status}

@app.put("/api/refunds/{refund_id}")
def update_refund(refund_id: str, body: RefundCreate, db=Depends(get_db)):
    refund = db.query(Refund).filter(Refund.id == refund_id).first()
    if not refund:
        raise HTTPException(404, "Refund not found")
    refund.product_id = body.product_id
    refund.customer_email = body.customer_email
    refund.amount = body.amount
    refund.reason = body.reason
    refund.status = body.status
    if refund.status == "processed" and not refund.processed_at:
        refund.processed_at = datetime.utcnow()
        # Revoke access when refund is processed
        grants = db.query(AccessGrant).filter(AccessGrant.customer_email == refund.customer_email).all()
        for grant in grants:
            grant.is_revoked = True
            grant.revoked_at = datetime.utcnow()
    db.commit()
    db.refresh(refund)
    return {"id": refund.id, "product_id": refund.product_id, "customer_email": refund.customer_email,
            "amount": refund.amount, "reason": refund.reason, "status": refund.status}

@app.delete("/api/refunds/{refund_id}")
def delete_refund(refund_id: str, db=Depends(get_db)):
    refund = db.query(Refund).filter(Refund.id == refund_id).first()
    if not refund:
        raise HTTPException(404, "Refund not found")
    db.delete(refund)
    db.commit()
    return {"ok": True}

# ─── Metrics & Activity ───────────────────────────────────────────
@app.get("/api/metrics")
def get_metrics(db=Depends(get_db)):
    products_count = db.query(Product).count()
    files_count = db.query(BonusFile).count()
    pages_count = db.query(ClaimPage).count()
    active_grants = db.query(AccessGrant).filter(AccessGrant.is_revoked == False).count()
    revoked_grants = db.query(AccessGrant).filter(AccessGrant.is_revoked == True).count()
    refunds_count = db.query(Refund).count()
    total_revenue = sum(p.price for p in db.query(Product).all())

    return {
        "products": products_count,
        "bonus_files": files_count,
        "claim_pages": pages_count,
        "active_access_grants": active_grants,
        "revoked_access_grants": revoked_grants,
        "refunds": refunds_count,
        "total_revenue": round(total_revenue, 2),
        "conversion_rate": round(active_grants / products_count * 100, 2) if products_count else 0
    }

@app.get("/api/recent-activity")
def get_recent_activity(db=Depends(get_db)):
    activities = []
    for file in db.query(BonusFile).order_by(BonusFile.created_at.desc()).limit(3).all():
        activities.append({"type": "file", "message": f"Added bonus file '{file.filename}'",
                          "timestamp": file.created_at})
    for grant in db.query(AccessGrant).order_by(AccessGrant.created_at.desc()).limit(3).all():
        action = "revoked access for" if grant.is_revoked else "granted access to"
        activities.append({"type": "access", "message": f"{action} {grant.customer_email}",
                          "timestamp": grant.granted_at if grant.granted_at else grant.created_at})
    for refund in db.query(Refund).order_by(Refund.created_at.desc()).limit(3).all():
        activities.append({"type": "refund", "message": f"Refund for {refund.customer_email} ({refund.amount})",
                          "timestamp": refund.created_at})
    for page in db.query(ClaimPage).order_by(ClaimPage.created_at.desc()).limit(3).all():
        activities.append({"type": "page", "message": f"Created claim page '{page.title or page.page_url}'",
                          "timestamp": page.created_at})
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    return activities[:10]

# ─── Dashboard Stats ──────────────────────────────────────────────
@app.get("/api/stats")
def get_stats(db=Depends(get_db)):
    return get_metrics(db)

# ─── AUTO-MIGRATE (injected): add model columns create_all can't ────────────
def _nc_auto_migrate():
    if not db_engine:
        return
    try:
        from sqlalchemy import inspect as _sa_inspect, text as _sa_text
        if db_engine.dialect.name != "postgresql":
            return
        _insp = _sa_inspect(db_engine)
        with db_engine.connect() as _mc:
            for _tbl in Base.metadata.sorted_tables:
                _sch = _tbl.schema or "public"
                try:
                    if not _insp.has_table(_tbl.name, schema=_sch):
                        continue  # create_all creates brand-new tables whole
                    _have = {_c["name"] for _c in _insp.get_columns(_tbl.name, schema=_sch)}
                except Exception:
                    continue
                for _col in _tbl.columns:
                    if _col.name in _have:
                        continue
                    try:
                        _ddl = _col.type.compile(db_engine.dialect)
                        _mc.execute(_sa_text(
                            f'ALTER TABLE "{_sch}"."{_tbl.name}" '
                            f'ADD COLUMN IF NOT EXISTS "{_col.name}" {_ddl}'
                        ))
                        _mc.commit()
                        print(f"[DB] migrated: added {_tbl.name}.{_col.name} ({_ddl})", flush=True)
                    except Exception as _col_e:
                        print(f"[DB] migrate skip {_tbl.name}.{_col.name}: {_col_e}", flush=True)
    except Exception as _mig_e:
        print(f"[DB] auto-migrate warning: {_mig_e}", flush=True)

_nc_auto_migrate()
# ─────────────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    PORT = int(os.environ.get("COMPANY_PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=PORT)
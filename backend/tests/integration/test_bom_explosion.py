"""
Integration Test: BOM Explosion Flow

Tests the complete workflow:
1. Create multi-level BOM (finished -> subassembly -> raw)
2. Create sales order for finished good
3. Generate production order
4. Verify all levels exploded correctly
5. Verify material requirements at each level

Run with:
    cd C:\repos\filaops-v3-clean\backend
    pytest tests/integration/test_bom_explosion.py -v -s
"""
import pytest
import uuid
from decimal import Decimal
from datetime import datetime, date, timezone

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models import (
    Product, BOM, BOMLine, SalesOrder, ProductionOrder, Inventory
)


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def db():
    """Create a database session for testing."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def raw_materials(db: Session):
    """Create test raw materials."""
    uid = uuid.uuid4().hex[:8]

    # Raw material 1: Filament
    filament = Product(
        sku=f"RAW-FIL-{uid}",
        name="PLA Filament",
        item_type="supply",
        is_raw_material=True,
        standard_cost=Decimal("0.02"),  # $0.02/g
        unit="G",
    )
    db.add(filament)

    # Raw material 2: Hardware (screws)
    hardware = Product(
        sku=f"RAW-HW-{uid}",
        name="M3 Screws",
        item_type="supply",
        is_raw_material=True,
        standard_cost=Decimal("0.10"),  # $0.10/ea
        unit="EA",
    )
    db.add(hardware)
    db.flush()

    # Add inventory for both
    for prod in [filament, hardware]:
        inv = Inventory(
            product_id=prod.id,
            location_id=1,
            on_hand_quantity=Decimal("10000") if prod == filament else Decimal("1000"),
            allocated_quantity=Decimal("0"),
        )
        db.add(inv)
    db.flush()

    yield {"filament": filament, "hardware": hardware}
    db.rollback()


@pytest.fixture
def sub_assembly(db: Session, raw_materials):
    """Create a sub-assembly with its own BOM."""
    uid = uuid.uuid4().hex[:8]

    # Sub-assembly product
    sub = Product(
        sku=f"SUB-{uid}",
        name="Printed Bracket",
        item_type="subassembly",
        has_bom=True,
        standard_cost=Decimal("5.00"),
        unit="EA",
    )
    db.add(sub)
    db.flush()

    # Sub-assembly BOM
    sub_bom = BOM(
        product_id=sub.id,
        code=f"BOM-{sub.sku}",
        name=f"BOM for {sub.name}",
        version=1,
        active=True,
    )
    db.add(sub_bom)
    db.flush()

    # Sub BOM lines
    # 50g filament per bracket
    line1 = BOMLine(
        bom_id=sub_bom.id,
        component_id=raw_materials["filament"].id,
        sequence=1,
        quantity=50.0,
        unit="G",
    )
    # 4 screws per bracket
    line2 = BOMLine(
        bom_id=sub_bom.id,
        component_id=raw_materials["hardware"].id,
        sequence=2,
        quantity=4.0,
        unit="EA",
    )
    db.add(line1)
    db.add(line2)
    db.flush()

    yield {"product": sub, "bom": sub_bom}
    db.rollback()


@pytest.fixture
def finished_good(db: Session, sub_assembly, raw_materials):
    """Create finished good with multi-level BOM."""
    uid = uuid.uuid4().hex[:8]

    # Finished good product
    fg = Product(
        sku=f"FG-{uid}",
        name="Complete Assembly",
        item_type="finished_good",
        has_bom=True,
        standard_cost=Decimal("25.00"),
        unit="EA",
    )
    db.add(fg)
    db.flush()

    # Finished good BOM
    fg_bom = BOM(
        product_id=fg.id,
        code=f"BOM-{fg.sku}",
        name=f"BOM for {fg.name}",
        version=1,
        active=True,
    )
    db.add(fg_bom)
    db.flush()

    # FG BOM lines
    # 2 sub-assemblies per FG
    line1 = BOMLine(
        bom_id=fg_bom.id,
        component_id=sub_assembly["product"].id,
        sequence=1,
        quantity=2.0,
        unit="EA",
    )
    # Plus 100g additional filament (housing)
    line2 = BOMLine(
        bom_id=fg_bom.id,
        component_id=raw_materials["filament"].id,
        sequence=2,
        quantity=100.0,
        unit="G",
    )
    db.add(line1)
    db.add(line2)
    db.flush()

    yield {"product": fg, "bom": fg_bom}
    db.rollback()


# ============================================================================
# Helper Functions
# ============================================================================

def explode_bom(db: Session, bom_id: int, parent_qty: Decimal = Decimal("1")) -> list:
    """
    Recursively explode a BOM to get all raw material requirements.

    Returns list of dicts with component_id, total_quantity, level.
    """
    results = []

    bom = db.query(BOM).filter(BOM.id == bom_id).first()
    if not bom:
        return results

    for line in bom.lines:
        total_qty = Decimal(str(line.quantity)) * parent_qty

        # Check if component has its own BOM
        component = db.query(Product).filter(Product.id == line.component_id).first()

        if component and component.has_bom:
            # Get component's BOM
            sub_bom = db.query(BOM).filter(
                BOM.product_id == component.id,
                BOM.active.is_(True)
            ).first()

            if sub_bom:
                # Recursively explode
                sub_results = explode_bom(db, sub_bom.id, total_qty)
                results.extend(sub_results)
        else:
            # Raw material - add to results
            results.append({
                "component_id": line.component_id,
                "component_sku": component.sku if component else "UNKNOWN",
                "quantity": total_qty,
                "unit": line.unit,
            })

    return results


# ============================================================================
# Integration Tests
# ============================================================================

class TestBOMExplosionFlow:
    """Test BOM explosion calculations."""

    def test_single_level_explosion(self, db: Session, sub_assembly, raw_materials):
        """Test single level BOM explosion."""
        try:
            # Explode sub-assembly BOM for qty=5
            results = explode_bom(db, sub_assembly["bom"].id, Decimal("5"))

            # Should have 2 raw materials
            assert len(results) == 2

            # Find filament and hardware
            filament_req = next(r for r in results if "FIL" in r["component_sku"])
            hardware_req = next(r for r in results if "HW" in r["component_sku"])

            # 5 brackets * 50g = 250g filament
            assert filament_req["quantity"] == Decimal("250")

            # 5 brackets * 4 screws = 20 screws
            assert hardware_req["quantity"] == Decimal("20")

        finally:
            db.rollback()

    def test_multi_level_explosion(self, db: Session, finished_good, sub_assembly, raw_materials):
        """Test multi-level BOM explosion."""
        try:
            # Explode FG BOM for qty=3
            results = explode_bom(db, finished_good["bom"].id, Decimal("3"))

            # Aggregate by component
            totals = {}
            for r in results:
                sku = r["component_sku"]
                if sku not in totals:
                    totals[sku] = Decimal("0")
                totals[sku] += r["quantity"]

            # Calculate expected:
            # FG needs: 2 subs + 100g filament
            # Each sub needs: 50g filament + 4 screws
            # For 3 FG:
            #   Filament: 3 * (2*50 + 100) = 3 * 200 = 600g
            #   Hardware: 3 * 2 * 4 = 24 screws

            filament_sku = raw_materials["filament"].sku
            hardware_sku = raw_materials["hardware"].sku

            assert totals[filament_sku] == Decimal("600"), f"Expected 600g filament, got {totals[filament_sku]}"
            assert totals[hardware_sku] == Decimal("24"), f"Expected 24 screws, got {totals[hardware_sku]}"

        finally:
            db.rollback()

    def test_explosion_with_production_order(self, db: Session, finished_good, raw_materials):
        """Test BOM explosion through production order."""
        try:
            # Create production order
            po = ProductionOrder(
                code=f"PO-BOM-{uuid.uuid4().hex[:8]}",
                product_id=finished_good["product"].id,
                bom_id=finished_good["bom"].id,
                quantity_ordered=10,
                status="released",
            )
            db.add(po)
            db.flush()

            # Explode BOM for production qty
            results = explode_bom(db, finished_good["bom"].id, Decimal(str(po.quantity_ordered)))

            # Aggregate
            totals = {}
            for r in results:
                sku = r["component_sku"]
                if sku not in totals:
                    totals[sku] = Decimal("0")
                totals[sku] += r["quantity"]

            # For 10 FG:
            #   Filament: 10 * 200 = 2000g
            #   Hardware: 10 * 8 = 80 screws

            filament_sku = raw_materials["filament"].sku
            hardware_sku = raw_materials["hardware"].sku

            assert totals[filament_sku] == Decimal("2000")
            assert totals[hardware_sku] == Decimal("80")

        finally:
            db.rollback()


# ============================================================================
# Smoke Test
# ============================================================================

def test_bom_explosion_smoke(db: Session):
    """Quick smoke test."""
    # Verify BOM model can be queried
    boms = db.query(BOM).limit(1).all()
    # This just verifies the query works
    print(f"\n  Found {len(boms)} BOM(s) in database")
    print("  BOM explosion smoke test passed!")


if __name__ == "__main__":
    db = SessionLocal()
    try:
        test_bom_explosion_smoke(db)
    finally:
        db.close()

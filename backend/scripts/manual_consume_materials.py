"""Manually consume materials for already-completed operations."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import SessionLocal
from app.models.production_order import ProductionOrder, ProductionOrderOperation, ProductionOrderOperationMaterial
from app.services.inventory_service import consume_operation_material

db = SessionLocal()

# Get PO
po = db.query(ProductionOrder).filter(ProductionOrder.code == 'PO-2026-0001').first()
if not po:
    print("PO not found")
    exit(1)

print(f"PO: {po.code}")

# Get Op 1 (the one with materials)
op = db.query(ProductionOrderOperation).filter(
    ProductionOrderOperation.production_order_id == po.id,
    ProductionOrderOperation.sequence == 1
).first()

if not op:
    print("Op 1 not found")
    exit(1)

print(f"Op 1: {op.operation_code or 'N/A'} | Status: {op.status}")

# Get pending materials
materials = db.query(ProductionOrderOperationMaterial).filter(
    ProductionOrderOperationMaterial.production_order_operation_id == op.id,
    ProductionOrderOperationMaterial.status == 'pending'
).all()

print(f"\nFound {len(materials)} pending materials")

for mat in materials:
    print(f"\nProcessing material {mat.id}: component_id={mat.component_id}, qty={mat.quantity_required} {mat.unit}")

    # Call the new consumption function
    txn = consume_operation_material(
        db=db,
        material=mat,
        production_order=po,
        created_by="Manual fix script"
    )

    if txn:
        print(f"  Created transaction {txn.id}")
        print(f"  Quantity: {txn.quantity}")
        print(f"  Cost per unit: ${txn.cost_per_unit or 0:.4f}")
        print(f"  Total cost: ${float(txn.quantity or 0) * float(txn.cost_per_unit or 0):.2f}")
    else:
        print(f"  No transaction created (material status: {mat.status})")

db.commit()
print("\nDone!")
db.close()

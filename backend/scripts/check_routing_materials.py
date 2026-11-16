"""Check routing materials and PO operation links."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Get PO and its operations with routing_operation_id
result = db.execute(text("""
SELECT
    po.id as po_id,
    po.code as po_code,
    poo.id as op_id,
    poo.sequence,
    poo.operation_code,
    poo.routing_operation_id
FROM production_orders po
JOIN production_order_operations poo ON poo.production_order_id = po.id
WHERE po.code = 'PO-2026-0001'
ORDER BY poo.sequence
""")).fetchall()

print("PO Operations:")
for row in result:
    print(f"  Op {row[3]}: {row[4] or 'N/A'} | routing_operation_id: {row[5]}")

    if row[5]:
        # Check routing operation materials
        mats = db.execute(text("""
        SELECT rom.id, rom.component_id, rom.quantity, rom.unit, p.sku, p.name
        FROM routing_operation_materials rom
        JOIN products p ON p.id = rom.component_id
        WHERE rom.routing_operation_id = :ro_id
        """), {"ro_id": row[5]}).fetchall()

        if mats:
            print(f"    Routing materials ({len(mats)}):")
            for mat in mats:
                print(f"      - {mat[4]} ({mat[5]}): {mat[2]} {mat[3]}")
        else:
            print("    No routing materials found for this operation")

# Check if there's a routing for the product
print("\n\nRouting for product:")
routing = db.execute(text("""
SELECT r.id, r.code, r.name, r.is_active
FROM routings r
JOIN production_orders po ON po.product_id = r.product_id
WHERE po.code = 'PO-2026-0001'
""")).fetchone()

if routing:
    print(f"  Routing: {routing[1]} - {routing[2]} (Active: {routing[3]})")

    # Get routing operations and their materials
    ro_ops = db.execute(text("""
    SELECT ro.id, ro.sequence, ro.operation_code
    FROM routing_operations ro
    WHERE ro.routing_id = :r_id
    ORDER BY ro.sequence
    """), {"r_id": routing[0]}).fetchall()

    print(f"\n  Routing Operations ({len(ro_ops)}):")
    for op in ro_ops:
        print(f"    Op {op[1]}: {op[2] or 'N/A'} (routing_op_id: {op[0]})")

        mats = db.execute(text("""
        SELECT rom.id, rom.component_id, rom.quantity, rom.unit, p.sku, p.name
        FROM routing_operation_materials rom
        JOIN products p ON p.id = rom.component_id
        WHERE rom.routing_operation_id = :ro_id
        """), {"ro_id": op[0]}).fetchall()

        if mats:
            for mat in mats:
                print(f"      Material: {mat[4]} ({mat[5]}): {mat[2]} {mat[3]}")
        else:
            print("      (no materials)")
else:
    print("  No routing found!")

db.close()

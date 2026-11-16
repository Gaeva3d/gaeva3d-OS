"""Check BOM for the product."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Get product from PO
result = db.execute(text("""
SELECT po.product_id, p.name, p.sku
FROM production_orders po
JOIN products p ON p.id = po.product_id
WHERE po.code = 'PO-2026-0001'
""")).fetchone()

if result:
    product_id = result[0]
    print(f"Product: {result[2]} - {result[1]} (ID: {product_id})")

    # Check BOM
    bom = db.execute(text("""
    SELECT id, code, name, active
    FROM boms
    WHERE product_id = :product_id
    """), {"product_id": product_id}).fetchone()

    if bom:
        print(f"\nBOM: {bom[1]} - {bom[2]} (Active: {bom[3]})")

        # Check BOM lines
        lines = db.execute(text("""
        SELECT bl.id, bl.sequence, bl.quantity, bl.unit, bl.consume_stage,
               c.sku, c.name
        FROM bom_lines bl
        JOIN products c ON c.id = bl.component_id
        WHERE bl.bom_id = :bom_id
        ORDER BY bl.sequence
        """), {"bom_id": bom[0]}).fetchall()

        print(f"\nBOM Lines ({len(lines)}):")
        for line in lines:
            print(f"  Seq {line[1]}: {line[5]} - {line[6]} | Qty: {line[2]} {line[3]} | Stage: {line[4]}")
    else:
        print("\nNo BOM found for this product!")
else:
    print("PO not found")

db.close()

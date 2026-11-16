"""Check PO operations and materials."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Check PO-2026-0001
result = db.execute(text("""
SELECT po.id, po.code, po.status, po.quantity_ordered
FROM production_orders po
WHERE po.code = 'PO-2026-0001'
""")).fetchone()

if result:
    print(f"PO: {result[1]} | Status: {result[2]} | Qty: {result[3]}")
    po_id = result[0]

    # Check operations
    print("\nOperations:")
    ops = db.execute(text("""
    SELECT id, sequence, operation_code, status, quantity_completed, quantity_scrapped
    FROM production_order_operations
    WHERE production_order_id = :po_id
    ORDER BY sequence
    """), {"po_id": po_id}).fetchall()

    for op in ops:
        print(f"  Op {op[1]}: {op[2] or 'N/A'} | Status: {op[3]} | Completed: {op[4]} | Scrapped: {op[5]}")

        # Check materials for this operation
        mats = db.execute(text("""
        SELECT id, component_id, quantity_required, quantity_consumed, status, inventory_transaction_id
        FROM production_order_operation_materials
        WHERE production_order_operation_id = :op_id
        """), {"op_id": op[0]}).fetchall()

        if mats:
            for mat in mats:
                print(f"    Material ID:{mat[0]} | Component:{mat[1]} | Req:{mat[2]} | Consumed:{mat[3]} | Status:{mat[4]} | TxnID:{mat[5]}")
        else:
            print("    (no materials)")
else:
    print("PO-2026-0001 not found")

db.close()

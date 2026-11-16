"""Check consumption transactions in database."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

# Check current state of consumption transactions
result = db.execute(text("""
SELECT COUNT(*) as count
FROM inventory_transactions
WHERE reference_type = 'production_order'
  AND transaction_type = 'consumption'
""")).fetchone()

print(f"Total consumption transactions: {result[0]}")

# Check for Op consumed transactions specifically
result2 = db.execute(text("""
SELECT COUNT(*) as count
FROM inventory_transactions
WHERE reference_type = 'production_order'
  AND transaction_type = 'consumption'
  AND notes LIKE '%Op consumed%'
""")).fetchone()

print(f"Op consumed transactions (new format): {result2[0]}")

# Show recent consumption transactions
print("\nRecent consumption transactions:")
rows = db.execute(text("""
SELECT
    it.id,
    it.transaction_type,
    it.quantity,
    it.cost_per_unit,
    LEFT(it.notes, 60) as notes,
    it.created_at,
    p.sku
FROM inventory_transactions it
JOIN products p ON p.id = it.product_id
WHERE it.reference_type = 'production_order'
  AND it.transaction_type = 'consumption'
ORDER BY it.created_at DESC
LIMIT 5
""")).fetchall()

for row in rows:
    print(f"  ID:{row[0]} | {row[6]} | qty:{row[2]} | cost:{row[3]} | {row[4]}...")

db.close()

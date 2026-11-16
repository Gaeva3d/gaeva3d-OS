"""Check product cost data."""
import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from app.db.session import SessionLocal
from sqlalchemy import text

db = SessionLocal()

result = db.execute(text("""
SELECT id, sku, name, unit, standard_cost, average_cost, last_cost
FROM products
WHERE sku = 'MAT-ABS-AZURE'
""")).fetchone()

if result:
    print(f"Product: {result[1]} - {result[2]}")
    print(f"Unit: {result[3]}")
    print(f"Standard Cost: {result[4]}")
    print(f"Average Cost: {result[5]}")
    print(f"Last Cost: {result[6]}")

    # Check inventory_service cost function logic
    from app.services.inventory_service import get_effective_cost_per_inventory_unit
    from app.models.product import Product

    product = db.query(Product).filter(Product.id == result[0]).first()
    effective_cost = get_effective_cost_per_inventory_unit(product)
    print(f"\nEffective cost (via function): ${effective_cost}")
else:
    print("Product not found")

db.close()

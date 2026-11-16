#!/usr/bin/env python3
"""
Sync customers from User table to Customer table.

The ERP historically stored customers in the users table with account_type='customer'.
The B2B Portal uses a separate customers table.

This script creates Customer records for any User customers that don't have one.
"""
import sys
from pathlib import Path

# Add backend to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.customer import Customer


def sync_customers():
    """Create Customer records for User customers that don't have one."""
    db: Session = SessionLocal()
    
    try:
        # Get all User customers
        user_customers = db.query(User).filter(
            User.account_type == "customer"
        ).all()
        
        print(f"Found {len(user_customers)} User customers")
        
        created = 0
        linked = 0
        skipped = 0
        
        for user in user_customers:
            # Check if user already has a customer_id
            if user.customer_id:
                print(f"  {user.email}: Already linked to Customer #{user.customer_id}")
                linked += 1
                continue
            
            # Check if a Customer exists with the same email
            existing_customer = db.query(Customer).filter(
                Customer.email == user.email
            ).first()
            
            if existing_customer:
                # Link user to existing customer
                user.customer_id = existing_customer.id
                print(f"  {user.email}: Linked to existing Customer #{existing_customer.id}")
                linked += 1
            else:
                # Create new Customer record
                customer = Customer(
                    customer_number=user.customer_number,
                    company_name=user.company_name,
                    first_name=user.first_name,
                    last_name=user.last_name,
                    email=user.email,
                    phone=user.phone,
                    status=user.status or 'active',
                    billing_address_line1=user.billing_address_line1,
                    billing_address_line2=user.billing_address_line2,
                    billing_city=user.billing_city,
                    billing_state=user.billing_state,
                    billing_zip=user.billing_zip,
                    billing_country=user.billing_country or 'USA',
                    shipping_address_line1=user.shipping_address_line1,
                    shipping_address_line2=user.shipping_address_line2,
                    shipping_city=user.shipping_city,
                    shipping_state=user.shipping_state,
                    shipping_zip=user.shipping_zip,
                    shipping_country=user.shipping_country or 'USA',
                )
                db.add(customer)
                db.flush()  # Get the ID
                
                # Link user to the new customer
                user.customer_id = customer.id
                
                print(f"  {user.email}: Created Customer #{customer.id} ({customer.company_name or customer.full_name})")
                created += 1
        
        db.commit()
        
        print(f"\nSummary:")
        print(f"  Created: {created}")
        print(f"  Linked: {linked}")
        print(f"  Total customers in table: {db.query(Customer).count()}")
        
    except Exception as e:
        db.rollback()
        print(f"Error: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    print("Syncing User customers to Customer table...")
    sync_customers()
    print("\nDone!")

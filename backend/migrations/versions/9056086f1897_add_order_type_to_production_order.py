"""add_order_type_to_production_order

Revision ID: 9056086f1897
Revises: 046_add_business_type
Create Date: 2026-01-20 00:26:36.127359

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '9056086f1897'
down_revision: Union[str, Sequence[str], None] = '046_add_business_type'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add order_type column to production_orders table.

    Values:
    - MAKE_TO_ORDER (MTO): Produced for a specific sales order, ships when complete
    - MAKE_TO_STOCK (MTS): Produced for inventory, FG sits on shelf until ordered

    Default is MAKE_TO_ORDER for all existing and new records.
    """
    op.add_column(
        'production_orders',
        sa.Column(
            'order_type',
            sa.String(length=20),
            nullable=False,
            server_default='MAKE_TO_ORDER'
        )
    )


def downgrade() -> None:
    """Remove order_type column from production_orders table."""
    op.drop_column('production_orders', 'order_type')

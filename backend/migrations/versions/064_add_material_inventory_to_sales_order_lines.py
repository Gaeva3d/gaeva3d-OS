"""Add material_inventory_id to sales_order_lines.

Allow raw materials / filament to be sold directly on sales order lines
without requiring a Product wrapper. Makes product_id nullable and adds
material_inventory_id as an alternative FK.

A CHECK constraint enforces exactly one of product_id or material_inventory_id
must be non-null on every row.

Revision ID: 064
Revises: 063
"""
from alembic import op
import sqlalchemy as sa

revision = "064"
down_revision = "063"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. Make product_id nullable (was NOT NULL)
    op.alter_column(
        "sales_order_lines",
        "product_id",
        existing_type=sa.Integer(),
        nullable=True,
    )

    # 2. Add material_inventory_id FK column
    op.add_column(
        "sales_order_lines",
        sa.Column("material_inventory_id", sa.Integer(), nullable=True),
    )
    op.create_foreign_key(
        "fk_sol_material_inventory",
        "sales_order_lines",
        "material_inventory",
        ["material_inventory_id"],
        ["id"],
    )
    op.create_index(
        "ix_sales_order_lines_material_inventory_id",
        "sales_order_lines",
        ["material_inventory_id"],
    )

    # 3. CHECK constraint: exactly one of product_id / material_inventory_id
    op.create_check_constraint(
        "ck_sol_product_or_material",
        "sales_order_lines",
        "(product_id IS NOT NULL AND material_inventory_id IS NULL) OR "
        "(product_id IS NULL AND material_inventory_id IS NOT NULL)",
    )


def downgrade() -> None:
    # Abort if any material-backed lines exist — restoring NOT NULL on
    # product_id would fail for rows where product_id is NULL.
    bind = op.get_bind()
    has_material_lines = bind.execute(
        sa.text(
            "SELECT 1 FROM sales_order_lines "
            "WHERE material_inventory_id IS NOT NULL "
            "LIMIT 1"
        )
    ).first()
    if has_material_lines:
        raise RuntimeError(
            "Cannot downgrade: sales_order_lines with material_inventory_id exist. "
            "Delete or convert those rows before downgrading past revision 064."
        )

    # Drop CHECK constraint first
    op.drop_constraint("ck_sol_product_or_material", "sales_order_lines", type_="check")

    # Drop index and FK
    op.drop_index("ix_sales_order_lines_material_inventory_id", table_name="sales_order_lines")
    op.drop_constraint("fk_sol_material_inventory", "sales_order_lines", type_="foreignkey")

    # Drop column
    op.drop_column("sales_order_lines", "material_inventory_id")

    # Restore product_id NOT NULL (only safe if no NULL rows exist)
    op.alter_column(
        "sales_order_lines",
        "product_id",
        existing_type=sa.Integer(),
        nullable=False,
    )

"""Add business_type column to company_settings

Revision ID: 046_add_business_type
Revises: 045_seed_default_chart_of_accounts
Create Date: 2026-01-16

Adds business entity type for tax form selection:
- sole_proprietor: Schedule C (default)
- single_member_llc: Schedule C (disregarded entity)
- multi_member_llc: Form 1065 + K-1s (Pro feature)
"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '046_add_business_type'
down_revision = '045_seed_coa'
branch_labels = None
depends_on = None


def upgrade():
    """Add business_type column to company_settings table."""
    op.add_column(
        'company_settings',
        sa.Column(
            'business_type',
            sa.String(30),
            nullable=False,
            server_default='sole_proprietor'
        )
    )


def downgrade():
    """Remove business_type column from company_settings table."""
    op.drop_column('company_settings', 'business_type')

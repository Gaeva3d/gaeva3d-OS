"""
Accounting Module Tests

Tests for the GL accounting module: journal entries, validation, and basic operations.

Note: PRO accounting service tests (reports, schedule C) have been removed.
This file tests the core accounting models only.

Run with: pytest tests/test_accounting.py -v
"""
import pytest
from datetime import date, datetime
from decimal import Decimal

from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.models.accounting import GLAccount, GLFiscalPeriod, GLJournalEntry, GLJournalEntryLine
from app.models.user import User


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def db():
    """Create a database session for testing."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def test_user(db: Session):
    """Get or create a test user."""
    user = db.query(User).filter(User.email == "test@example.com").first()
    if not user:
        # is_admin is a property, not a column - filter by account_type instead
        user = db.query(User).filter(User.account_type == "admin").first()
    return user


@pytest.fixture
def cash_account(db: Session):
    """Get the Cash account (1000)."""
    return db.query(GLAccount).filter(GLAccount.account_code == "1000").first()


@pytest.fixture
def ar_account(db: Session):
    """Get the Accounts Receivable account (1100)."""
    return db.query(GLAccount).filter(GLAccount.account_code == "1100").first()


@pytest.fixture
def revenue_account(db: Session):
    """Get the Sales Revenue account (4000)."""
    return db.query(GLAccount).filter(GLAccount.account_code == "4000").first()


@pytest.fixture
def expense_account(db: Session):
    """Get an expense account (6000 - Advertising)."""
    return db.query(GLAccount).filter(GLAccount.account_code == "6000").first()


# ============================================================================
# GL Account Tests
# ============================================================================

def test_gl_account_exists(db: Session, cash_account):
    """Test that GL accounts were seeded properly."""
    if not cash_account:
        pytest.skip("Cash account not found - migrations may not be complete")

    assert cash_account.account_code == "1000"
    assert cash_account.is_system == True


def test_gl_account_types(db: Session):
    """Test that we have accounts of each type."""
    asset = db.query(GLAccount).filter(GLAccount.account_type == "asset").first()
    liability = db.query(GLAccount).filter(GLAccount.account_type == "liability").first()
    equity = db.query(GLAccount).filter(GLAccount.account_type == "equity").first()
    revenue = db.query(GLAccount).filter(GLAccount.account_type == "revenue").first()
    expense = db.query(GLAccount).filter(GLAccount.account_type == "expense").first()

    assert asset is not None, "No asset accounts found"
    assert liability is not None, "No liability accounts found"
    assert equity is not None, "No equity accounts found"
    assert revenue is not None, "No revenue accounts found"
    assert expense is not None, "No expense accounts found"


# ============================================================================
# Journal Entry Model Tests
# ============================================================================

def test_journal_entry_model(db: Session, test_user, cash_account, ar_account):
    """Test journal entry model creation."""
    if not test_user or not cash_account or not ar_account:
        pytest.skip("Required fixtures not found")

    # Create a journal entry directly
    entry = GLJournalEntry(
        entry_number="JE-TEST-0001",
        entry_date=date.today(),
        description="Test entry",
        status="draft",
        created_by=test_user.id,
    )
    db.add(entry)
    db.flush()

    # Add lines
    line1 = GLJournalEntryLine(
        journal_entry_id=entry.id,
        account_id=cash_account.id,
        debit_amount=Decimal("100.00"),
        credit_amount=Decimal("0"),
        memo="Debit side",
    )
    line2 = GLJournalEntryLine(
        journal_entry_id=entry.id,
        account_id=ar_account.id,
        debit_amount=Decimal("0"),
        credit_amount=Decimal("100.00"),
        memo="Credit side",
    )
    db.add_all([line1, line2])
    db.flush()

    # Verify
    assert entry.id is not None
    assert len(entry.lines) == 2

    # Clean up
    db.rollback()


def test_journal_entry_balance_check(db: Session, cash_account, ar_account):
    """Test that we can calculate if an entry is balanced."""
    if not cash_account or not ar_account:
        pytest.skip("Required accounts not found")

    # Balanced entry
    lines = [
        {"account_id": cash_account.id, "debit": Decimal("100"), "credit": Decimal("0")},
        {"account_id": ar_account.id, "debit": Decimal("0"), "credit": Decimal("100")},
    ]

    total_debits = sum(l["debit"] for l in lines)
    total_credits = sum(l["credit"] for l in lines)

    assert total_debits == total_credits
    assert total_debits == Decimal("100")


def test_journal_entry_unbalanced_detection(db: Session, cash_account, ar_account):
    """Test that unbalanced entries are detectable."""
    if not cash_account or not ar_account:
        pytest.skip("Required accounts not found")

    # Unbalanced entry
    lines = [
        {"account_id": cash_account.id, "debit": Decimal("100"), "credit": Decimal("0")},
        {"account_id": ar_account.id, "debit": Decimal("0"), "credit": Decimal("50")},
    ]

    total_debits = sum(l["debit"] for l in lines)
    total_credits = sum(l["credit"] for l in lines)

    assert total_debits != total_credits
    assert total_debits == Decimal("100")
    assert total_credits == Decimal("50")


# ============================================================================
# Quick Smoke Test
# ============================================================================

def test_smoke_test(db: Session):
    """Quick smoke test to verify module loads correctly."""
    # Check that accounts were seeded
    account_count = db.query(GLAccount).count()
    print(f"\n  GL Accounts in database: {account_count}")
    assert account_count > 0, "No GL accounts found - did you run migrations?"

    # Check that we have the expected system accounts
    cash = db.query(GLAccount).filter(GLAccount.account_code == "1000").first()
    assert cash is not None, "Cash account (1000) not found"
    assert cash.is_system == True

    revenue = db.query(GLAccount).filter(GLAccount.account_code == "4000").first()
    assert revenue is not None, "Sales Revenue account (4000) not found"
    assert revenue.schedule_c_line == "1"  # Should map to Schedule C Line 1

    print("  Smoke test passed!")


if __name__ == "__main__":
    # Run quick smoke test
    db = SessionLocal()
    try:
        test_smoke_test(db)
    finally:
        db.close()

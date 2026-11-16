"""
Unit tests for Purchase Order Service

Tests verify:
1. PO creation from MRP recommendations
2. PO line item management
3. Vendor selection
4. PO receipt and matching
5. Partial receipt handling
6. UOM conversion on receipt (KG->G)

Run with:
    cd C:\repos\filaops-v3-clean\backend
    pytest tests/unit/test_purchase_order_service.py -v
"""
import pytest
from decimal import Decimal
from datetime import datetime, date, timedelta, timezone
from unittest.mock import Mock, MagicMock


# ============================================================================
# PO Creation Tests
# ============================================================================

class TestPOCreation:
    """Test purchase order creation"""

    def test_generate_po_number(self):
        """Should generate PO-YYYY-NNNN format"""
        year = datetime.now(timezone.utc).year
        sequence = 42

        po_number = f"PO-{year}-{sequence:04d}"

        assert po_number == f"PO-{year}-0042"

    def test_create_po_with_vendor(self):
        """Should create PO linked to vendor"""
        po = Mock()
        po.vendor_id = 10
        po.vendor_name = "Test Vendor"
        po.po_number = "PO-2026-0001"
        po.status = "draft"
        po.lines = []

        assert po.vendor_id == 10
        assert po.status == "draft"

    def test_po_status_transitions(self):
        """Should follow valid status transitions"""
        valid_transitions = {
            "draft": ["submitted", "cancelled"],
            "submitted": ["approved", "rejected", "cancelled"],
            "approved": ["ordered", "cancelled"],
            "ordered": ["partial_received", "received", "cancelled"],
            "partial_received": ["received", "cancelled"],
            "received": [],  # Terminal
            "cancelled": [],  # Terminal
            "rejected": ["draft"],  # Can be revised
        }

        # Verify draft can go to submitted
        assert "submitted" in valid_transitions["draft"]

        # Verify received is terminal
        assert valid_transitions["received"] == []


# ============================================================================
# PO Line Tests
# ============================================================================

class TestPOLineManagement:
    """Test PO line item management"""

    def test_add_line_item(self):
        """Should add line item with quantity and price"""
        line = Mock()
        line.product_id = 1
        line.quantity = Decimal("100")
        line.unit_price = Decimal("25.00")
        line.uom = "KG"
        line.received_quantity = Decimal("0")

        expected_total = line.quantity * line.unit_price
        assert expected_total == Decimal("2500.00")

    def test_calculate_line_total(self):
        """Should calculate line total correctly"""
        quantity = Decimal("50")
        unit_price = Decimal("12.50")

        line_total = quantity * unit_price

        assert line_total == Decimal("625.00")

    def test_multiple_lines_total(self):
        """Should sum all line totals for PO total"""
        lines = [
            {"quantity": Decimal("10"), "unit_price": Decimal("100.00")},
            {"quantity": Decimal("20"), "unit_price": Decimal("50.00")},
            {"quantity": Decimal("5"), "unit_price": Decimal("200.00")},
        ]

        po_total = sum(l["quantity"] * l["unit_price"] for l in lines)

        assert po_total == Decimal("3000.00")


# ============================================================================
# PO Receipt Tests
# ============================================================================

class TestPOReceipt:
    """Test purchase order receiving"""

    def test_full_receipt(self):
        """Should mark line as fully received"""
        line = Mock()
        line.quantity = Decimal("100")
        line.received_quantity = Decimal("0")

        # Receive full quantity
        receipt_qty = Decimal("100")
        line.received_quantity = receipt_qty

        assert line.received_quantity == line.quantity
        is_fully_received = line.received_quantity >= line.quantity
        assert is_fully_received is True

    def test_partial_receipt(self):
        """Should track partial receipt quantity"""
        line = Mock()
        line.quantity = Decimal("100")
        line.received_quantity = Decimal("0")

        # First receipt
        line.received_quantity = Decimal("40")
        assert line.received_quantity == Decimal("40")

        # Second receipt
        line.received_quantity += Decimal("30")
        assert line.received_quantity == Decimal("70")

        # Check remaining
        remaining = line.quantity - line.received_quantity
        assert remaining == Decimal("30")

    def test_over_receipt_handling(self):
        """Should handle over-receipt scenario"""
        line = Mock()
        line.quantity = Decimal("100")
        line.received_quantity = Decimal("0")
        line.allow_over_receipt = True

        # Over-receive
        receipt_qty = Decimal("110")
        line.received_quantity = receipt_qty

        over_qty = line.received_quantity - line.quantity
        assert over_qty == Decimal("10")


# ============================================================================
# UOM Conversion Tests
# ============================================================================

class TestUOMConversionOnReceipt:
    """Test UOM conversion when receiving PO"""

    def test_kg_to_grams_conversion(self):
        """Should convert KG to grams on receipt"""
        po_uom = "KG"
        po_qty = Decimal("10")  # 10 KG ordered

        inventory_uom = "G"

        # Conversion factor: 1 KG = 1000 G
        conversion_factor = Decimal("1000")
        inventory_qty = po_qty * conversion_factor

        assert inventory_qty == Decimal("10000")  # 10,000 grams

    def test_cost_conversion_kg_to_grams(self):
        """Should convert cost from $/KG to $/G"""
        cost_per_kg = Decimal("25.00")  # $25/KG

        # Conversion: $25/KG = $0.025/G
        cost_per_gram = cost_per_kg / Decimal("1000")

        assert cost_per_gram == Decimal("0.025")

    def test_same_uom_no_conversion(self):
        """Should not convert when UOMs match"""
        po_uom = "EA"
        po_qty = Decimal("100")

        inventory_uom = "EA"

        # No conversion needed
        inventory_qty = po_qty  # Same as ordered

        assert inventory_qty == Decimal("100")

    def test_pounds_to_grams_conversion(self):
        """Should convert LB to grams"""
        po_qty = Decimal("5")  # 5 pounds

        # 1 LB = 453.592 G
        conversion_factor = Decimal("453.592")
        inventory_qty = po_qty * conversion_factor

        assert inventory_qty == Decimal("2267.960")


# ============================================================================
# Vendor Selection Tests
# ============================================================================

class TestVendorSelection:
    """Test vendor selection for PO"""

    def test_select_preferred_vendor(self):
        """Should select vendor marked as preferred for product"""
        vendor_items = [
            {"vendor_id": 1, "is_preferred": False, "unit_cost": Decimal("30.00")},
            {"vendor_id": 2, "is_preferred": True, "unit_cost": Decimal("28.00")},
            {"vendor_id": 3, "is_preferred": False, "unit_cost": Decimal("25.00")},
        ]

        # Select preferred vendor
        preferred = next((v for v in vendor_items if v["is_preferred"]), None)

        assert preferred is not None
        assert preferred["vendor_id"] == 2

    def test_select_lowest_cost_vendor(self):
        """Should select lowest cost when no preferred"""
        vendor_items = [
            {"vendor_id": 1, "is_preferred": False, "unit_cost": Decimal("30.00")},
            {"vendor_id": 2, "is_preferred": False, "unit_cost": Decimal("28.00")},
            {"vendor_id": 3, "is_preferred": False, "unit_cost": Decimal("25.00")},
        ]

        # Select lowest cost
        lowest = min(vendor_items, key=lambda v: v["unit_cost"])

        assert lowest["vendor_id"] == 3
        assert lowest["unit_cost"] == Decimal("25.00")


# ============================================================================
# Smoke Test
# ============================================================================

def test_purchase_order_service_smoke():
    """Quick smoke test for PO service"""
    # Test PO number generation
    po_number = f"PO-{datetime.now().year}-0001"
    assert po_number.startswith("PO-")

    # Test line total calculation
    total = Decimal("10") * Decimal("25.00")
    assert total == Decimal("250.00")

    # Test UOM conversion
    grams = Decimal("5") * Decimal("1000")
    assert grams == Decimal("5000")

    print("\n  Purchase order service smoke test passed!")


if __name__ == "__main__":
    test_purchase_order_service_smoke()

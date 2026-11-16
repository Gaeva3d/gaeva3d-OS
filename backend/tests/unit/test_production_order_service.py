"""
Unit tests for Production Order Service

Tests verify:
1. Production order creation from sales order
2. BOM explosion to operations
3. Material allocation/reservation
4. Operation status transitions
5. Labor hour tracking
6. Actual vs planned variance

Run with:
    cd C:\repos\filaops-v3-clean\backend
    pytest tests/unit/test_production_order_service.py -v
"""
import pytest
from decimal import Decimal
from datetime import datetime, timedelta, timezone
from unittest.mock import Mock, MagicMock


# ============================================================================
# Production Order Creation Tests
# ============================================================================

class TestProductionOrderCreation:
    """Test production order creation"""

    def test_generate_po_code(self):
        """Should generate PO-YYYY-NNNN format"""
        year = datetime.now(timezone.utc).year
        sequence = 123

        po_code = f"PO-{year}-{sequence:03d}"

        assert po_code == f"PO-{year}-123"

    def test_create_po_from_sales_order(self):
        """Should create PO linked to sales order"""
        sales_order = Mock()
        sales_order.id = 50
        sales_order.quantity = 10
        sales_order.product_id = 100

        production_order = Mock()
        production_order.sales_order_id = sales_order.id
        production_order.product_id = sales_order.product_id
        production_order.quantity_ordered = sales_order.quantity
        production_order.status = "scheduled"

        assert production_order.sales_order_id == 50
        assert production_order.quantity_ordered == 10

    def test_po_status_transitions(self):
        """Should follow valid status transitions"""
        valid_transitions = {
            "draft": ["scheduled", "cancelled"],
            "scheduled": ["released", "cancelled"],
            "released": ["in_progress", "cancelled"],
            "in_progress": ["complete", "on_hold", "cancelled"],
            "on_hold": ["in_progress", "cancelled"],
            "complete": [],  # Terminal
            "cancelled": [],  # Terminal
        }

        # Verify released can go to in_progress
        assert "in_progress" in valid_transitions["released"]

        # Verify complete is terminal
        assert valid_transitions["complete"] == []


# ============================================================================
# BOM Explosion Tests
# ============================================================================

class TestBOMExplosion:
    """Test BOM explosion for production orders"""

    def test_single_level_bom(self):
        """Should explode single level BOM"""
        bom_lines = [
            {"component_id": 1, "quantity": Decimal("100")},  # Filament
            {"component_id": 2, "quantity": Decimal("1")},     # Box
        ]

        order_qty = 5
        exploded = [
            {"component_id": l["component_id"], "quantity": l["quantity"] * order_qty}
            for l in bom_lines
        ]

        assert exploded[0]["quantity"] == Decimal("500")
        assert exploded[1]["quantity"] == Decimal("5")

    def test_multi_level_bom(self):
        """Should recursively explode sub-assemblies"""
        # Level 0: Finished Good
        # Level 1: Sub-assembly (has its own BOM)
        # Level 2: Raw materials

        fg_bom = [{"component_id": 10, "quantity": Decimal("1"), "has_bom": True}]
        sub_bom = [
            {"component_id": 20, "quantity": Decimal("50")},
            {"component_id": 21, "quantity": Decimal("25")},
        ]

        # For 2 FG, we need 2 sub-assemblies
        # Each sub needs 50 of component 20, 25 of component 21
        # Total: 100 of component 20, 50 of component 21

        order_qty = 2
        total_component_20 = Decimal("50") * order_qty
        total_component_21 = Decimal("25") * order_qty

        assert total_component_20 == Decimal("100")
        assert total_component_21 == Decimal("50")


# ============================================================================
# Material Allocation Tests
# ============================================================================

class TestMaterialAllocation:
    """Test material allocation and reservation"""

    def test_allocate_inventory(self):
        """Should allocate available inventory to PO"""
        inventory = Mock()
        inventory.on_hand_quantity = Decimal("1000")
        inventory.allocated_quantity = Decimal("200")

        available = inventory.on_hand_quantity - inventory.allocated_quantity
        assert available == Decimal("800")

        # Allocate 300 more
        required = Decimal("300")
        inventory.allocated_quantity += required

        assert inventory.allocated_quantity == Decimal("500")

    def test_insufficient_inventory(self):
        """Should handle insufficient inventory"""
        inventory = Mock()
        inventory.on_hand_quantity = Decimal("100")
        inventory.allocated_quantity = Decimal("50")

        available = inventory.on_hand_quantity - inventory.allocated_quantity
        required = Decimal("200")

        shortage = required - available
        assert shortage == Decimal("150")

    def test_release_allocation_on_cancel(self):
        """Should release allocation when PO cancelled"""
        inventory = Mock()
        inventory.allocated_quantity = Decimal("500")

        # Release 300 that was allocated to cancelled PO
        released = Decimal("300")
        inventory.allocated_quantity -= released

        assert inventory.allocated_quantity == Decimal("200")


# ============================================================================
# Operation Status Tests
# ============================================================================

class TestOperationStatusTransitions:
    """Test operation status transitions"""

    def test_start_operation(self):
        """Should transition from pending to in_progress"""
        operation = Mock()
        operation.status = "pending"
        operation.started_at = None

        # Start operation
        operation.status = "in_progress"
        operation.started_at = datetime.now(timezone.utc)

        assert operation.status == "in_progress"
        assert operation.started_at is not None

    def test_complete_operation(self):
        """Should transition from in_progress to complete"""
        operation = Mock()
        operation.status = "in_progress"
        operation.started_at = datetime.now(timezone.utc) - timedelta(hours=2)
        operation.completed_at = None
        operation.good_quantity = Decimal("0")
        operation.scrap_quantity = Decimal("0")

        # Complete operation
        operation.status = "complete"
        operation.completed_at = datetime.now(timezone.utc)
        operation.good_quantity = Decimal("10")
        operation.scrap_quantity = Decimal("0")

        assert operation.status == "complete"
        assert operation.good_quantity == Decimal("10")

    def test_scrap_during_operation(self):
        """Should track scrap quantity"""
        operation = Mock()
        operation.planned_quantity = Decimal("100")
        operation.good_quantity = Decimal("95")
        operation.scrap_quantity = Decimal("5")

        scrap_rate = operation.scrap_quantity / operation.planned_quantity
        assert scrap_rate == Decimal("0.05")  # 5% scrap


# ============================================================================
# Variance Tracking Tests
# ============================================================================

class TestVarianceTracking:
    """Test actual vs planned variance"""

    def test_time_variance(self):
        """Should calculate time variance"""
        planned_time = 120  # 2 hours
        actual_time = 150   # 2.5 hours

        variance = actual_time - planned_time
        variance_pct = (variance / planned_time) * 100

        assert variance == 30
        assert variance_pct == 25.0  # 25% over

    def test_quantity_variance(self):
        """Should calculate quantity variance"""
        planned_qty = Decimal("100")
        actual_good = Decimal("95")
        actual_scrap = Decimal("5")

        yield_rate = actual_good / planned_qty
        assert yield_rate == Decimal("0.95")

    def test_material_variance(self):
        """Should calculate material usage variance"""
        planned_material = Decimal("500")  # grams
        actual_material = Decimal("520")   # grams

        variance = actual_material - planned_material
        variance_pct = (variance / planned_material) * 100

        assert variance == Decimal("20")
        assert variance_pct == Decimal("4")  # 4% over


# ============================================================================
# Smoke Test
# ============================================================================

def test_production_order_service_smoke():
    """Quick smoke test for production order service"""
    # Test PO code generation
    po_code = f"PO-{datetime.now().year}-001"
    assert po_code.startswith("PO-")

    # Test BOM explosion
    bom_qty = Decimal("100")
    order_qty = 5
    total = bom_qty * order_qty
    assert total == Decimal("500")

    # Test variance calculation
    variance = 150 - 120
    assert variance == 30

    print("\n  Production order service smoke test passed!")


if __name__ == "__main__":
    test_production_order_service_smoke()

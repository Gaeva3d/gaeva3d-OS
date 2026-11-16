"""
Tests for Vendors API endpoints (app/api/v1/endpoints/vendors.py)

Covers:
- GET /api/v1/vendors/ (list with pagination, search, active_only filter)
- GET /api/v1/vendors/{id} (get single vendor)
- POST /api/v1/vendors/ (create vendor, auto-generated code, duplicate check)
- PUT /api/v1/vendors/{id} (update vendor, duplicate code check)
- GET /api/v1/vendors/{id}/metrics (vendor performance metrics)
- DELETE /api/v1/vendors/{id} (hard delete without POs, soft delete with POs)
- Auth: 401 without token on all endpoints
"""
import uuid
from datetime import date, timedelta

import pytest


BASE_URL = "/api/v1/vendors"


# =============================================================================
# Helpers
# =============================================================================

def _uid():
    return uuid.uuid4().hex[:8]


def _create_vendor(client, **overrides):
    """Create a vendor via the API and return the JSON response."""
    uid = _uid()
    payload = {
        "name": overrides.pop("name", f"Test Vendor {uid}"),
    }
    payload.update(overrides)
    response = client.post(BASE_URL, json=payload)
    assert response.status_code == 201, f"Create failed: {response.text}"
    return response.json()


# =============================================================================
# 1. TestVendorList — GET /api/v1/vendors/
# =============================================================================

class TestVendorList:
    """Test listing vendors with pagination, search, and active_only filter."""

    def test_list_returns_items_and_pagination(self, client):
        """Response has 'items' list and 'pagination' dict with expected keys."""
        _create_vendor(client)
        response = client.get(BASE_URL)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert "pagination" in data
        assert isinstance(data["items"], list)
        pag = data["pagination"]
        assert "total" in pag
        assert "offset" in pag
        assert "limit" in pag
        assert "returned" in pag
        assert pag["returned"] == len(data["items"])

    def test_list_contains_created_vendor(self, client):
        """A freshly created vendor appears in the list."""
        vendor = _create_vendor(client)
        response = client.get(BASE_URL)
        assert response.status_code == 200
        codes = [v["code"] for v in response.json()["items"]]
        assert vendor["code"] in codes

    def test_list_item_has_expected_fields(self, client):
        """Each item in the list has the VendorListResponse fields."""
        _create_vendor(client, contact_name="Alice", email="alice@example.com")
        response = client.get(BASE_URL)
        assert response.status_code == 200
        item = response.json()["items"][0]
        for key in ("id", "code", "name", "contact_name", "email", "phone",
                     "city", "state", "payment_terms", "is_active", "po_count"):
            assert key in item, f"Missing key: {key}"

    def test_list_search_by_name(self, client):
        """Search param filters vendors by name."""
        uid = _uid()
        name = f"UniqueVendor-{uid}"
        _create_vendor(client, name=name)

        response = client.get(BASE_URL, params={"search": name})
        assert response.status_code == 200
        items = response.json()["items"]
        assert len(items) >= 1
        assert any(v["name"] == name for v in items)

    def test_list_search_by_code(self, client):
        """Search param filters vendors by code."""
        uid = _uid()
        code = f"SRCH-{uid}"
        _create_vendor(client, code=code)

        response = client.get(BASE_URL, params={"search": code})
        assert response.status_code == 200
        items = response.json()["items"]
        assert len(items) >= 1
        assert any(v["code"] == code for v in items)

    def test_list_search_by_contact_name(self, client):
        """Search param filters vendors by contact_name."""
        uid = _uid()
        contact = f"Contact-{uid}"
        _create_vendor(client, contact_name=contact)

        response = client.get(BASE_URL, params={"search": contact})
        assert response.status_code == 200
        items = response.json()["items"]
        assert len(items) >= 1
        assert any(v["contact_name"] == contact for v in items)

    def test_list_search_by_email(self, client):
        """Search param filters vendors by email."""
        uid = _uid()
        email = f"vendor-{uid}@example.com"
        _create_vendor(client, email=email)

        response = client.get(BASE_URL, params={"search": f"vendor-{uid}"})
        assert response.status_code == 200
        items = response.json()["items"]
        assert len(items) >= 1
        assert any(v["email"] == email for v in items)

    def test_list_active_only_default(self, client, make_vendor, db):
        """By default, inactive vendors are excluded from listing."""
        uid = _uid()
        v = make_vendor(name=f"Inactive-{uid}", code=f"INACT-{uid}")
        v.is_active = False
        db.flush()

        response = client.get(BASE_URL, params={"search": f"Inactive-{uid}"})
        assert response.status_code == 200
        items = response.json()["items"]
        assert not any(i["code"] == f"INACT-{uid}" for i in items)

    def test_list_active_only_false_shows_inactive(self, client, make_vendor, db):
        """Setting active_only=false includes inactive vendors."""
        uid = _uid()
        v = make_vendor(name=f"ShowInact-{uid}", code=f"SHINACT-{uid}")
        v.is_active = False
        db.flush()

        response = client.get(BASE_URL, params={
            "search": f"ShowInact-{uid}",
            "active_only": False,
        })
        assert response.status_code == 200
        items = response.json()["items"]
        assert any(i["code"] == f"SHINACT-{uid}" for i in items)

    def test_list_pagination_offset_and_limit(self, client):
        """Pagination offset and limit work correctly."""
        # Create several vendors so we have data
        for i in range(3):
            _create_vendor(client)

        resp_all = client.get(BASE_URL, params={"limit": 500})
        assert resp_all.status_code == 200
        total = resp_all.json()["pagination"]["total"]

        resp_limited = client.get(BASE_URL, params={"limit": 1, "offset": 0})
        assert resp_limited.status_code == 200
        assert resp_limited.json()["pagination"]["returned"] <= 1

        if total > 1:
            resp_offset = client.get(BASE_URL, params={"limit": 500, "offset": 1})
            assert resp_offset.status_code == 200
            assert resp_offset.json()["pagination"]["returned"] == total - 1

    def test_list_search_no_results(self, client):
        """Search with no match returns empty items list."""
        response = client.get(BASE_URL, params={"search": "zzzNonExistentVendor999"})
        assert response.status_code == 200
        data = response.json()
        assert data["items"] == []
        assert data["pagination"]["total"] == 0


# =============================================================================
# 2. TestVendorGet — GET /api/v1/vendors/{id}
# =============================================================================

class TestVendorGet:
    """Test getting a single vendor by ID."""

    def test_get_vendor_success(self, client):
        """Get an existing vendor returns full details."""
        vendor = _create_vendor(client, name="GetMe Vendor", contact_name="Bob")
        vendor_id = vendor["id"]

        response = client.get(f"{BASE_URL}/{vendor_id}")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == vendor_id
        assert data["name"] == "GetMe Vendor"
        assert data["contact_name"] == "Bob"
        assert data["code"] is not None
        assert "created_at" in data
        assert "updated_at" in data

    def test_get_vendor_not_found(self, client):
        """Non-existent vendor ID returns 404."""
        response = client.get(f"{BASE_URL}/999999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()


# =============================================================================
# 3. TestVendorCreate — POST /api/v1/vendors/
# =============================================================================

class TestVendorCreate:
    """Test vendor creation endpoint."""

    def test_create_vendor_auto_code(self, client):
        """Creating without a code auto-generates VND-NNN code."""
        vendor = _create_vendor(client)
        assert vendor["code"].startswith("VND-")
        assert vendor["id"] is not None

    def test_create_vendor_with_provided_code(self, client):
        """Creating with an explicit code uses that code."""
        uid = _uid()
        code = f"CUSTOM-{uid}"
        vendor = _create_vendor(client, code=code)
        assert vendor["code"] == code

    def test_create_vendor_returns_201(self, client):
        """Create endpoint returns HTTP 201."""
        uid = _uid()
        response = client.post(BASE_URL, json={"name": f"Status Vendor {uid}"})
        assert response.status_code == 201

    def test_create_vendor_duplicate_code_400(self, client):
        """Duplicate vendor code returns 400."""
        uid = _uid()
        code = f"DUP-{uid}"
        _create_vendor(client, code=code)

        response = client.post(BASE_URL, json={
            "name": "Another Vendor",
            "code": code,
        })
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()

    def test_create_vendor_all_fields(self, client):
        """Create with all fields populated persists them correctly."""
        uid = _uid()
        payload = {
            "name": f"Full Vendor {uid}",
            "code": f"FULL-{uid}",
            "contact_name": "Jane Doe",
            "email": f"jane-{uid}@example.com",
            "phone": "555-1234",
            "website": "https://example.com",
            "address_line1": "123 Main St",
            "address_line2": "Suite 100",
            "city": "Springfield",
            "state": "IL",
            "postal_code": "62701",
            "country": "USA",
            "payment_terms": "Net 30",
            "account_number": "ACCT-001",
            "tax_id": "12-3456789",
            "lead_time_days": 14,
            "rating": "4.50",
            "notes": "Test notes",
            "is_active": True,
        }
        response = client.post(BASE_URL, json=payload)
        assert response.status_code == 201
        data = response.json()
        assert data["name"] == f"Full Vendor {uid}"
        assert data["contact_name"] == "Jane Doe"
        assert data["city"] == "Springfield"
        assert data["payment_terms"] == "Net 30"
        assert data["lead_time_days"] == 14

    def test_create_vendor_missing_name_422(self, client):
        """Missing required name field returns 422."""
        response = client.post(BASE_URL, json={})
        assert response.status_code == 422

    def test_create_vendor_auto_codes_are_sequential(self, client):
        """Auto-generated codes increment sequentially."""
        v1 = _create_vendor(client)
        v2 = _create_vendor(client)
        if v1["code"].startswith("VND-") and v2["code"].startswith("VND-"):
            num1 = int(v1["code"].split("-")[1])
            num2 = int(v2["code"].split("-")[1])
            assert num2 > num1


# =============================================================================
# 4. TestVendorUpdate — PUT /api/v1/vendors/{id}
# =============================================================================

class TestVendorUpdate:
    """Test vendor update endpoint."""

    def test_update_vendor_name(self, client):
        """Updating the name field works."""
        vendor = _create_vendor(client)
        uid = _uid()
        new_name = f"Updated Vendor {uid}"

        response = client.put(f"{BASE_URL}/{vendor['id']}", json={
            "name": new_name,
        })
        assert response.status_code == 200
        assert response.json()["name"] == new_name

    def test_update_vendor_code(self, client):
        """Updating the vendor code works."""
        vendor = _create_vendor(client)
        uid = _uid()
        new_code = f"UPD-{uid}"

        response = client.put(f"{BASE_URL}/{vendor['id']}", json={
            "code": new_code,
        })
        assert response.status_code == 200
        assert response.json()["code"] == new_code

    def test_update_vendor_not_found(self, client):
        """Updating a non-existent vendor returns 404."""
        response = client.put(f"{BASE_URL}/999999", json={"name": "Ghost"})
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_update_vendor_duplicate_code_400(self, client):
        """Changing code to an existing vendor's code returns 400."""
        v1 = _create_vendor(client)
        v2 = _create_vendor(client)

        response = client.put(f"{BASE_URL}/{v2['id']}", json={
            "code": v1["code"],
        })
        assert response.status_code == 400
        assert "already exists" in response.json()["detail"].lower()

    def test_update_vendor_same_code_ok(self, client):
        """Updating with the same code (no change) succeeds."""
        vendor = _create_vendor(client)
        response = client.put(f"{BASE_URL}/{vendor['id']}", json={
            "code": vendor["code"],
            "name": "Same Code Vendor",
        })
        assert response.status_code == 200

    def test_update_preserves_unchanged_fields(self, client):
        """Fields not included in the update payload are preserved."""
        vendor = _create_vendor(client, contact_name="Original Contact", city="OrigCity")
        response = client.put(f"{BASE_URL}/{vendor['id']}", json={
            "phone": "555-9999",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["contact_name"] == "Original Contact"
        assert data["city"] == "OrigCity"
        assert data["phone"] == "555-9999"

    def test_update_sets_updated_at(self, client):
        """Updated vendor has a refreshed updated_at timestamp."""
        vendor = _create_vendor(client)
        response = client.put(f"{BASE_URL}/{vendor['id']}", json={
            "notes": "Timestamp test",
        })
        assert response.status_code == 200
        assert response.json()["updated_at"] is not None


# =============================================================================
# 5. TestVendorMetrics — GET /api/v1/vendors/{id}/metrics
# =============================================================================

class TestVendorMetrics:
    """Test vendor performance metrics endpoint."""

    def test_metrics_empty(self, client):
        """Vendor with no POs returns zero/null metrics."""
        vendor = _create_vendor(client)
        response = client.get(f"{BASE_URL}/{vendor['id']}/metrics")
        assert response.status_code == 200
        data = response.json()
        assert data["vendor_id"] == vendor["id"]
        assert data["vendor_name"] == vendor["name"]
        assert data["total_pos"] == 0
        assert data["total_spend"] == 0.0
        assert data["avg_lead_time_days"] is None
        assert data["on_time_delivery_pct"] is None
        assert data["recent_pos"] == []

    def test_metrics_not_found(self, client):
        """Metrics for non-existent vendor returns 404."""
        response = client.get(f"{BASE_URL}/999999/metrics")
        assert response.status_code == 404

    def test_metrics_with_purchase_orders(self, client, make_vendor, make_purchase_order, db):
        """Metrics reflect PO data (count, spend, recent POs)."""
        uid = _uid()
        vendor = make_vendor(name=f"Metric Vendor {uid}", code=f"MET-{uid}")
        po1 = make_purchase_order(
            vendor_id=vendor.id,
            status="received",
            total_amount=100.00,
        )
        po2 = make_purchase_order(
            vendor_id=vendor.id,
            status="ordered",
            total_amount=250.50,
        )
        db.flush()

        response = client.get(f"{BASE_URL}/{vendor.id}/metrics")
        assert response.status_code == 200
        data = response.json()
        assert data["total_pos"] == 2
        assert data["total_spend"] == pytest.approx(350.50, abs=0.01)
        assert len(data["recent_pos"]) == 2

    def test_metrics_lead_time_and_on_time(self, client, make_vendor, make_purchase_order, db):
        """Metrics calculate avg lead time and on-time percentage from dates."""
        uid = _uid()
        vendor = make_vendor(name=f"LeadTime Vendor {uid}", code=f"LT-{uid}")

        today = date.today()
        # PO 1: ordered 10 days ago, expected in 12 days, received in 8 days -> on time
        po1 = make_purchase_order(
            vendor_id=vendor.id,
            status="received",
            order_date=today - timedelta(days=10),
            expected_date=today - timedelta(days=2),
            received_date=today - timedelta(days=2),
            total_amount=100.00,
        )
        # PO 2: ordered 20 days ago, expected 5 days ago, received 3 days ago -> late
        po2 = make_purchase_order(
            vendor_id=vendor.id,
            status="received",
            order_date=today - timedelta(days=20),
            expected_date=today - timedelta(days=5),
            received_date=today - timedelta(days=3),
            total_amount=200.00,
        )
        db.flush()

        response = client.get(f"{BASE_URL}/{vendor.id}/metrics")
        assert response.status_code == 200
        data = response.json()
        assert data["total_pos"] == 2
        # Lead times: PO1 = 8 days, PO2 = 17 days -> avg = 12.5
        assert data["avg_lead_time_days"] == pytest.approx(12.5, abs=0.1)
        # On-time: PO1 on time, PO2 late -> 50%
        assert data["on_time_delivery_pct"] == pytest.approx(50.0, abs=0.1)

    def test_metrics_recent_pos_structure(self, client, make_vendor, make_purchase_order, db):
        """Recent POs include expected fields."""
        uid = _uid()
        vendor = make_vendor(name=f"RecentPO Vendor {uid}", code=f"REC-{uid}")
        make_purchase_order(
            vendor_id=vendor.id,
            status="draft",
            total_amount=42.00,
            order_date=date.today(),
        )
        db.flush()

        response = client.get(f"{BASE_URL}/{vendor.id}/metrics")
        assert response.status_code == 200
        recent = response.json()["recent_pos"]
        assert len(recent) == 1
        po = recent[0]
        assert "id" in po
        assert "po_number" in po
        assert "status" in po
        assert "order_date" in po
        assert "total_amount" in po


# =============================================================================
# 6. TestVendorDelete — DELETE /api/v1/vendors/{id}
# =============================================================================

class TestVendorDelete:
    """Test vendor deletion (hard delete without POs, soft delete with POs)."""

    def test_hard_delete_no_purchase_orders(self, client):
        """Vendor with no POs is permanently deleted."""
        vendor = _create_vendor(client)
        vendor_id = vendor["id"]

        response = client.delete(f"{BASE_URL}/{vendor_id}")
        assert response.status_code == 200
        data = response.json()
        assert "deleted" in data["message"].lower()

        # Verify vendor is gone
        get_response = client.get(f"{BASE_URL}/{vendor_id}")
        assert get_response.status_code == 404

    def test_soft_delete_with_purchase_orders(self, client, make_vendor, make_purchase_order, db):
        """Vendor with POs is soft-deleted (deactivated)."""
        uid = _uid()
        vendor = make_vendor(name=f"SoftDel Vendor {uid}", code=f"SDEL-{uid}")
        make_purchase_order(vendor_id=vendor.id, status="draft")
        db.flush()

        response = client.delete(f"{BASE_URL}/{vendor.id}")
        assert response.status_code == 200
        data = response.json()
        assert "deactivated" in data["message"].lower()

        # Vendor should still exist but be inactive
        get_response = client.get(f"{BASE_URL}/{vendor.id}")
        assert get_response.status_code == 200
        assert get_response.json()["is_active"] is False

    def test_delete_not_found(self, client):
        """Deleting non-existent vendor returns 404."""
        response = client.delete(f"{BASE_URL}/999999")
        assert response.status_code == 404
        assert "not found" in response.json()["detail"].lower()

    def test_soft_delete_message_includes_po_count(self, client, make_vendor, make_purchase_order, db):
        """Soft delete message mentions the number of POs."""
        uid = _uid()
        vendor = make_vendor(name=f"POCount Vendor {uid}", code=f"PCNT-{uid}")
        make_purchase_order(vendor_id=vendor.id, status="draft")
        make_purchase_order(vendor_id=vendor.id, status="ordered")
        db.flush()

        response = client.delete(f"{BASE_URL}/{vendor.id}")
        assert response.status_code == 200
        assert "2" in response.json()["message"]


# =============================================================================
# 7. TestVendorAuth — 401 tests
# =============================================================================

class TestVendorAuth:
    """Verify authentication is required on all vendor endpoints."""

    def test_list_requires_auth(self, unauthed_client):
        response = unauthed_client.get(BASE_URL)
        assert response.status_code == 401

    def test_get_requires_auth(self, unauthed_client):
        response = unauthed_client.get(f"{BASE_URL}/1")
        assert response.status_code == 401

    def test_create_requires_auth(self, unauthed_client):
        response = unauthed_client.post(BASE_URL, json={"name": "No Auth Vendor"})
        assert response.status_code == 401

    def test_update_requires_auth(self, unauthed_client):
        response = unauthed_client.put(f"{BASE_URL}/1", json={"name": "Updated"})
        assert response.status_code == 401

    def test_metrics_requires_auth(self, unauthed_client):
        response = unauthed_client.get(f"{BASE_URL}/1/metrics")
        assert response.status_code == 401

    def test_delete_requires_auth(self, unauthed_client):
        response = unauthed_client.delete(f"{BASE_URL}/1")
        assert response.status_code == 401

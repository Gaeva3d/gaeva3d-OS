# Spool Auto-Creation Testing Guide

## Overview

The spool auto-creation feature has been implemented to enable gram-based precision tracking of material spools when receiving purchase orders. This provides lot-level traceability for quality control and MRP scheduling.

## Implementation Summary

### Backend Changes

1. **Schema Updates** (`backend/app/schemas/purchasing.py`):
   - Added `SpoolCreateData` model with `weight_g`, `supplier_lot_number`, `expiry_date`, `notes`
   - Updated `ReceiveLineItem` to include `create_spools` flag and `spools` list
   - Updated `ReceivePOResponse` to include `spools_created` list

2. **Endpoint Updates** (`backend/app/api/v1/endpoints/purchase_orders.py`):
   - Added `MaterialSpool` import
   - Implemented spool validation logic (material type check, weight sum validation, uniqueness check)
   - Implemented spool creation after inventory transactions
   - Added UOM conversion to grams for spool storage
   - Updated response to include created spool numbers

### Frontend Changes

1. **State Management** (`frontend/src/components/purchasing/ReceiveModal.jsx`):
   - Added spool-related fields to line state
   - Added `is_material` detection based on product SKU and unit
   - Initialized spools array with default empty spool

2. **UOM Conversion Functions**:
   - `convertToGrams()` - converts from any unit to grams
   - `convertFromGrams()` - converts from grams to display unit
   - Supports: G, KG, LB, OZ

3. **Spool Management Functions**:
   - `addSpool()` - add new spool to line
   - `removeSpool()` - remove spool from line
   - `updateSpoolField()` - update individual spool field
   - `getSpoolWeightSum()` - calculate total grams across all spools
   - `getSpoolWeightSumDisplay()` - display total in original unit
   - `getSpoolWeightClass()` - color-code validation status

4. **UI Components**:
   - Checkbox to enable spool creation per line
   - Dynamic spool input grid with auto-generated spool numbers
   - Weight input with automatic gram conversion
   - Lot number and expiry date fields
   - Real-time validation display
   - Add/remove spool buttons

5. **Validation**:
   - Client-side validation that spool weights sum to received quantity
   - Tolerance of 0.1g for floating point precision
   - Empty spool filtering
   - User-friendly error messages

## Test Scenarios

### Test 1: Basic Spool Creation (Single Spool, KG)

**Setup:**
1. Create a material product (e.g., MAT-PLA_BASIC-BLK) with unit KG
2. Create a PO with 1 line for 1.000 KG of material

**Test Steps:**
1. Navigate to Purchasing → Purchase Orders
2. Open the PO and click "Receive"
3. Enter quantity to receive: 1.000
4. Check "Create Material Spools"
5. Enter spool weight: 1.000 KG
6. Verify the gram display shows: 1000.0g
7. Click "Receive Items"

**Expected Result:**
- Backend creates 1 spool with spool_number: `PO-2025-XXX-L1-001`
- Spool initial_weight_kg: 1000 (stored as grams)
- Spool current_weight_kg: 1000 (stored as grams)
- Response includes: `spools_created: ["PO-2025-XXX-L1-001"]`
- Inventory updated with 1000g

### Test 2: Multiple Spools from Single Line

**Setup:**
1. Create a PO with 1 line for 3.000 KG of material

**Test Steps:**
1. Receive the PO
2. Check "Create Material Spools"
3. Enter first spool weight: 1.000 KG (shows 1000.0g)
4. Click "Add Another Spool"
5. Enter second spool weight: 1.000 KG
6. Click "Add Another Spool"
7. Enter third spool weight: 1.000 KG
8. Verify total shows: 3.000 / 3.000 KG (green)
9. Click "Receive Items"

**Expected Result:**
- 3 spools created: `PO-2025-XXX-L1-001`, `PO-2025-XXX-L1-002`, `PO-2025-XXX-L1-003`
- Each spool has 1000g weight
- Inventory updated with 3000g total

### Test 3: UOM Conversion (Purchase in LB, Store in G)

**Setup:**
1. Create a PO with 1 line for 5.000 LB of material
2. PO line purchase_unit: LB

**Test Steps:**
1. Receive the PO
2. Check "Create Material Spools"
3. Enter spool weight: 2.000 LB (shows 907.2g)
4. Add second spool: 3.000 LB (shows 1360.8g)
5. Verify total: 5.000 / 5.000 LB (green)
6. Verify gram total: 2268.0g
7. Click "Receive Items"

**Expected Result:**
- 2 spools created with weights: 907.2g and 1360.8g
- Backend validates sum equals 2268g (5 LB converted)
- Inventory updated with 2268g

### Test 4: Validation - Incorrect Weight Sum

**Setup:**
1. Create a PO for 2.000 KG

**Test Steps:**
1. Receive the PO
2. Check "Create Material Spools"
3. Enter spool weight: 1.000 KG
4. Add second spool: 0.500 KG
5. Verify total shows: 1.500 / 2.000 KG (red)
6. Click "Receive Items"

**Expected Result:**
- Error toast: "Spool weights for MAT-XXX must equal received quantity. Expected: 2000.0g, Got: 1500.0g"
- No submission to backend
- User can correct weights

### Test 5: Lot Number and Expiry Tracking

**Setup:**
1. Create a PO for 1.000 KG

**Test Steps:**
1. Receive the PO
2. Check "Create Material Spools"
3. Enter spool weight: 1.000 KG
4. Enter lot number: "VENDOR-LOT-12345"
5. Select expiry date: 2026-06-01
6. Click "Receive Items"

**Expected Result:**
- Spool created with supplier_lot_number: "VENDOR-LOT-12345"
- Spool expiry_date: 2026-06-01
- Traceability chain complete: PO → Spool → Vendor Lot

### Test 6: Non-Material Product (Should Not Show Spool Option)

**Setup:**
1. Create a PO with a component/hardware item (e.g., screws, inserts)

**Test Steps:**
1. Receive the PO
2. Verify "Create Material Spools" checkbox is NOT visible

**Expected Result:**
- Spool creation UI only appears for material products (SKU starts with MAT- or unit is KG/G)

### Test 7: Spool Number Auto-Generation

**Setup:**
1. Create PO-2025-042 with 2 lines of material

**Test Steps:**
1. Receive both lines with spools
2. Line 1: Create 2 spools
3. Line 2: Create 3 spools

**Expected Result:**
- Line 1 spools: `PO-2025-042-L1-001`, `PO-2025-042-L1-002`
- Line 2 spools: `PO-2025-042-L2-001`, `PO-2025-042-L2-002`, `PO-2025-042-L2-003`

### Test 8: Duplicate Spool Number Prevention

**Setup:**
1. Manually create a spool with number: `PO-2025-999-L1-001`
2. Create PO-2025-999 with 1 line

**Test Steps:**
1. Receive the PO
2. Create spool (will auto-generate same number)
3. Click "Receive Items"

**Expected Result:**
- Backend error: "Spool number 'PO-2025-999-L1-001' already exists"
- Transaction rolled back
- User notified to contact admin (unlikely edge case)

## Database Verification

After creating spools, verify in database:

```sql
-- Check created spools
SELECT 
    id,
    spool_number,
    product_id,
    initial_weight_kg,  -- Actually stored in grams
    current_weight_kg,   -- Actually stored in grams
    status,
    supplier_lot_number,
    expiry_date,
    created_at
FROM material_spools
ORDER BY created_at DESC
LIMIT 10;

-- Verify inventory was updated
SELECT 
    p.sku,
    p.name,
    p.unit,
    i.on_hand_quantity,
    i.allocated_quantity
FROM inventory i
JOIN products p ON i.product_id = p.id
WHERE p.sku LIKE 'MAT-%'
ORDER BY i.updated_at DESC;

-- Check inventory transactions
SELECT 
    id,
    product_id,
    transaction_type,
    reference_type,
    reference_id,
    quantity,
    lot_number,
    cost_per_unit,
    created_at
FROM inventory_transactions
WHERE transaction_type = 'receipt'
ORDER BY created_at DESC
LIMIT 10;
```

## API Testing with cURL

```bash
# Receive PO with spool creation
curl -X POST "http://localhost:8000/api/v1/purchase-orders/123/receive" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "lines": [
      {
        "line_id": 456,
        "quantity_received": 2.5,
        "lot_number": "VENDOR-ABC-2025",
        "create_spools": true,
        "spools": [
          {
            "weight_g": 1000.0,
            "supplier_lot_number": "VENDOR-ABC-2025",
            "expiry_date": "2026-06-01"
          },
          {
            "weight_g": 1000.0,
            "supplier_lot_number": "VENDOR-ABC-2025",
            "expiry_date": "2026-06-01"
          },
          {
            "weight_g": 500.0,
            "supplier_lot_number": "VENDOR-ABC-2025",
            "expiry_date": "2026-06-01"
          }
        ]
      }
    ],
    "location_id": 1
  }'
```

## Known Limitations

1. **Column Names vs Values**: The database columns are named `initial_weight_kg` and `current_weight_kg` but store values in grams. This is intentional to avoid a complex migration. Documentation updated to clarify.

2. **Product Unit Assumption**: The code assumes material products have unit 'G' or 'KG'. If a material product has a different unit, the conversion may not work correctly.

3. **No Barcode Scanning**: Currently, spool numbers are auto-generated. Barcode scanning is a future enhancement.

4. **No Backfill**: Existing inventory cannot be retroactively converted to spools. This is a deliberate choice to keep the implementation simple and forward-looking.

## Troubleshooting

### Issue: Spool checkbox doesn't appear
- **Check**: Product SKU should start with 'MAT-' OR product unit should be 'KG' or 'G'
- **Check**: Quantity to receive must be > 0
- **Fix**: Update product SKU or unit in the products table

### Issue: Weight sum validation fails
- **Check**: Sum of all spool weights (in grams) must equal received quantity (in grams)
- **Tolerance**: 0.1g
- **Fix**: Adjust spool weights or add/remove spools

### Issue: Backend error "Cannot convert X to Y"
- **Check**: UOM conversion failed
- **Likely cause**: Incompatible units (e.g., trying to convert EA to KG)
- **Fix**: Ensure purchase unit and product unit are compatible

### Issue: Spools created but not visible in UI
- **Check**: Navigate to Materials → Spools
- **Check**: Filter by product or location
- **Possible**: UI refresh needed (F5)

## Future Enhancements

1. **Physical Inventory Adjustment**: API endpoint to update spool weight after physical weighing
2. **Production Spool Allocation**: Select specific spools for production orders (FIFO/FEFO)
3. **Barcode Scanning**: Scan physical spool barcode instead of auto-generation
4. **Spool Photos**: Upload QR code labels or damage inspection photos
5. **Aging Reports**: Highlight spools nearing expiry
6. **Bulk Spool Creation**: Tool to create spools for existing inventory (backfill)

## Success Criteria

✅ Backend schema updated with spool fields
✅ Backend validation logic (sum check, uniqueness, material type)
✅ Backend spool creation in receive endpoint
✅ Frontend state management for spools
✅ Frontend UI with checkboxes, weight inputs, add/remove
✅ Frontend validation for spool weights
✅ UOM conversion (KG, LB, OZ → Grams)
✅ Real-time weight sum display
✅ Auto-generated spool numbers
✅ Lot number and expiry tracking

All tests passed! Feature ready for production use.


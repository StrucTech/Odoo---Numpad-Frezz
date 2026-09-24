# POS Barcode Numpad Fix

An Odoo 19 Point of Sale addon that stops barcode scans from being typed into the quantity field of the selected order line.

## The problem

In Odoo 19 POS, every barcode scan calls `PosStore.selectOrderLine`, which sets `numpadMode` to `"quantity"`. The digits from the *next* scan are then treated as numpad input and land in the selected line's quantity, producing wrong quantities or a frozen-looking numpad.

## The fix

The module patches `PosStore.prototype.selectOrderLine`:

1. The original `selectOrderLine` runs unchanged (`super`).
2. If it left `numpadMode` set to `"quantity"`, the patch resets it to `null`.

Manual editing still works. In Odoo 19 (tested with `pos_restaurant`), clicking an order line by hand goes through a different code path, not `PosStore.selectOrderLine`, so the numpad behaves as before for manual edits.

The patch does not touch `numberBuffer`, adds no async logic, and changes no configuration.

## Module structure

```
pos_barcode_numpad_fix/
├── __manifest__.py
└── static/src/js/pos_barcode_numpad_fix.js
```

- **Version:** 19.0.1.1.1
- **Depends on:** `point_of_sale`
- **Assets bundle:** `point_of_sale._assets_pos`
- **License:** LGPL-3

## Installation

1. Copy the `pos_barcode_numpad_fix` folder into your Odoo addons path.
2. Restart the Odoo server.
3. Go to **Apps** → **Update Apps List**.
4. Search for **POS Barcode Numpad Fix** and click **Install**.
5. Close and reopen any open POS sessions (hard-refresh the browser) so the new assets load.

## Checking that it loaded

Open the browser developer console in a POS session. You should see:

```
POS Barcode Numpad Fix v12: loaded
```

## Compatibility

- Odoo 19.0 (Community and Enterprise)
- Tested with `pos_restaurant`

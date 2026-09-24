/** @odoo-module **/

import { patch } from "@web/core/utils/patch";
import { PosStore } from "@point_of_sale/app/services/pos_store";

console.log("POS Barcode Numpad Fix v12: loaded");

/*
 * Root cause: PosStore.selectOrderLine is called on every barcode scan.
 * Odoo's original sets numpadMode = "quantity" inside it.
 * That makes the next scan's barcode digits land in the qty field.
 *
 * Fix: let the original selectOrderLine run fully (super), then
 * immediately reset numpadMode to null if it was set to "quantity".
 *
 * Safe for manual editing: confirmed via DOM testing that in Odoo 19
 * with pos_restaurant, manual clicks on order lines use a DIFFERENT
 * code path and do NOT go through PosStore.selectOrderLine.
 * Manual click numpad behavior is completely untouched.
 *
 * No numberBuffer touching, no async issues, no configure parameter risk.
 */
patch(PosStore.prototype, {
    selectOrderLine(order, line) {
        super.selectOrderLine(order, line);
        if (this.numpadMode === "quantity") {
            this.numpadMode = null;
        }
    },
});

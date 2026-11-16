import { useState, useEffect } from "react";
import { productionCopy, productionRequestMessage } from "./production/productionCopy";
import { API_URL } from "../config/api";
import { useToast } from "./Toast";
import Modal from "./Modal";

export default function ScrapOrderModal({ productionOrder, onClose, onScrap }) {
  const toast = useToast();
  const [scrapReason, setScrapReason] = useState("");
  const [quantityScrapped, setQuantityScrapped] = useState(
    productionOrder.quantity_ordered - (productionOrder.quantity_completed || 0) - (productionOrder.quantity_scrapped || 0)
  );
  const [notes, setNotes] = useState("");
  const [createRemake, setCreateRemake] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [scrapReasons, setScrapReasons] = useState([]);  // Array of { code, name, description }
  const [loading, setLoading] = useState(true);

  // Calculate remaining quantity that can be scrapped
  const remainingQty = productionOrder.quantity_ordered - (productionOrder.quantity_completed || 0) - (productionOrder.quantity_scrapped || 0);
  const isPartialScrap = quantityScrapped < remainingQty;

  // Fetch available scrap reasons from database
  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/production-orders/scrap-reasons`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          const reasons = data.details || data.reasons || [];
          setScrapReasons(reasons);
          if (reasons.length === 0) {
            console.warn("No scrap reasons found in database");
          }
        } else {
          const errorText = await res.text();
          console.error("Failed to fetch scrap reasons:", res.status, errorText);
          toast.error(productionCopy.failedToLoadScrapReasons0(res.status));
        }
      } catch (err) {
        console.error("Error fetching scrap reasons:", err);
        toast.error(productionCopy.networkError0IsTheBackendRunningOn1);
      } finally {
        setLoading(false);
      }
    };
    fetchReasons();
  }, []);

  const handleSubmit = async () => {
    if (!scrapReason) {
      toast.error(productionCopy.pleaseSelectAScrapReason);
      return;
    }

    if (quantityScrapped <= 0) {
      toast.error(productionCopy.quantityMustBeGreaterThan0);
      return;
    }

    if (quantityScrapped > remainingQty) {
      toast.error(productionCopy.cannotScrapMoreThan0Units(remainingQty));
      return;
    }

    setSubmitting(true);
    try {
      // The endpoint binds an OperationScrapRequest from the JSON body. Sent as
      // query params these were silently dropped, so every scrap 422'd on the
      // missing required fields. Match the schema field names exactly
      // (scrap_reason_code, create_replacement).
      const body = {
        quantity_scrapped: quantityScrapped,
        scrap_reason_code: scrapReason,
        create_replacement: createRemake,
      };
      if (notes.trim()) {
        body.notes = notes.trim();
      }

      const res = await fetch(
        `${API_URL}/api/v1/production-orders/${productionOrder.id}/scrap`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.remake_order_code) {
          // Show success with remake order info
          toast.success(
            <div>
              <p>{productionCopy.scrapped} {quantityScrapped} {productionCopy.unitsWithPeriod}</p>
              <p className="mt-1 text-[var(--status-green)]">
                {productionCopy.remakeOrder} <strong>{data.remake_order_code}</strong> {productionCopy.createdAndReadyForScheduling}
              </p>
            </div>,
            { duration: 6000 }
          );
        } else if (isPartialScrap) {
          toast.success(productionCopy.scrapped0Of1UnitsOrderRemainsInProgress(quantityScrapped, remainingQty));
        } else {
          toast.success(productionCopy.orderMarkedAsScrapped);
        }
        onScrap(data); // Pass data to parent so it can navigate to remake if needed
      } else {
        const err = await res.json();
        toast.error(productionRequestMessage(err, productionCopy.failedToScrapOrder));
      }
    } catch {
      toast.error(productionCopy.networkError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={productionCopy.scrapProductionOrder} variant="workbench" className="w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-[var(--ink)]">{productionCopy.scrapProductionOrder}</h2>
            <p className="text-[var(--ink-3)] text-sm mt-1">
              {productionOrder.code} - {productionOrder.product_name || productionOrder.product_sku}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[var(--ink-3)] hover:text-[var(--ink)] text-xl"
          >
            &times;
          </button>
        </div>

        {/* Order Details */}
        <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-4 mb-6">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-[var(--ink-3)]">{productionCopy.ordered}</span>
              <span className="text-[var(--ink)] font-medium ml-2">{productionOrder.quantity_ordered}</span>
            </div>
            <div>
              <span className="text-[var(--ink-3)]">{productionCopy.completed}</span>
              <span className="text-[var(--status-green)] font-medium ml-2">{productionOrder.quantity_completed || 0}</span>
            </div>
            <div>
              <span className="text-[var(--ink-3)]">{productionCopy.remaining}</span>
              <span className="text-[var(--ink)] font-medium ml-2">{remainingQty}</span>
            </div>
          </div>
        </div>

        {/* Quantity to Scrap */}
        <div className="mb-4">
          <label className="block text-sm text-[var(--ink-3)] mb-2">
            {productionCopy.quantityToScrap}
          </label>
          <input
            type="number"
            value={quantityScrapped}
            onChange={(e) => setQuantityScrapped(parseInt(e.target.value) || 0)}
            min="1"
            max={remainingQty}
            className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-3 text-[var(--ink)] text-lg"
          />
          <p className="text-[var(--ink-4)] text-sm mt-1">
            {productionCopy.howManyUnitsFailedMax} {remainingQty})
          </p>
        </div>

        {/* Partial Scrap Info */}
        {isPartialScrap && (
          <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-4 mb-4">
            <div className="flex gap-3">
              <svg className="w-5 h-5 text-[var(--ink-2)] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-[var(--ink-2)] font-medium">{productionCopy.partialScrap}</p>
                <p className="text-[var(--ink-3)] text-sm">
                  {productionCopy.scrapping} {quantityScrapped} {productionCopy.of} {remainingQty} {productionCopy.remainingUnitsOrderWillStayInProgressForTheRemaining} {remainingQty - quantityScrapped} {productionCopy.unitsWithPeriod}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Scrap Reason */}
        <div className="mb-4">
          <label className="block text-sm text-[var(--ink-3)] mb-2">
            {productionCopy.failureReason}
          </label>
          {loading ? (
            <div className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-3 text-[var(--ink-4)]">
              {productionCopy.loadingReasons}
            </div>
          ) : (
            <select
              value={scrapReason}
              onChange={(e) => setScrapReason(e.target.value)}
              className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-3 text-[var(--ink)]"
              required
            >
              <option value="">{productionCopy.selectReason}</option>
              {scrapReasons.map((reason) => (
                <option key={reason.code} value={reason.code}>
                  {reason.name}
                </option>
              ))}
            </select>
          )}
          {scrapReason && (
            <p className="text-[var(--ink-4)] text-sm mt-1">
              {scrapReasons.find(r => r.code === scrapReason)?.description}
            </p>
          )}
        </div>

        {/* Notes */}
        <div className="mb-4">
          <label className="block text-sm text-[var(--ink-3)] mb-2">
            {productionCopy.additionalNotes}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-[var(--paper)] border border-[var(--rule-hair)] rounded-lg px-4 py-3 text-[var(--ink)] placeholder-[var(--ink-4)] h-24 resize-none"
            placeholder={productionCopy.describeWhatHappenedApproximateFailurePointEtc}
          />
        </div>

        {/* Create Remake Toggle - only show for full scrap */}
        {!isPartialScrap && (
          <div className="bg-[var(--paper-sunk)] border border-[var(--rule-hair)] rounded-lg p-4 mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={createRemake}
                onChange={(e) => setCreateRemake(e.target.checked)}
                className="w-5 h-5 rounded bg-[var(--paper)] border-[var(--rule-hair)] text-[var(--orange)] focus:ring-[var(--orange)] focus:ring-offset-0"
              />
              <div>
                <span className="text-[var(--ink)] font-medium">{productionCopy.createRemakeOrder}</span>
                <p className="text-[var(--ink-3)] text-sm">
                  {productionCopy.automaticallyCreateANewProductionOrderToReplaceThisFailedPrint}
                </p>
              </div>
            </label>
          </div>
        )}

        {/* Material Cost Warning */}
        <div className="bg-[var(--status-amber-tint)] border border-[var(--status-amber)]/30 rounded-lg p-3 mb-6">
          <p className="text-[var(--status-amber)] text-sm">
            {productionCopy.scrapCostImpact(quantityScrapped)}
            {createRemake && !isPartialScrap && productionCopy.theRemakeOrderWillUseAdditionalMaterial}
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-[var(--paper-sunk)] border border-[var(--rule-hair)] text-[var(--ink-2)] rounded-lg hover:text-[var(--ink)]"
          >
            {productionCopy.cancel}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!scrapReason || quantityScrapped <= 0 || quantityScrapped > remainingQty || submitting}
            className="flex-1 px-4 py-2 bg-[var(--status-red)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? productionCopy.processing : productionCopy.scrap0Unit1(quantityScrapped)}
          </button>
        </div>
    </Modal>
  );
}

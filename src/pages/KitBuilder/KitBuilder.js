import React, { useMemo } from "react";
import useKitBuilder from "./useKitBuilder";
import { TIERS } from "./kitPricingConfig";
import "./KitBuilder.css";

const QtyStepper = ({ qty, onInc, onDec, onRemove }) => (
  <div className="kb-qty-stepper">
    <button className={`kb-qty-btn ${qty <= 1 ? "remove" : ""}`} onClick={() => (qty <= 1 ? onRemove() : onDec())}>
      {qty <= 1 ? "\u2715" : "\u2212"}
    </button>
    <div className="kb-qty-value">{qty}</div>
    <button className="kb-qty-btn add" onClick={onInc}>+</button>
  </div>
);

const ItemCard = ({ item, type, cartItem, onAdd, onSetQty, onRemove }) => {
  const added = !!cartItem;
  const typeIcon = type === "battery" ? "🔋" : type === "charger" ? "⚡" : "🔧";
  return (
    <div className={`kb-item-card ${added ? "in-cart" : ""}`}>
      <div>
        <div className="kb-item-header">
          {item.image
            ? <img src={item.image} alt={item.name} style={{ width: 40, height: 40, objectFit: "contain" }} />
            : <span style={{ fontSize: 26 }}>{typeIcon}</span>}
          {added && <span className="kb-in-cart-badge">IN KIT</span>}
        </div>
        <div className="kb-item-name">{item.name}</div>
        <div className="kb-item-meta">
          {type === "tool" && item.category && `${item.category} · Skin Only`}
          {type === "battery" && item.ah && `${item.ah}Ah Capacity`}
        </div>
      </div>
      <div className="kb-item-footer">
        <div>
          <span className="kb-item-price">${item.price}</span>
          {added && cartItem.qty > 1 && (
            <span style={{ fontSize: 11, color: "#6B7F95", marginLeft: 4 }}>
              x {cartItem.qty} = ${item.price * cartItem.qty}
            </span>
          )}
        </div>
        {added ? (
          <QtyStepper qty={cartItem.qty} onInc={() => onSetQty(item.id, cartItem.qty + 1)} onDec={() => onSetQty(item.id, cartItem.qty - 1)} onRemove={() => onRemove(item.id)} />
        ) : (
          <button className="kb-add-btn" onClick={() => onAdd(item, type)}>+ Add</button>
        )}
      </div>
    </div>
  );
};

const KitBuilder = () => {
  const kb = useKitBuilder();

  const categories = useMemo(() => {
    if (!kb.catalog?.tools?.length) return ["All"];
    return ["All", ...new Set(kb.catalog.tools.map((t) => t.category).filter(Boolean))];
  }, [kb.catalog]);

  const filteredTools = useMemo(() => {
    if (!kb.catalog?.tools) return [];
    return kb.filter === "All" ? kb.catalog.tools : kb.catalog.tools.filter((t) => t.category === kb.filter);
  }, [kb.catalog, kb.filter]);

  const stepLabels = ["Select Brand", "Choose Tools", "Batteries & Chargers", "Review Kit"];

  return (
    <div className="kit-builder">
      {/* Header */}
      <header className="kb-header">
        <div className="kb-header-brand">
          <div className="kb-logo">OT</div>
          <div>
            <div className="kb-header-title">OMER TOOLS</div>
            <div className="kb-header-subtitle">BUILD YOUR OWN KIT</div>
          </div>
        </div>
        {kb.cart.length > 0 && (
          <div className="kb-header-cart">
            <span className="kb-header-cart-count">{kb.totalItems} items</span>
            <span className="kb-header-cart-total">${kb.subtotal.toLocaleString()}</span>
          </div>
        )}
      </header>

      {/* Steps */}
      <div className="kb-steps">
        {stepLabels.map((label, i) => {
          const active = i === kb.step;
          const done   = i < kb.step;
          return (
            <button
              key={i}
              className={`kb-step-btn ${active ? "active" : ""} ${done ? "done" : ""}`}
              onClick={() => {
                if (i === 0) kb.resetKit();
                else if (i === 3) kb.tryReview();
                else if (i <= kb.step || (i === 1 && kb.brand) || (i === 2 && kb.totalToolQty > 0)) kb.setStep(i);
              }}
            >
              <span className={`kb-step-num ${active ? "active" : ""} ${done ? "done" : ""}`}>
                {done ? "\u2713" : i + 1}
              </span>
              {label}
            </button>
          );
        })}
      </div>

      {/* Promo Banner */}
      {kb.step > 0 && (
        <div className="kb-promo">
          <div className="kb-promo-items">
            <div className="kb-promo-chip">FREE Tool Bag with every kit</div>
            {kb.tier.min > 0 && <div className="kb-promo-chip highlight">{kb.tier.label}</div>}
          </div>
          {kb.nextTier && (
            <div className="kb-promo-next">
              <span><strong>${(kb.nextTier.min - kb.subtotal).toFixed(0)}</strong> more for {kb.nextTier.label}</span>
              <div className="kb-promo-bar">
                <div className="kb-promo-bar-fill" style={{ width: `${Math.min((kb.subtotal / 2000) * 100, 100)}%` }} />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="kb-content kb-animate-in" key={kb.step}>

        {/* ── Step 0: Brand Selection ── */}
        {kb.step === 0 && (
          <div>
            <div className="kb-hero">
              <h1>Build Your Custom Kit</h1>
              <p>Pick your brand, choose tools, add batteries &amp; chargers. The more you add, the bigger the discount.</p>
              <div className="kb-hero-badges">
                <div className="kb-hero-badge">FREE tool bag with every kit</div>
                <div className="kb-hero-badge">Min. 2 batteries + 1 charger</div>
              </div>
            </div>

            <div className="kb-tiers">
              {TIERS.slice(1).map((t, i) => {
                const colors = ["#EA8B1C", "#E06020", "#16A34A"];
                return (
                  <div key={i} className="kb-tier-card" style={{ borderColor: colors[i] + "20" }}>
                    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: colors[i] }} />
                    <div className="kb-tier-spend" style={{ color: colors[i] }}>Spend ${t.min.toLocaleString()}+</div>
                    <div className="kb-tier-discount">{t.discount}% OFF</div>
                    {t.freeItems && <div className="kb-tier-free" style={{ color: colors[i] }}>+ {t.freeItems}</div>}
                  </div>
                );
              })}
            </div>

            <h3 className="kb-section-title">Select Your Brand</h3>
            {kb.brandsLoading ? (
              <div className="kb-loading">Loading brands...</div>
            ) : kb.brands.length === 0 ? (
              <div className="kb-empty">No brands available at the moment.</div>
            ) : (
              <div className="kb-brand-grid">
                {kb.brands.map((b) => (
                  <button
                    key={b.id}
                    className="kb-brand-btn"
                    style={{ "--brand-color": b.color }}
                    onClick={() => kb.selectBrand(b)}
                  >
                    <div className="kb-brand-logo" style={{ background: b.logoUrl ? "#fff" : b.color, color: b.name?.toLowerCase() === "dewalt" ? "#000" : "#fff" }}>
                      {b.logoUrl
                        ? <img src={b.logoUrl} alt={b.name} style={{ width: "100%", height: "100%", objectFit: "contain", borderRadius: 8, padding: 4 }} />
                        : b.logo}
                    </div>
                    <div className="kb-brand-name">{b.name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Step 1: Tools ── */}
        {kb.step === 1 && (
          <div>
            <div className="kb-page-header">
              <div>
                <h2>Choose Your Tools</h2>
                <p>Bare units (skin only) – use +/– to adjust qty</p>
              </div>
              <button className="kb-btn kb-btn-primary" onClick={() => kb.totalToolQty > 0 && kb.setStep(2)} disabled={kb.totalToolQty === 0}>
                Next: Batteries &rarr;
              </button>
            </div>

            {kb.catalogLoading ? (
              <div className="kb-loading">Loading products...</div>
            ) : kb.catalogError ? (
              <div className="kb-empty">Could not load products: {kb.catalogError}</div>
            ) : filteredTools.length === 0 && categories.length <= 1 ? (
              <div className="kb-empty">No tools available for this brand yet. Ask an admin to mark products as Custom Kit.</div>
            ) : (
              <>
                <div className="kb-filter-bar">
                  {categories.map((c) => (
                    <button key={c} className={`kb-filter-btn ${kb.filter === c ? "active" : ""}`} onClick={() => kb.setFilter(c)}>{c}</button>
                  ))}
                </div>
                <div className="kb-items-grid">
                  {filteredTools.map((tool) => (
                    <ItemCard key={tool.id} item={tool} type="tool" cartItem={kb.getCartItem(tool.id)} onAdd={kb.addItem} onSetQty={kb.setQty} onRemove={kb.removeItem} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Step 2: Batteries & Chargers ── */}
        {kb.step === 2 && (
          <div>
            <div className="kb-page-header">
              <div>
                <h2>Batteries &amp; Chargers</h2>
                <p>Power up your tools</p>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="kb-btn kb-btn-secondary" onClick={() => kb.setStep(1)}>&larr; Back</button>
                <button className="kb-btn kb-btn-primary" onClick={kb.tryReview} disabled={!kb.requirementsMet}>Review Kit &rarr;</button>
              </div>
            </div>

            <div className={`kb-requirements ${kb.requirementsMet ? "met" : "unmet"}`}>
              <span className="kb-req-label">Required:</span>
              {[{ ok: kb.batteriesOk, label: "Batteries", have: kb.totalBatQty, need: 2 }, { ok: kb.chargersOk, label: "Charger", have: kb.totalChgQty, need: 1 }].map((r) => (
                <div key={r.label} className={`kb-req-item ${r.ok ? "ok" : "warn"}`}>
                  <span className={`kb-req-dot ${r.ok ? "ok" : "warn"}`}>{r.ok ? "\u2713" : r.have}</span>
                  {r.need} {r.label} ({r.have}/{r.need})
                </div>
              ))}
            </div>

            {kb.validationMsg && <div className="kb-validation-msg">{kb.validationMsg}</div>}
            {kb.tier.min >= 1500 && kb.tier.freeItems && (
              <div className="kb-success-msg">{kb.tier.freeItems} included - on top of what you add here!</div>
            )}

            {kb.catalogLoading ? (
              <div className="kb-loading">Loading products...</div>
            ) : (
              <>
                <div className="kb-section-header" style={{ color: kb.batteriesOk ? "#16A34A" : "#EA8B1C" }}>
                  Batteries <span className="kb-count-badge" style={{ background: kb.batteriesOk ? "#DCFCE7" : "#FEF3C7", color: kb.batteriesOk ? "#16A34A" : "#EA8B1C" }}>{kb.totalBatQty}/2</span>
                </div>
                {kb.catalog?.batteries?.length > 0 ? (
                  <div className="kb-items-grid" style={{ marginBottom: 28 }}>
                    {kb.catalog.batteries.map((b) => (
                      <ItemCard key={b.id} item={b} type="battery" cartItem={kb.getCartItem(b.id)} onAdd={kb.addItem} onSetQty={kb.setQty} onRemove={kb.removeItem} />
                    ))}
                  </div>
                ) : (
                  <div className="kb-empty" style={{ marginBottom: 24 }}>No batteries marked for this brand yet.</div>
                )}

                <div className="kb-section-header" style={{ color: kb.chargersOk ? "#16A34A" : "#EA8B1C" }}>
                  Chargers <span className="kb-count-badge" style={{ background: kb.chargersOk ? "#DCFCE7" : "#FEF3C7", color: kb.chargersOk ? "#16A34A" : "#EA8B1C" }}>{kb.totalChgQty}/1</span>
                </div>
                {kb.catalog?.chargers?.length > 0 ? (
                  <div className="kb-items-grid">
                    {kb.catalog.chargers.map((c) => (
                      <ItemCard key={c.id} item={c} type="charger" cartItem={kb.getCartItem(c.id)} onAdd={kb.addItem} onSetQty={kb.setQty} onRemove={kb.removeItem} />
                    ))}
                  </div>
                ) : (
                  <div className="kb-empty">No chargers marked for this brand yet.</div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Step 3: Review & Checkout ── */}
        {kb.step === 3 && (
          <div className="kb-review">
            {kb.checkoutStep === "confirmed" ? (
              <div className="kb-confirmed">
                <div className="kb-confirmed-icon">{"\u2713"}</div>
                <h2>Order Placed!</h2>
                <p>
                  Thanks {kb.formData.name.split(" ")[0]}! Your custom {kb.brand?.name} kit order has been received.
                  We'll send a confirmation to <strong>{kb.formData.email}</strong>.
                </p>
                {kb.orderResult && (
                  <div className="kb-confirmed-summary">
                    <div className="kb-confirmed-summary-title">Order Summary</div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>Kit #{kb.orderResult.kitNumber}</div>
                    <div style={{ fontSize: 14, marginBottom: 4 }}>{kb.totalItems} items – {kb.brand?.name} kit</div>
                    {kb.tier.min > 0 && <div style={{ fontSize: 13, color: "#16A34A", fontWeight: 600, marginBottom: 4 }}>{kb.tier.label} applied (-${kb.discount.toFixed(2)})</div>}
                    {kb.tier.freeItems && <div style={{ fontSize: 13, color: "#16A34A", marginBottom: 4 }}>{kb.tier.freeItems}</div>}
                    <div style={{ fontSize: 13, color: "#2878B5", marginBottom: 8 }}>FREE Heavy-Duty Tool Bag</div>
                    <div className="kb-confirmed-total">Total: ${kb.total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</div>
                  </div>
                )}
                <br />
                <button className="kb-btn kb-btn-primary" onClick={kb.resetKit}>Build Another Kit</button>
              </div>
            ) : kb.checkoutStep === "form" ? (
              <div>
                <button className="kb-btn kb-btn-secondary" style={{ marginBottom: 16, padding: "6px 12px", fontSize: 13 }} onClick={() => kb.setCheckoutStep(null)}>&larr; Back to review</button>
                <h2>Checkout</h2>
                <p className="kb-review-subtitle">Enter your details to complete the order</p>

                <div className="kb-order-mini">
                  <div className="kb-order-mini-row">
                    <span className="kb-order-mini-info">{kb.totalItems} items – {kb.brand?.name}</span>
                    <span className="kb-order-mini-total">${kb.total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {kb.tier.min > 0 && <div className="kb-order-mini-discount">{kb.tier.label} applied – Saving ${kb.discount.toFixed(2)}{kb.tier.freeItems ? ` + ${kb.tier.freeItems}` : ""} + Free Tool Bag</div>}
                </div>

                <div className="kb-checkout-form">
                  <div className="kb-form-grid">
                    <div className="kb-form-group">
                      <label className="kb-form-label">Full Name <span className="required">*</span></label>
                      <input className="kb-form-input" value={kb.formData.name} onChange={(e) => kb.setFormData((p) => ({ ...p, name: e.target.value }))} placeholder="John Smith" />
                    </div>
                    <div className="kb-form-group">
                      <label className="kb-form-label">Email <span className="required">*</span></label>
                      <input className="kb-form-input" type="email" value={kb.formData.email} onChange={(e) => kb.setFormData((p) => ({ ...p, email: e.target.value }))} placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="kb-form-grid">
                    <div className="kb-form-group">
                      <label className="kb-form-label">Phone <span className="required">*</span></label>
                      <input className="kb-form-input" type="tel" value={kb.formData.phone} onChange={(e) => kb.setFormData((p) => ({ ...p, phone: e.target.value }))} placeholder="04XX XXX XXX" />
                    </div>
                    <div className="kb-form-group">
                      <label className="kb-form-label">Delivery Address <span className="required">*</span></label>
                      <input className="kb-form-input" value={kb.formData.address} onChange={(e) => kb.setFormData((p) => ({ ...p, address: e.target.value }))} placeholder="123 Main St, Sydney NSW" />
                    </div>
                  </div>
                  <div className="kb-form-group">
                    <label className="kb-form-label">Order Notes (optional)</label>
                    <textarea className="kb-form-textarea" value={kb.formData.notes} onChange={(e) => kb.setFormData((p) => ({ ...p, notes: e.target.value }))} placeholder="Any special requests..." />
                  </div>
                </div>

                <button className="kb-btn kb-btn-gradient" style={{ marginTop: 20 }} onClick={kb.handlePlaceOrder} disabled={kb.submitting}>
                  {kb.submitting ? "Placing Order..." : `Place Order – $${kb.total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}`}
                </button>
                {kb.validationMsg && <div className="kb-validation-msg" style={{ marginTop: 12 }}>{kb.validationMsg}</div>}
                <div className="kb-secure-note">Secure checkout 🔒 We'll confirm via email within 24hrs</div>
              </div>
            ) : (
              <div>
                <h2>Review Your Kit</h2>
                <p className="kb-review-subtitle">Adjust quantities or remove items before checkout</p>

                {[
                  { title: "Tools",    items: kb.toolsInCart,     icon: "tools"    },
                  { title: "Batteries", items: kb.batteriesInCart, icon: "batteries"},
                  { title: "Chargers", items: kb.chargersInCart,  icon: "chargers" },
                ].map((g) =>
                  g.items.length > 0 && (
                    <div className="kb-review-group" key={g.title}>
                      <div className="kb-review-group-title">{g.title} ({g.items.reduce((s, c) => s + c.qty, 0)})</div>
                      <div className="kb-review-items">
                        {g.items.map((item) => (
                          <div className="kb-review-item" key={item.id}>
                            <div className="kb-review-item-name">{item.name}</div>
                            <div className="kb-review-item-actions">
                              <QtyStepper qty={item.qty} onInc={() => kb.setQty(item.id, item.qty + 1)} onDec={() => kb.setQty(item.id, item.qty - 1)} onRemove={() => kb.removeItem(item.id)} />
                              <span className="kb-review-item-price">${(item.price * item.qty).toLocaleString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                )}

                <div className="kb-free-bag">
                  <div className="kb-free-bag-info">
                    <span style={{ fontSize: 18 }}>&#127890;</span>
                    <div>
                      <div className="kb-free-bag-title">FREE Omer Tools Heavy-Duty Tool Bag</div>
                      <div className="kb-free-bag-sub">Included with every custom kit</div>
                    </div>
                  </div>
                  <span className="kb-free-label">FREE</span>
                </div>

                <div className="kb-totals">
                  <div className="kb-totals-row">
                    <span>Subtotal ({kb.totalItems} items)</span>
                    <span style={{ color: "#1B2A3D" }}>${kb.subtotal.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {kb.tier.min > 0 && (
                    <div className="kb-totals-row discount">
                      <span>{kb.tier.label}</span>
                      <span style={{ fontWeight: 700 }}>-${kb.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {kb.tier.freeItems && (
                    <div className="kb-totals-row free">
                      <span>{kb.tier.freeItems}</span>
                      <span style={{ fontWeight: 700 }}>FREE</span>
                    </div>
                  )}
                  <div className="kb-totals-row bag">
                    <span>Tool Bag</span>
                    <span style={{ fontWeight: 700 }}>FREE</span>
                  </div>
                  <div className="kb-totals-total">
                    <span className="kb-totals-label">TOTAL</span>
                    <span className="kb-totals-value">${kb.total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}</span>
                  </div>
                  {kb.tier.min > 0 && (
                    <div className="kb-totals-savings">
                      Saving ${kb.discount.toFixed(2)}{kb.tier.freeItems ? ` + ${kb.tier.freeItems}` : ""} + Free Tool Bag!
                    </div>
                  )}
                </div>

                <div className="kb-actions">
                  <button className="kb-btn kb-btn-secondary" style={{ flex: 1 }} onClick={() => kb.setStep(2)}>&larr; Modify Kit</button>
                  <button
                    className="kb-btn kb-btn-gradient"
                    style={{ flex: 2 }}
                    onClick={() => { if (kb.requirementsMet) { kb.setValidationMsg(""); kb.proceedToCheckout(); } }}
                    disabled={!kb.requirementsMet}
                  >
                    Proceed to Checkout – ${kb.total.toLocaleString("en-AU", { minimumFractionDigits: 2 })}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default KitBuilder;

import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getTier, getNextTier, calcDiscount, MIN_BATTERIES, MIN_CHARGERS } from './kitPricingConfig';
import { submitCustomKit, fetchBrands, fetchCustomKitProducts } from './kitBuilderService';
import { addItemToCart, clearCart } from '../../store/cartSlice';

const BRAND_COLORS = {
  milwaukee: '#DB0032',
  makita:    '#00A6A0',
  dewalt:    '#FEBD17',
  hikoki:    '#00A651',
  bosch:     '#005DAA',
};

const brandColor = (name = '') => {
  const key = name.toLowerCase().replace(/\s+/g, '');
  return BRAND_COLORS[key] || '#072c62';
};

// Max quantities per item type
const MAX_TOOLS_PER_ITEM = 2;
const MAX_BATTERIES_PER_ITEM = 6;
const MAX_CHARGERS_PER_ITEM = 2;

const useKitBuilder = () => {
  // ── Redux & Navigation ────────────────────────────────────────
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Wizard state ──────────────────────────────────────────────
  const [step, setStep] = useState(0);
  const [brand, setBrand] = useState(null);       // brand object from API
  const [cart, setCart] = useState([]);
  const [filter, setFilter] = useState('All');
  const [validationMsg, setValidationMsg] = useState('');
  const [checkoutStep, setCheckoutStep] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  // ── API data ──────────────────────────────────────────────────
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(true);
  const [catalog, setCatalog] = useState(null);   // { tools, batteries, chargers }
  const [catalogLoading, setCatalogLoading] = useState(false);
  const [catalogError, setCatalogError] = useState(null);

  // Fetch all brands once on mount
  useEffect(() => {
    fetchBrands()
      .then((data) => setBrands(data))
      .catch(() => setBrands([]))
      .finally(() => setBrandsLoading(false));
  }, []);

  // Fetch custom-kit products whenever a brand is selected
  useEffect(() => {
    if (!brand) { setCatalog(null); return; }
    setCatalogLoading(true);
    setCatalogError(null);
    fetchCustomKitProducts(brand.id)
      .then(setCatalog)
      .catch((err) => setCatalogError(err.message))
      .finally(() => setCatalogLoading(false));
  }, [brand]);

  // ── Cart helpers ──────────────────────────────────────────────
  const addItem = (item, type) => {
    const maxQty = type === 'tool' ? MAX_TOOLS_PER_ITEM : type === 'battery' ? MAX_BATTERIES_PER_ITEM : MAX_CHARGERS_PER_ITEM;
    const existing = cart.find((c) => c.id === item.id);
    
    if (existing && existing.qty >= maxQty) {
      const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
      setValidationMsg(`Maximum ${maxQty} ${type}(s) of "${item.name}" allowed per kit.`);
      return;
    }

    setCart((prev) => {
      const existingItem = prev.find((c) => c.id === item.id);
      if (existingItem) return prev.map((c) => c.id === item.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, type, qty: 1 }];
    });
    setValidationMsg('');
  };
  const removeItem = (id) => setCart((prev) => prev.filter((c) => c.id !== id));
  const setQty = (id, n) => {
    const item = cart.find((c) => c.id === id);
    if (!item) return;
    
    const maxQty = item.type === 'tool' ? MAX_TOOLS_PER_ITEM : item.type === 'battery' ? MAX_BATTERIES_PER_ITEM : MAX_CHARGERS_PER_ITEM;
    
    if (n <= 0) {
      removeItem(id);
    } else if (n > maxQty) {
      const typeLabel = item.type.charAt(0).toUpperCase() + item.type.slice(1);
      setValidationMsg(`Maximum ${maxQty} ${item.type}(s) of "${item.name}" allowed per kit.`);
    } else {
      setCart((prev) => prev.map((c) => c.id === id ? { ...c, qty: n } : c));
      setValidationMsg('');
    }
  };
  const getCartItem = (id) => cart.find((c) => c.id === id);

  // ── Totals ────────────────────────────────────────────────────
  const subtotal     = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const tier         = getTier(subtotal);
  const nextTier     = getNextTier(subtotal);
  const discount     = calcDiscount(subtotal, tier);
  const total        = subtotal - discount;
  const totalItems   = cart.reduce((s, c) => s + c.qty, 0);

  const toolsInCart      = cart.filter((c) => c.type === 'tool');
  const batteriesInCart  = cart.filter((c) => c.type === 'battery');
  const chargersInCart   = cart.filter((c) => c.type === 'charger');
  const totalToolQty     = toolsInCart.reduce((s, c) => s + c.qty, 0);
  const totalBatQty      = batteriesInCart.reduce((s, c) => s + c.qty, 0);
  const totalChgQty      = chargersInCart.reduce((s, c) => s + c.qty, 0);
  const batteriesOk      = totalBatQty >= MIN_BATTERIES;
  const chargersOk       = totalChgQty >= MIN_CHARGERS;
  const requirementsMet  = batteriesOk && chargersOk;

  // ── Wizard actions ────────────────────────────────────────────
  const selectBrand = (brandObj) => {
    setBrand(brandObj);
    setCart([]);
    setFilter('All');
    setStep(1);
  };

  const resetKit = () => {
    setStep(0);
    setBrand(null);
    setCatalog(null);
    setCart([]);
    setFilter('All');
    setValidationMsg('');
    setCheckoutStep(null);
    setOrderResult(null);
  };

  const tryReview = () => {
    if (!batteriesOk || !chargersOk) {
      const msgs = [];
      if (!batteriesOk) msgs.push(`${MIN_BATTERIES - totalBatQty} more batter${MIN_BATTERIES - totalBatQty === 1 ? 'y' : 'ies'}`);
      if (!chargersOk) msgs.push('1 charger');
      setValidationMsg(`Please add ${msgs.join(' and ')} to continue.`);
      if (step !== 2) setStep(2);
      return;
    }
    setValidationMsg('');
    setStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!formData.name || !formData.email || !formData.phone || !formData.address) {
      setValidationMsg('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setValidationMsg('');
    try {
      const kitData = {
        brandId: brand?.id || '',
        brandName: brand?.name || '',
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        deliveryAddress: formData.address,
        orderNotes: formData.notes,
        subtotal,
        discountPercent: tier.discount,
        discountAmount: discount,
        total,
        tierLabel: tier.label,
        freeItems: tier.freeItems || '',
        items: cart.map((c) => ({
          itemType: c.type,
          itemName: c.name,
          itemCategory: c.category || '',
          unitPrice: c.price,
          quantity: c.qty,
          productId: c.productId || c.id || '',
        })),
      };
      const result = await submitCustomKit(kitData);
      setOrderResult(result);
      setCheckoutStep('confirmed');
    } catch (error) {
      setValidationMsg(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Proceed to Checkout ────────────────────────────────────────
  // Adds all kit items to Redux cart and navigates to standard checkout
  const proceedToCheckout = () => {
    try {
      // Store kit metadata for checkout to access
      const kitMetadata = {
        isKit: true,
        brandId: brand?.id || '',
        brandName: brand?.name || '',
        discountPercent: tier.discount,
        discountAmount: discount,
        tierLabel: tier.label,
        freeItems: tier.freeItems || '',
        subtotal,
        total,
      };
      localStorage.setItem('kitMetadata', JSON.stringify(kitMetadata));

      // Add all cart items to Redux cart
      cart.forEach((item) => {
        dispatch(addItemToCart({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.qty,
          image: item.image || null,
          isKit: true,
          kitItemType: item.type, // 'tool', 'battery', 'charger'
          category: item.category || '',
          productId: item.productId || item.id,
          sku: `KIT-${item.id}`,
        }));
      });

      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      setValidationMsg('Failed to proceed to checkout. Please try again.');
      console.error('Checkout error:', error);
    }
  };

  // ── Derived brand display data ─────────────────────────────────
  const brandsForDisplay = brands.map((b) => ({
    ...b,
    color: brandColor(b.name),
    logo: b.name ? b.name.charAt(0).toUpperCase() : '?',
    logoUrl: b.logoUrl || b.images?.find(img => img.isPrimary)?.imageUrl || b.images?.[0]?.imageUrl || null,
  }));

  return {
    // wizard
    step, setStep,
    brand, selectBrand,
    cart, addItem, removeItem, setQty, getCartItem,
    filter, setFilter,
    validationMsg, setValidationMsg,
    checkoutStep, setCheckoutStep,
    formData, setFormData,
    submitting, orderResult,
    // api
    brands: brandsForDisplay, brandsLoading,
    catalog, catalogLoading, catalogError,
    // totals
    subtotal, tier, nextTier, discount, total, totalItems,
    toolsInCart, batteriesInCart, chargersInCart,
    totalToolQty, totalBatQty, totalChgQty,
    batteriesOk, chargersOk, requirementsMet,
    // actions
    resetKit, tryReview, handlePlaceOrder, proceedToCheckout,
  };
};

export default useKitBuilder;

const API_BASE_URL = process.env.REACT_APP_BASE_URL || '';

export const submitCustomKit = async (kitData) => {
  const response = await fetch(`${API_BASE_URL}/customkits`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(kitData),
  });

  if (!response.ok) {
    let errorMessage = 'Failed to submit custom kit';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      errorMessage = await response.text() || errorMessage;
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

export const fetchBrands = async () => {
  const response = await fetch(`${API_BASE_URL}/brands`);
  if (!response.ok) throw new Error('Failed to fetch brands');
  const data = await response.json();
  return Array.isArray(data) ? data : (data.data || []);
};

/** Returns { tools, batteries, chargers } for the given brandId */
export const fetchCustomKitProducts = async (brandId) => {
  const url = `${API_BASE_URL}/products/optimized?isCustomKit=true&brandId=${brandId}&pageSize=200&isActive=true`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch custom kit products');
  const data = await response.json();
  const products = data.data || [];

  const tools = products
    .filter((p) => p.kitItemType === 'tool')
    .map((p) => ({
      id: p.id,
      productId: p.id,
      name: p.name,
      price: p.discountPrice ?? p.price,
      category: p.subcategoryName || 'General',
      image: p.images?.[0]?.imageUrl || null,
    }));

  const batteries = products
    .filter((p) => p.kitItemType === 'battery')
    .map((p) => ({
      id: p.id,
      productId: p.id,
      name: p.name,
      price: p.discountPrice ?? p.price,
      ah: extractAh(p.name),
      image: p.images?.[0]?.imageUrl || null,
    }));

  const chargers = products
    .filter((p) => p.kitItemType === 'charger')
    .map((p) => ({
      id: p.id,
      productId: p.id,
      name: p.name,
      price: p.discountPrice ?? p.price,
      image: p.images?.[0]?.imageUrl || null,
    }));

  return { tools, batteries, chargers };
};

/** Tries to extract Ah from product name, e.g. "18V 5.0Ah Battery" → 5 */
const extractAh = (name) => {
  const match = name && name.match(/(\d+(?:\.\d+)?)\s*[Aa]h/);
  return match ? parseFloat(match[1]) : null;
};

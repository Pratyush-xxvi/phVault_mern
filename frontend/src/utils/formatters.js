export const formatINR = (price) => {
  const val = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  
  if (val >= 10000000) {
    return `₹${(val / 10000000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Cr`;
  } else if (val >= 100000) {
    return `₹${(val / 100000).toLocaleString('en-IN', { maximumFractionDigits: 2 })} Lakh`;
  }
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

export const formatINRLong = (price) => {
  const val = typeof price === 'string' ? parseFloat(price) : price;
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(val);
};

import api from "./api";

export const placeOrder = async (vehicleId, quantity = 1, deliveryCity = "", buyerPhone = "") => {
  return api.post('/orders', { vehicleId, quantity, deliveryCity, buyerPhone });
};

export const getOrders = async () => {
  return api.get('/orders');
};

export const approveOrder = async (id) => {
  return api.put(`/orders/${id}/approve`, {});
};

export const rejectOrder = async (id) => {
  return api.put(`/orders/${id}/reject`, {});
};

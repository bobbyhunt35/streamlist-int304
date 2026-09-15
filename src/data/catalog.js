import rawList from "./data";

// The provided data.js has no explicit category field, so subscription
// plans are identified by name; everything else is EZTechMovie merchandise.
function isSubscription(item) {
  return item.service.toLowerCase().includes("subscription");
}

const catalog = rawList.map((item) => ({
  id: item.id,
  name: item.service,
  description: item.serviceInfo,
  price: item.price,
  image: item.img,
  stock: item.amount,
  category: isSubscription(item) ? "subscription" : "accessory",
}));

export default catalog;

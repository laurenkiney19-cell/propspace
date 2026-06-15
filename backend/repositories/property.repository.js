const Property = require("../models/Property");

const PropertyRepo = {
  findAll: (filters = {}) => {
    const query = {};
    if (filters.city) query.city = { $regex: filters.city, $options: "i" };
    if (filters.minPrice) query.price = { ...query.price, $gte: Number(filters.minPrice) };
    if (filters.maxPrice) query.price = { ...query.price, $lte: Number(filters.maxPrice) };
    if (filters.type) query.type = filters.type;
    if (filters.listingType) query.listingType = filters.listingType;
    return Property.find(query).populate("owner", "username fullName avatar").sort({ createdAt: -1 });
  },
  findById: (id) => Property.findById(id).populate("owner", "username fullName avatar phone"),
  findByOwner: (ownerId) => Property.find({ owner: ownerId }).sort({ createdAt: -1 }),
  create: (data) => Property.create(data),
  update: (id, data) => Property.findByIdAndUpdate(id, data, { new: true }),
  delete: (id) => Property.findByIdAndDelete(id),
};

module.exports = PropertyRepo;
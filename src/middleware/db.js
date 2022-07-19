const {
  buildSuccObject,
  buildErrObject,
  itemNotFound,
} = require("../middleware/utils");
/* eslint-disable */

/**
 * Builds sorting
 * @param {string} sort - field to sort from
 * @param {number} order - order for query (1,-1)
 */
const buildSort = (sort, order) => {
  const sortBy = {};
  sortBy[sort] = order;
  return sortBy;
};

/**
 * Hack for mongoose-paginate, removes 'id' from results
 * @param {Object} result - result object
 */
const cleanPaginationID = (result) => {
  result.docs.map((element) => delete element.id);
  return result;
};

/**
 * Builds initial options for query
 * @param {Object} query - query object
 */
const listInitOptions = async (req) => {
  return new Promise((resolve) => {
    const order = req.query.order || -1;
    const sort = req.query.sort || "createdAt";
    const sortBy = buildSort(sort, order);
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const options = {
      sort: sortBy,
      lean: true,
      page,
      limit,
    };
    resolve(options);
  });
};

module.exports = {

  /**
   * Gets items from database
   * @param {Object} req - request object
   * @param {Object} query - query object
   */
  async getItems(req, model, query) {
    const options = await listInitOptions(req);
    return new Promise((resolve, reject) => {
      model.paginate(query, options, (err, items) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(cleanPaginationID(items));
      });
    });
  },







  // generic funciton get and populate data based on the path and select fields
  async getAllItemsFromDB(page, limit, path, selectQuery, model) {
    return new Promise((resolve, reject) => {
      const order = -1;
      const sort = "createdAt";
      const sortBy = buildSort(sort, order);
      page = parseInt(page, 10) || 1;
      limit = parseInt(limit, 10) || 5;
      let options = {
        sort: sortBy,
        page,
        limit,
      };
      let query = {};
      model.paginate(query, options, (err, items) => {
        if (err) {
          reject(utils.buildErrObject(422, err.message));
        }
        resolve(items);
      });
    });
  },



  /**
   * Gets item from database by id
   * @param {string} id - item id
   */
  async getItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findById(id, (err, item) => {
        itemNotFound(err, item, reject, "NOT_FOUND");
        resolve(item);
      });
    });
  },

  /**
   * Creates a new item in database
   * @param {Object} req - request object
   */
  async createItem(req, model) {
    return new Promise((resolve, reject) => {
      model.create(req, (err, item) => {
        if (err) {
          reject(buildErrObject(422, err.message));
        }
        resolve(item);
      });
    });
  },

  /**
   * Updates an item in database by id
   * @param {string} id - item id
   * @param {Object} req - request object
   */
  async updateItem(id, model, req) {
    return new Promise((resolve, reject) => {
      model.findByIdAndUpdate(
        id,
        req,
        {
          new: true,
          runValidators: true,
        },
        (err, item) => {
          itemNotFound(err, item, reject, "NOT_FOUND");
          resolve(item);
        }
      );
    });
  },

  /**
   * Deletes an item from database by id
   * @param {string} id - id of item
   */
  async deleteItem(id, model) {
    return new Promise((resolve, reject) => {
      model.findByIdAndRemove(id, (err, item) => {
        itemNotFound(err, item, reject, "NOT_FOUND");
        resolve(buildSuccObject("DELETED"));
      });
    });
  },
};

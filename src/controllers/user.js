const model = require("../models/user");
const { matchedData } = require("express-validator");
const utils = require("../middleware/utils");
const db = require("../middleware/db");
const logger = require("../../winston")("activities");

/*********************
 * Private functions *
 *********************/

/**
 * Gets all items from database
 */
const getAllItemsFromDB = async () => {
  return new Promise((resolve, reject) => {
    model.find(
      {},
      "-updatedAt -createdAt",
      {
        sort: {
          name: 1,
        },
      },
      (err, items) => {
        if (err) {
          logger.info("Get Activities error getAllItemsFromDB ", err);
          reject(utils.buildErrObject(422, err.message));
        }
        resolve(items);
      }
    );
  });
};

/********************
 * Public functions *
 ********************/

/**
 * Get all items function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.getAllItems = async (req, res) => {
  try {
    res.status(200).json(await getAllItemsFromDB());
  } catch (error) {
    logger.info("Get Activities error getAllItems ", error);
    utils.handleError(res, error);
  }
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    // req = matchedData(req);
    const id = await utils.isIDGood(req.params.id);
    res.status(200).json(await db.updateItem(id, model, req.body));
  } catch (error) {
    logger.info(" Activity error updateItem ", error);
    utils.handleError(res, error);
  }
};

/**
 * Create item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.createItem = async (req, res) => {
  try {
    res.status(201).json(await db.createItem(req.body, model));
  } catch (error) {
    logger.info(" Activity error createItem ", error);
    utils.handleError(res, error);
  }
};

/**
 * Delete item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.deleteItem = async (req, res) => {
  try {
    const id = await utils.isIDGood(req.params.id);
    res.status(200).json(await db.deleteItem(id, model));
  } catch (error) {
    logger.info(" Activity error deleteItem ", error);
    utils.handleError(res, error);
  }
};

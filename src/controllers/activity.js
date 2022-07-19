const Appointment = require("../models/activity");
const utils = require("../middleware/utils");
const db = require("../middleware/db");
const logger = require("../../winston")("activities");

/*********************
 * Private functions *
 *********************/
const mapAppointment = (dbAppointment) => {
  var halAppointment = {
    _links: {
      self: { href: '/appointments/' + dbAppointment.id },
      user: { href: '/users/' + dbAppointment.user.id, title: dbAppointment.user.displayName }
    },
    id: dbAppointment.id,
    title: dbAppointment.title,
    dateAndTime: dbAppointment.dateAndTime,
    endDateAndTime: dbAppointment.endDateAndTime,
    duration: dbAppointment.duration,
    remarks: dbAppointment.remarks
  };
  return halAppointment;
}


/**
 * Gets all items from database
 */
const getAllItemsFromDB = async () => {
  return new Promise((resolve, reject) => {
    Appointment.find(
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

// get appointment by Id
exports.getById = function (req, res) {
  var appointmentId = req.params.id;
  Appointment.findById(appointmentId, function (err, dbAppointment) {
    if (err) {
      throw err;
    }
    if (dbAppointment === null) {
      res.status(404).send({ message: 'Appointment can not be found' });
    }
    else {
      res.status(200).send(mapAppointment(dbAppointment));
    }
  });
};

// get by userId
exports.getByUser = function (req, res) {
  var result = {
    _links: {
      self: { href: '/appointments' }
    },
    _embedded: {
      appointment: []
    },
    count: 0
  };
  let userId = req.params.userId;
  Appointment
    .find({ 'user.id': userId })
    .sort('-dateAndTime')
    .exec(function (err, appointments) {
      if (err) {
        throw err;
      }
      result.count = appointments.length;
      for (var i = 0; i < result.count; i++) {
        result._embedded.appointment.push(mapAppointment(appointments[i]));
      }
      res.status(200).send(result);
    });
};

/**
 * Update item function called by route
 * @param {Object} req - request object
 * @param {Object} res - response object
 */
exports.updateItem = async (req, res) => {
  try {
    const appointmentId = await utils.isIDGood(req.params.id);
    Appointment.findById(appointmentId, function (err, dbAppointment) {
      if (err) {
        throw err;
      }
      if (dbAppointment === null) {
        res.status(404).send({ message: 'Appointment can not be found' });
      }
      else {
        // maybe we should add a check for a complete object in case of a PUT request?
        dbAppointment.set(req.body) // updated object values from request body.
        dbAppointment.save(function (err, updatedDbAppointment) {
          if (err) {
            if (err.name === 'ValidationError') {
              res.status(422).send(err);
            }
            else {
              res.status(400).send(err);
            }
            return;
          }
          res.status(200).send(mapAppointment(updatedDbAppointment));
        })
      }
    });
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
    res.status(201).json(await db.createItem(req.body, Appointment));
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
    const appointmentId = await utils.isIDGood(req.params.id);
    Appointment.findById(appointmentId, function (err, dbAppointment) {
      if (err) {
        throw err;
      }
      if (dbAppointment === null) {
        res.status(404).send({ message: 'Appointment can not be found' });
      }
      else {
        dbAppointment.remove(function (err) {
          if (err) {
            res.status(400).send(err);
            return;
          }
          res.status(200).send({ message: 'Appointment deleted' });
        })
      }
    });
  } catch (error) {
    logger.info(" Activity error deleteItem ", error);
    utils.handleError(res, error);
  }
};

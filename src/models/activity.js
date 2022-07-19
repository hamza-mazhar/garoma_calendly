const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const ActivitySchedulerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: 'Appointment description is required'
    },
    dateAndTime: {
      type: Date,
      required: true,
    },
    endDateAndTime: {
      type: Date,
      required: true,
    },
    user: {
      id: { type: String, required: true },
      displayName: String
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);



ActivitySchedulerSchema.virtual('duration')
  .get(function () {
    var durationMs = this.endDateAndTime - this.dateAndTime;
    if (durationMs) {
      return Math.abs(this.endDateAndTime - this.dateAndTime) / 1000 / 60;
    }
    else {
      return;
    }
  });

ActivitySchedulerSchema.path('dateAndTime').validate({
  validator: function (value) {
    var self = this;
    console.log("+++++++++++here is the inside the validator", self)
    return new Promise(function (resolve, reject) {
      mongoose.models.ActivityScheduler.find({
        '_id': { $ne: self._id },
        'user.id': self.user.id,
        $or: [
          { dateAndTime: { $lt: self.endDateAndTime, $gte: self.dateAndTime } },
          { endDateAndTime: { $lte: self.endDateAndTime, $gt: self.dateAndTime } }
        ]
      }, function (err, appointments) {
        resolve(!appointments || appointments.length === 0);
      });
    })
  },
  message: "The appointment overlaps with other appointments"
});

ActivitySchedulerSchema.path('dateAndTime').validate(function (value) {
  var isValid = true;
  if (value < new Date()) {
    isValid = false;
  }
  return isValid;
}, "The appointment can not be scheduled in the past");


ActivitySchedulerSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("ActivityScheduler", ActivitySchedulerSchema);

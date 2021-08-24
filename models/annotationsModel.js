const mongoose = require("mongoose");

const annotationSchema = new mongoose.Schema({
  range: { type: Object, required: true,  },
  rangeRaw: { type: Object, required: true },
  annotation: { type: Object, required: true, },
});
module.exports = Annotation = mongoose.model("annotation", annotationSchema);

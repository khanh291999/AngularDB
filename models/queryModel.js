const mongoose = require("mongoose");

const querySchema = new mongoose.Schema({
  panelId: { type: Number, required: true,  },
  range: { type: Object, required: true,  },
  rangeRaw: { type: Object, required: true },
  interval: { type: String, required: true,  },
  intervalMs: { type: Number, required: true,  },
  target: { type: Array, required: true, },
  adhocFilters: { type: Array, required: true, },
  format: { type: String, required: true,  },
  maxDataPoints: { type: Number, required: true,  },
});
module.exports = Query = mongoose.model("querys", querySchema);

const errorHandlers = {
  badRouteHandler: (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" });
  },
  errorHandler: (err, req, res, next) => {
    console.log("error message: ", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    next(err);
  },
};

module.exports = errorHandlers;

const errorHandlers = {
  badRouteHandler: (req, res) => {
    res.status(404).send({ error: "Unknown endpoint" });
  },
  errorHandler: (err, req, res, next) => {
    console.log("error message: ", err);
    next(err);
  },
};

module.exports = errorHandlers;

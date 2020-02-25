module.exports = function (app) {
    app.use("/customer", require("../controller/customer"));
    app.use("/admin", require("../controller/admin"));
    app.use("/guest", require("../controller/guest"));
    app.use("/", (req, res) => {
        res.json({"message": "Welcome to the API"})
    });
};

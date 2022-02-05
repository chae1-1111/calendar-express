const calendarRouter = require("express").Router();
const moment = require("moment");

const calendarCont = require("../controller/calendarCont");

calendarCont.connectDB();

calendarRouter.route("/").get((req, res) => {
    const q = {};
    q.year = req.query.year;
    q.month = req.query.month >= 10 ? req.query.month : "0" + req.query.month;
    req.query.date
        ? (q.date =
              req.query.date >= 10 ? req.query.date : "0" + req.query.date)
        : null;
    const resultJson = {};
    calendarCont.getList(q, (err, result) => {
        if (err) {
            resultJson.code = 500;
            resultJson.message = "Connection to Database failed.";
            res.json(resultJson);
        } else {
            resultJson.code = 200;
            resultJson.result = result;
            res.json(resultJson);
        }
    });
});

calendarRouter.route("/").post((req, res) => {
    const StartDateTime = req.body.StartDateTime;
    const EndDateTime = req.body.EndDateTime;
    const UserKey = req.body.UserKey;
    const Title = req.body.Title;
    const Memo = req.body.Memo || ""; // Optional
    const AllDay = req.body.AllDay;
    const resultJson = {};
    calendarCont.insert(
        StartDateTime,
        EndDateTime,
        UserKey,
        Title,
        Memo,
        AllDay,
        (err, result) => {
            if (err) {
                resultJson.code = 400;
                resultJson.message = "Insert schedule failed.";
                res.json(resultJson);
            } else {
                resultJson.code = 200;
                resultJson.message = "Insert schedule Successful";
                res.json(resultJson);
            }
        }
    );
});

calendarRouter.route("/").delete((req, res) => {
    const id = req.body.id;
    const UserKey = req.body.UserKey;
    const resultJson = {};

    calendarCont.remove(id, UserKey, (err, result) => {
        if (err) {
            resultJson.code = 400;
            resultJson.message = "Delete Schedule Failed";
        } else {
            resultJson.code = 200;
            resultJson.message = "Delete Schedule Successful";
        }
        res.json(resultJson);
    });
});

calendarRouter.route("/").put((req, res) => {
    const id = req.body.id;
    const UserKey = req.body.UserKey;
    const schedule = {
        StartDateTime: new Date(req.body.StartDateTime).getTime() + 3600000 * 9,
        EndDateTime: new Date(req.body.EndDateTime).getTime() + 3600000 * 9,
        Title: req.body.Title,
        Memo: req.body.Memo,
        AllDay: req.body.AllDay,
    };
    const resultJson = {};

    calendarCont.update(id, UserKey, schedule, (err, result) => {
        if (err) {
            resultJson.code = 400;
            resultJson.message = "Update Schedule Failed";
        } else {
            resultJson.code = 200;
            resultJson.message = "Update Schedule Successful";
        }
        res.json(resultJson);
    });
});

module.exports = calendarRouter;

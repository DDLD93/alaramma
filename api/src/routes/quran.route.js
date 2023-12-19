const quranCtrl = require('../controllers/quran.controller');
const { Router } = require("express");

module.exports = () => {
    let api = new Router();

    api.post("/search", async (req, res) => {
        try {
            let { question } = req.body
            console.log({ question })
            let { ok, data, message } = await quranCtrl.queryDb(question);
            if (ok) {
                res.status(200).json({ ok, data });
            } else {
                res.status(500).json({ ok, message });
            }
        } catch (error) {
            res.status(500).json({ ok: false, message: error.message });
        }
    });
    api.post("/embeddings", async (req, res) => {
        try {
            let { text } = req.body
            let embd = await quranCtrl.stringToVector(text);
            res.status(200).json({ ok: true, data: embd });
        } catch (error) {
            res.status(500).json({ ok: false, message: error.message });
        }
    });
    api.post("/search", async (req, res) => {
        try {
            let { question } = req.body
            console.log({ question })
            let { ok, data, message } = await quranCtrl.queryDb(question);
            if (ok) {
                res.status(200).json({ ok, data });
            } else {
                res.status(500).json({ ok, message });
            }
        } catch (error) {
            res.status(500).json({ ok: false, message: error.message });
        }
    });


    api.get("/", async (req, res) => {
        try {
            res.send("heelo world")
        } catch (error) {
            res.status(500).json({ ok: false, message: error.message });
        }
    });

    return api
}
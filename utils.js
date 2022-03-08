exports.error = (res, e) => res.status(e.code || 500).json({ error: e.message || e })

exports.check = (data, message, code) => { if (!data) { throw { code: code || 400, message } } }

exports.random = (min, max) => { return Math.floor(Math.random() * (max - min + 1) + min) }

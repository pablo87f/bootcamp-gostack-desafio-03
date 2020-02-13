class WithdrawalController {
    async index(req, res) {
        try {
            return res.json({});
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async store(req, res) {
        try {
            return res.json({});
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async show(req, res) {
        try {
            return res.json({});
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async update(req, res) {
        try {
            return res.json({});
        } catch (ex) {
            return res.status(500).send();
        }
    }

    async delete(req, res) {
        try {
            return res.json({});
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new WithdrawalController();

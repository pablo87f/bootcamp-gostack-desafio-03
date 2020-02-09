import File from '../models/file.model';

class FileController {
    async store(req, res) {
        try {
            const { originalname: name, filename: path } = req.file;

            const file = await File.create({
                name,
                path,
            });

            return res.json(file);
        } catch (ex) {
            return res.status(500).send();
        }
    }
}

export default new FileController();

import File from '../schemas/Files';

class FileController {
  async create(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = new File({
      name,
      path,
    });

    const savedFile = await file.save();
    return res.json(savedFile);
  }
}

export default new FileController();
import { Response } from 'express';
import path from 'path';
import fs from 'fs';

export class UploadController {
  static async uploadFile(req: any, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Nenhum arquivo foi enviado' });
      }

      const fileInfo = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        path: req.file.path
      };

      res.json({
        message: 'Arquivo enviado com sucesso',
        file: fileInfo
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async getFile(req: any, res: Response) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({ error: 'Nome do arquivo é obrigatório' });
      }

      const filePath = path.join(__dirname, '../../uploads', filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      const stat = fs.statSync(filePath);
      const fileExtension = path.extname(filename).toLowerCase();

      let contentType = 'application/octet-stream';
      
      switch (fileExtension) {
        case '.pdf':
          contentType = 'application/pdf';
          break;
        case '.jpg':
        case '.jpeg':
          contentType = 'image/jpeg';
          break;
        case '.png':
          contentType = 'image/png';
          break;
      }

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', stat.size);
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);

      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error('Erro ao buscar arquivo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  static async deleteFile(req: any, res: Response) {
    try {
      const { filename } = req.params;
      
      if (!filename) {
        return res.status(400).json({ error: 'Nome do arquivo é obrigatório' });
      }

      const filePath = path.join(__dirname, '../../uploads', filename);

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Arquivo não encontrado' });
      }

      fs.unlinkSync(filePath);

      res.json({
        message: 'Arquivo deletado com sucesso'
      });
    } catch (error) {
      console.error('Erro ao deletar arquivo:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
}
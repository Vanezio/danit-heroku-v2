import { Router } from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import path from 'path';
import { EnvConfig } from '../config';

export const files = () => {
  const router = Router();

  const filesPath = path.resolve(
    `${EnvConfig.ENV === 'PROD' ? 'dist' : 'src'}/db/files`
  );
  router.use(fileUpload());

  router.post('/upload', async (req, res) => {
    const file = req.files.test as UploadedFile;

    await file.mv(filesPath + file.name);

    return res.send('Success');
  });

  router.get('/download/:name', async (req, res) => {
    const file = `${filesPath}${req.params.name}`;
    return res.download(file);
  });

  return router;
};

console.log(path.resolve('ormconfig.json'));

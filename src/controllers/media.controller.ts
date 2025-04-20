import { Response } from "express";
import { IreqUser } from "../utils/interface"; 
import uploader from "../utils/uploader";
import response from "../utils/response";

export default {
  async single(req: IreqUser, res: Response){
    
    if(!req.file){
      return response.error(res, null, 'File does not exist');
    }
    
    try {
      const result = await uploader.uploadSingle(req.file as Express.Multer.File);
      response.success(res, result, 'File uploaded successfully')
    } catch {
      response.error(res, null, 'Failed upload file')
    }

  },
  async multiple(req: IreqUser, res: Response){
    if(!req.files || req.files.length === 0){
      return response.error(res, null, 'Files does not exist');
    }
    
    try {
      const result = await uploader.uploadMultiple(req.files as Express.Multer.File[]);
      response.success(res, result, 'Files uploaded successfully');
    } catch {
      response.error(res, null, 'Failed upload files');
    }
  },
  async remove(req: IreqUser, res: Response){
    try {
      const {fileUrl} = req.body as { fileUrl: string };
      const result = await uploader.remove(fileUrl);
      response.success(res, result, 'File removed successfully');
    } catch {
      response.error(res, null, 'Failed to remove file');
    }
  },
};
import ImageKit, { toFile } from "@imagekit/nodejs";
import config from "../config/config.js";

const client = new ImageKit({
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
});

const uploadFiles = async ({ buffer, fileName }) => {
  const response = await client.files.upload({
    file: await toFile(buffer),
    fileName: fileName,
    folder: "API-CRUD",
  });

  return response;
};

const deleteFile = async (fileId) => {
  return await client.files.delete(fileId);
};

export { uploadFiles, deleteFile };

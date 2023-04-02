import fs from 'fs';
import path from 'path';
const bcrypt = require('bcrypt');

export default async function imageUploadLocal({
  image,
  firstName,
  category,
  id,
}) {
  try {
    // remove the 'data:image'
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    // decode the base64 to string data
    const buffer = Buffer.from(base64Data, 'base64');
    // extract the file extension from the base64 string
    const ext = image.substring('data:image/'.length, image.indexOf(';base64'));

    const directoryPath = path.join(
      process.cwd(),
      'public',
      'images',
      category
    );
    const fileName = `${id}.${ext}`;
    const publicPath = path.join(directoryPath, fileName);

    // create the directory if it doesn't exist
    // if (!fs.existsSync(directoryPath)) {
    //   fs.mkdirSync(directoryPath, { recursive: true });
    // }

    // write the binary data to file on disk
    fs.writeFileSync(publicPath, buffer);
    const filePath = `/images/${category}/${fileName}`;
    return { filePath };
  } catch (error) {
    return { error };
  }
}

export async function deleteImageLocal({ image, category }) {
  try {
    const directoryPath = path.join(process.cwd(), 'public');
    const publicPath = path.join(directoryPath, image);
    console.log('isImageExists', fs.existsSync(publicPath));
    if (fs.existsSync(publicPath)) {
      fs.unlinkSync(publicPath);
    }
  } catch (error) {
    // console.log('error', error);
    throw error;
  }
}

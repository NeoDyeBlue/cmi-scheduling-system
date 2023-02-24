import fs from 'fs';
import path from 'path';

export default function imageUploadLocal({ image, firstName }) {
  try {
    // remote the 'data:image'
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    // decode the base64 to string data
    const buffer = Buffer.from(base64Data, 'base64');
    // Extract the file extension from the base64 string
    const ext = image.substring('data:image/'.length, image.indexOf(';base64'));
    //write the binary data to file on disk.
    const filePath = path.join(
      process.cwd(),
      '../public/upload/images',
      `${firstName}.${ext}`
    );

    fs.writeFileSync(filePath, buffer);
    return { filePath };
  } catch (error) {
    return { error };
  }
}

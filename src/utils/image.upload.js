// middleware/imageUpload.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: "../public/uploads",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const fileFilter = function (req, file, cb) {
  const ext = path.extname(file.originalname);
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only JPG or PNG files are allowed!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter }).single("image");

export default async function imageUpload(req, res) {
    console.log('----------------------------------', req.file)
    try {
      const imageUrl = await new Promise((resolve, reject) => {
        upload(req, res, (error) => {
          if (error instanceof multer.MulterError) {
            reject(new Error("Upload error"));
          } else if (error) {
            // uknown error
            reject(new Error("Unknown error"));
          }
          const imageUrl = path.resolve(`../public/${req.file.path}`);
          resolve(imageUrl);
        });
      });
      return { imageUrl };
    } catch (error) {
      return { error };
    }
  }

const multer = require("multer")
const path = require('path');
const fs = require('fs');

// Ensure the uploads folder exists
const uploadDirectory = path.join(__dirname,'..', 'uploads');
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDirectory);
    },
    filename: function (req, file, cb) {
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
  });
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },// 10MB file size limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        
        if (mimetype && extname) {
          return cb(null, true);
        } else {
          cb(new Error('File upload only supports the following filetypes - ' + filetypes));
        }
      }
  }).fields([
    {
        name: "valid_identification",
        maxCount: 1,
      },
      {
        name: "educational_document",
        maxCount: 1,
      },
      {
        name: "gurantee_document",
        maxCount: 1,
      },
  ])

module.exports=upload;
  
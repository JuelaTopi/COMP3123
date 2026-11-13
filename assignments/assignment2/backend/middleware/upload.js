const multer = require("multer");

const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp"
];

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 2 * 1024 * 1024,
    files: 1,
    fields: 7,
    fieldSize: 10 * 1024,
    parts: 8
  },

  fileFilter(req, file, callback) {
    if (!allowedTypes.includes(file.mimetype)) {
      const error = new Error(
        "Profile picture must be a JPEG, PNG or WebP image"
      );

      error.status = 400;
      return callback(error);
    }

    callback(null, true);
  }
});

module.exports = upload.single("profile_picture");
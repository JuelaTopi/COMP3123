const sharp = require("sharp");
const path = require("path");
const fs = require("fs/promises");
const { randomUUID } = require("crypto");
const logger = require("./logger");

const uploadDirectory = path.join(__dirname, "..", "uploads");
const allowedFormats = ["jpeg", "png", "webp"];

async function saveProfilePicture(file) {
  let imageBuffer;

  try {
    const image = sharp(file.buffer, {
      limitInputPixels: 16000000,
      failOn: "warning"
    });

    const metadata = await image.metadata();

    if (!allowedFormats.includes(metadata.format)) {
      throw new Error("Unsupported image format");
    }

    imageBuffer = await image
      .rotate()
      .resize({
        width: 512,
        height: 512,
        fit: "inside",
        withoutEnlargement: true
      })
      .png()
      .toBuffer();
  } catch (error) {
    const uploadError = new Error(
      "Upload a valid JPEG, PNG or WebP image, up to 16 megapixels"
    );

    uploadError.status = 400;
    throw uploadError;
  }

  await fs.mkdir(uploadDirectory, { recursive: true });

  const filename = `${randomUUID()}.png`;
  const destination = path.join(uploadDirectory, filename);

  try {
    await fs.writeFile(destination, imageBuffer, { flag: "wx" });
  } catch (error) {
    if (error.code !== "EEXIST") {
      await removeProfilePicture(`/uploads/${filename}`);
    }

    throw error;
  }

  return `/uploads/${filename}`;
}

async function removeProfilePicture(picturePath) {
  if (
    typeof picturePath !== "string" ||
    !/^\/uploads\/[a-f0-9-]{36}\.png$/.test(picturePath)
  ) {
    return;
  }

  const filename = path.basename(picturePath);

  try {
    await fs.unlink(path.join(uploadDirectory, filename));
  } catch (error) {
    if (error.code !== "ENOENT") {
      logger.warn("Could not remove profile picture", {
        message: error.message
      });
    }
  }
}

module.exports = {
  saveProfilePicture,
  removeProfilePicture
};
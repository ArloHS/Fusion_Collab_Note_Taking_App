import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

export class UserAvatarManager {
  readonly directory: string;
  readonly defaultImage: string;

  constructor(directory: string, defaultImage: string) {
    this.directory = directory;
    this.defaultImage = defaultImage;
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory);
    }
  }

  // Save the avatar file to the directory with the username as the file name
  async saveAvatar(username: string, avatar: Buffer): Promise<void> {
    const { resizedImage } = await processImage(avatar);
    const filePath = path.join(this.directory, username);
    await fs.promises.writeFile(filePath, Buffer.from(resizedImage));
  }

  // Rename the avatar file to match the new username
  async updateUsername(originalUsername: string, newUsername: string) {
    const oldPath = path.join(this.directory, originalUsername);
    const newPath = path.join(this.directory, newUsername);
    await fs.promises.rename(oldPath, newPath);
  }

  // Read and return the avatar file for the given username
  async getAvatar(username: string): Promise<string> {
    const filePath = path.join(this.directory, username);
    try {
      fs.accessSync(filePath, fs.constants.F_OK);
      return filePath;
    } catch (e) {
      return this.defaultImage;
    }
  }
}

// Process an image
const processImage = async (image: any) => {
  const commonFormats = ["jpeg", "png", "webp", "gif"];

  // Check if the format is common
  const { format } = await sharp(image).metadata();
  if (commonFormats.includes(format!)) {
    const resizedImage = await sharp(image).resize(400, 400).toBuffer();

    return { resizedImage, format };
  } else {
    // Throw an error if the format unsupported
    throw new Error(`Unsupported format: ${format}`);
  }
};

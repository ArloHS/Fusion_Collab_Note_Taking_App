declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production";
      FILE_FOLDER_PATH: string;
      PRIVATE_KEY: string;
      PUBLIC_KEY: string;
      SALT_ROUNDS: string;
      AVATAR_DIRECTORY: string;
      DEFAULT_AVATAR_IMAGE: string;
      PORT?: string;
    }
  }
}

export {};

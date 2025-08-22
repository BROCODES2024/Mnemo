// src/utils/random.ts

import crypto from "crypto";

export const random = (length = 8) => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

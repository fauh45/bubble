import { Neogma } from "neogma";
import logger from "../logger";

export const neogma = new Neogma(
  {
    url: process.env.NEO4J_URI!,
    username: process.env.NEO4J_USERNAME!,
    password: process.env.NEO4J_PASSWORD!,
  },
  {
    logger: logger,
    encrypted: false,
  }
);

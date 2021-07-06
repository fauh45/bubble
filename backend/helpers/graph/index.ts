import { Neogma } from "neogma";

export const neogma = new Neogma({
  url: process.env.NEO4J_URI!,
  username: process.env.NEO4J_USERNAME!,
  password: process.env.NEO4J_PASSWORD!,
});

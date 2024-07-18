import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import db from ".";
import { sessions, users } from "./schema";

const adapter = new DrizzleSQLiteAdapter(db, sessions, users);
export default adapter;

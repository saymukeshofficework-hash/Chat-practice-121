import "server-only";
import { cookies } from "next/headers";
import type { Lang } from "@/types";

export const LANG_COOKIE = "examhub_lang";

/** Hindi is the default; English only when the visitor switched. */
export async function getLang(): Promise<Lang> {
  const c = (await cookies()).get(LANG_COOKIE)?.value;
  return c === "en" ? "en" : "hi";
}

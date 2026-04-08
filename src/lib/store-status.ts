import { unstable_cache } from "next/cache";
import { getSetting } from "./settings";

export type StoreStatus = "unconfigured" | "valid" | "invalid";

export const STORE_STATUS_TAG = "store-status";

export const getStoreStatus = unstable_cache(
  async (): Promise<StoreStatus> => {
    const value = await getSetting("mp_status");
    if (value === "valid" || value === "invalid") return value;
    return "unconfigured";
  },
  ["store-status"],
  { revalidate: 60, tags: [STORE_STATUS_TAG] }
);

export const getMpAccountEmail = unstable_cache(
  async (): Promise<string | null> => {
    return await getSetting("mp_account_email");
  },
  ["mp-account-email"],
  { revalidate: 60, tags: [STORE_STATUS_TAG] }
);

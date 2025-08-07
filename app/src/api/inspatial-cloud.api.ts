import { InCloudClient } from "@inspatial/cloud-client";

// TODO: Change to production URL when deployed
export const cloud = new InCloudClient("http://localhost:8000/api");

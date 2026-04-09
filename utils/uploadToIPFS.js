// utils/uploadToIPFS.js

import { create } from "ipfs-http-client";
import { Buffer } from "buffer";

const projectId = "YOUR_PROJECT_ID";
const projectSecret = "YOUR_PROJECT_SECRET";

const auth =
  "Basic " +
  Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

export const uploadToIPFS = async (file) => {
  try {
    console.log("Uploading file to IPFS...");
    const added = await client.add(file);
    console.log("Added:", added);

    const url = `https://infura-ipfs.io/ipfs/${added.path}`;
    return url;
  } catch (error) {
    console.error("IPFS ERROR:", error);
  }
};
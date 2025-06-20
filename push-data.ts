// @ts-ignore
import fsPromise from 'fs/promises';
import axios from 'axios';
import fg from "fast-glob";
import path from 'path';

interface APIItem {
  method: string
  path: string
}

async function pushAPIEndpointFiles(base_url: string, unique_id: string) {
  const baseURL = base_url;
  console.log({ baseURL, unique_id })
  const files = await fg("endpoints/*.ts");
  await Promise.all(files.map(async (filepath: string) => {
    try {
      console.log(`Push endpoint "${filepath}...`);
      (await axios.post('/public/raw/api-code', { filepath, data: await fsPromise.readFile(filepath, 'utf-8') }, { baseURL, params: { unique_id } })).data;
      console.log(`Push endpoint "${filepath} success`);
    } catch (err) {
      console.error(`[Error] push endpoint "${filepath}...`);
      console.error(err?.response?.data?.toString());
    }
  }))
}

async function push_data(baseURL: string, unique_id: string) {
  await pushAPIEndpointFiles(baseURL, unique_id);
}

// @ts-ignore
const argv: any = process.argv;

if (argv[2] && argv[3]) {
  push_data(argv[2], argv[3]);
} else {
  throw new Error(`argv[2] is required (baseURL); argv[3] is required (unique_id)`);
}

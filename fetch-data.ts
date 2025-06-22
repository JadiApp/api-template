// @ts-ignore
import fsPromise from 'fs/promises';
import axios from 'axios';
import fg from "fast-glob";

interface APIItem {
  method: string
  path: string
}

async function getAPIEndpointFiles(base_url: string, unique_id: string, list_component: APIItem[], semantic_versioning?: string) {
  const baseURL = base_url;
  await fsPromise.mkdir("./endpoints", { recursive: true });
  
  const files = await fg("./endpoints/*.ts");
  await Promise.all(files.map(file => fsPromise.rm(file, { force: true })));
  
  await Promise.all(list_component.map(async ({ method, path }) => {
    // skip empty method or path
    if (!method || !path) {
      return;
    }
  
    const api_file = (await axios.get('/public/raw/api-code', { baseURL, params: { unique_id, method, path, semantic_versioning } })).data;
    const filename = `${method.toLocaleLowerCase()}_${path.replace(/\//g, '_')}.ts`;
    console.log(`Writing endpoint "${method} ${path}" to "${filename}"...`);
    await fsPromise.writeFile(`./endpoints/${filename}`, [
      api_file,
      '',
      `export const __http_method = '${method ?? 'get'}';`,
      `export const __http_path = '${path ?? '/'}';`,
    ].join('\n'));
  }))
}

async function fetch_data(baseURL: string, unique_id: string, semantic_versioning?: string) {
  const api_data: APIItem[] = (await axios.get('/public/api-data', { baseURL, params: { unique_id, semantic_versioning } })).data;
  await getAPIEndpointFiles(baseURL, unique_id, api_data, semantic_versioning);
}

// @ts-ignore
const argv: any = process.argv;

if (argv[2] && argv[3]) {
  fetch_data(argv[2], argv[3], argv[4] as string | undefined);
} else {
  throw new Error(`argv[2] is required (baseURL); argv[3] is required (unique_id)`);
}

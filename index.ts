require('dotenv').config()

import fs from 'fs';
import * as fsPromises from 'fs/promises';
import path from 'path';
import express, { Request, Response } from 'express';

interface Endpoint {
  __http_method: string
  __http_path: string
  run(query: { [key: string]: any }, params: { [key: string]: any }, headers: { [key: string]: any }, body?: { [key: string]: any }): Promise<any>
}

async function getAllEndpoints(endpoint_folder_path: string): Promise<Endpoint[]> {
  if (fs.existsSync(path.resolve(__dirname, endpoint_folder_path))) {
    const list_implementation: string[] = await fsPromises.readdir(path.resolve(__dirname, endpoint_folder_path));
    const list_endpoint: Endpoint[] = [];
    for (const imp_filename of list_implementation.filter(x => x.endsWith('.js') || x.endsWith('.ts'))) {
      list_endpoint.push(require(path.resolve(__dirname, `${endpoint_folder_path}/${imp_filename}`)))
    }

    return list_endpoint;
  } else {
    console.error(`Folder "${endpoint_folder_path}" doesn't exist`);
    return [];
  }
}

async function main() {
  const app = express();

  const list_endpoint: Endpoint[] = await getAllEndpoints('endpoints');

  app.use(require('cors')());
  app.use(express.json({ limit: '50mb' }));

  for (const endpoint of list_endpoint.reverse()) {
    app[endpoint.__http_method.toLocaleLowerCase()](endpoint.__http_path, async (req: Request, res: Response) => {
      const headers = req.headers;
      const body = req.body;
      const paths = req.params;
      const query = req.query;
      
      try {
        const foo_result = await endpoint.run(query, paths, headers, body);
        res.status(200).json(foo_result);
      } catch (err: any) {
        res.status(500).send(err.toString());
      }
    });
    console.log(`API added: ${endpoint.__http_method} ${endpoint.__http_path}`);
  }
  
  const port = +(process.env.PORT ?? '18888');
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}

try {
  main();
} catch (err: any) {
  console.error(err);
}

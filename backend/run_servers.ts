import { readLines } from "https://deno.land/std@0.104.0/io/mod.ts";
import { writeAll } from "https://deno.land/std@0.104.0/io/util.ts";

async function pipeThrough(
    prefix: string,
    reader: Deno.Reader,
    writer: Deno.Writer,
  ) {
    const encoder = new TextEncoder();
    for await (const line of readLines(reader)) {
      await writeAll(writer, encoder.encode(`[${prefix}] ${line}\n`));
    }
  }

async function runHttp() {
    const httpServer = Deno.run(
        {
            cmd: ["file_server", "./public", "-p", "8080"],
            stdout: "piped",
            stderr: "piped",
        }
    )

    pipeThrough('HTTP',httpServer.stdout, Deno.stdout);
    pipeThrough('HTTP',httpServer.stderr, Deno.stderr);

    const http_code = (await httpServer.status()).code;
}

async function runWs() {
    const wsServer = Deno.run(
        {
            cmd: ["deno", "run", "--allow-net", "./backend/wsServer.ts"],
            stdout: "piped",
            stderr: "piped",
        }
    )

    pipeThrough('WS',wsServer.stdout, Deno.stdout);
    pipeThrough('WS',wsServer.stderr, Deno.stderr);

    const http_code = (await wsServer.status()).code;
}

runHttp();
runWs();
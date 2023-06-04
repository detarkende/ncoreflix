#!/usr/bin/env zx

import "zx/globals";

cd(__dirname);

async function log(text = "") {
    return await $`echo ${text} >> torrent-done.log`;
};

try {
    if (!process.env.TR_TORRENT_NAME) {
        await log(`FILE CALLED WITH NO TORRENT NAME`)
        await log(`${new Date().toLocaleString("hu")}`);
        throw new Error('No torrent name provided');
    }
    await log(`NEW TORRENT`);
    await log(`${new Date().toLocaleString("hu")}`);
    await log(`NAME: ${process.env.TR_TORRENT_NAME}`);
    await log(`DIR: ${process.env.TR_TORRENT_DIR}`);
    await log(`ID: ${process.env.TR_TORRENT_ID}`);

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10_000)


    const urlParams = new URLSearchParams({
        path: `${process.env.TR_TORRENT_DIR}/${process.env.TR_TORRENT_NAME}`,
    });

    const resp = await fetch(`http://localhost:3000/api/webhook?${urlParams.toString()}`, {
        signal: controller.signal
    });

    const respText = await resp.text();
    log(respText);
}
catch (e) {
    await log('');
    await log('Error:')
    await log(JSON.stringify(e, null, '\t'));
}
finally {
    await log('');
    await log('');
}
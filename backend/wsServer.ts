console.log('WEBSOCKETS GO HERE');

Deno.stdout.write(new TextEncoder().encode('AAAAAAAAAAAA'));

const wait = (ms: number) => {
    return new Promise(res => {
        setTimeout(() => res(1), ms);
    })
}

while (true) {
    await wait(500);
    console.log('do websocketz');
}


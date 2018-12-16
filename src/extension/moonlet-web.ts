const callbacks = [];

window.addEventListener('message', function(event) {
    // console.log('Web script: ', event.data);
    if (event.data && event.data.id && event.data.type) {
        for (const c of callbacks) {
            this.console.log('Web script listener:', event);
            if (c.id === event.data.id && c.type === event.data.type) {
                c.callback(event);
            }
        }
    }
});

function subscribe(id, type, callback) {
    const callbackConfig = { id, type, callback };
    callbacks.push(callbackConfig);
    return () => {
        const index = callbacks.indexOf(callbackConfig);
        callbacks.splice(index, 1);
    };
}

function send(to, amount): Promise<string> {
    const id = Math.random()
        .toString()
        .substring(2);

    return new Promise((resolve, reject) => {
        window.postMessage(
            {
                type: 'MOONLET_SEND',
                id,
                to,
                amount
            },
            '*'
        );

        const unsub = subscribe(id, 'MOONLET_SEND_RESPONSE', event => {
            // console.log('MOONLET_SEND_RESPONSE', event);
            if (event.data && event.data.result === 'CONFIRM') {
                // console.log('resolve');
                resolve(event.data);
            } else {
                reject(event.data);
            }

            unsub();
        });
    });
}

window.moonlet = {
    send
};

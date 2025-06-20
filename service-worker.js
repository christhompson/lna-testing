// Trigger a direct fetch() when worker receives a message.
onmessage = (event) => {
    // `event` contains a blob with the fetch details.
    console.log(JSON.stringify(event.data));
    fetch(event.data.url, event.data.options)
        .then((response) => {
            event.source.postMessage({ url: event.data.url, result: `response received` });
        })
        .catch((error) => {
            event.source.postMessage({ url: event.data.url, result: error });
        });
};

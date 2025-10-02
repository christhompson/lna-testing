const fetchInputBox = document.getElementById("fetch-input-box");
const fetchMethod = document.getElementById("fetch-method");
const fetchCors = document.getElementById("fetch-cors");
const fetchTargetAddressSpace = document.getElementById(
    "fetch-target-address-space"
);
const fetchForm = document.getElementById("fetch-form");
const resultList = document.getElementById("fetch-results-list");
const useServiceWorker = document.getElementById("service-worker");
const fetchHeaders = document.getElementById("fetch-headers");
const fetchBody = document.getElementById("fetch-body");

const subresourceForm = document.getElementById("subresource-form");
const subresourceInputBox = document.getElementById("subresource-input-box");
const subresourceImg = document.getElementById("subresource-img");

const subframeForm = document.getElementById("subframe-form");
const subframeInputBox = document.getElementById("subframe-input-box");
const subframeIFrame = document.getElementById("subframe-frame");

const websocketInputBox = document.getElementById("websocket-input-box");
const websocketForm = document.getElementById("websocket-form");
const websocketConnectButton = document.getElementById("websocket-connect");
const websocketSendButton = document.getElementById("websocket-send");
const websocketCloseButton = document.getElementById("websocket-close");
const websocketResultList = document.getElementById("websocket-results-list");

const webTransportInputBox = document.getElementById("webtransport-input-box");
const webTransportForm = document.getElementById("webtransport-form");
const webTransportConnectButton = document.getElementById("webtransport-connect");
const webTransportSendButton = document.getElementById("webtransport-send");
const webTransportCloseButton = document.getElementById("webtransport-close");
const webTransportResultList = document.getElementById("webtransport-results-list");


function appendResult(url, result) {
    const text = `${url}: ${result}`;
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(text));
    resultList.appendChild(item);
}

function tryFetch(url, options) {
    console.log(JSON.stringify(options));
    return fetch(url, options)
        .then((response) => {
            appendResult(url, `response received`);
        })
        .catch((error) => {
            appendResult(url, `error = ${error}`);
        });
}

function tryWorkerFetch(url, options) {
    if (navigator.serviceWorker) {
        navigator.serviceWorker.register("service-worker.js");

        navigator.serviceWorker.addEventListener("message", (event) => {
            // event is a MessageEvent object
            console.log(`The service worker sent me a message: ${JSON.stringify(event.data)}`);
            appendResult(event.data.url, event.data.result);
        });

        navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({ url: url, options: options });
        });
    } else {
        console.log("no service worker API");
    }
}

fetchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!fetchInputBox.validity.valid) {
        console.log("Input URL not valid");
        return;
    }
    // TODO: Add back the service worker, but it needs to only handle specific fetches
    // if (useServiceWorker) {
    //   (async function () {
    //     const registration = await navigator.serviceWorker.register(
    //       "service-worker.js"
    //     );
    //     console.log({ registration: registration.active });
    //   })();
    // } else {
    //   (async function () {
    //     const registration = await navigator.serviceWorker
    //       .getRegistrations()
    //       .then(function (registrations) {
    //         for (let registration of registrations) {
    //           registration.unregister();
    //           console.log({ registration: registration.active });
    //         }
    //       });
    //   })();
    // }
    let fetchOptions = {
        method: fetchMethod.value,
        mode: fetchCors.checked ? "cors" : "no-cors",
    };
    if (fetchTargetAddressSpace.value != "n/a") {
        fetchOptions["targetAddressSpace"] = fetchTargetAddressSpace.value;
    }
    if (fetchMethod.value == "POST") {
        fetchOptions["body"] = fetchBody.value;
    }
    if (fetchHeaders.value) {
        fetchOptions["headers"] = new Headers(JSON.parse(fetchHeaders.value));
    }

    if (useServiceWorker.checked) {
        // message the worker with the fetch details
        tryWorkerFetch(fetchInputBox.value, fetchOptions);
    } else {
        tryFetch(fetchInputBox.value, fetchOptions);
    }
});

subresourceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!subresourceInputBox.validity.valid) {
        console.log("Input URL not valid");
        return;
    }
    console.log("Swapping subresource image URL to " + subresourceInputBox.value);
    subresourceImg.src = subresourceInputBox.value;
});

subframeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!subframeInputBox.validity.valid) {
        console.log("Input URL not valid");
        return;
    }
    console.log("Navigating subframe to " + subframeInputBox.value);
    subframeIFrame.src = subframeInputBox.value;
});

// WebSockets
let webSocket;
function appendWebSocketResult(url, result) {
    const text = `${url}: ${result}`;
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(text));
    websocketResultList.appendChild(item);
}
websocketForm.addEventListener("submit", (event) => {
    event.preventDefault();
});
websocketConnectButton.onclick = (event) => {
    if (!websocketInputBox.validity.valid) {
        console.log("Input URL not valid");
        return;
    }
    const url = websocketInputBox.value;
    webSocket = new WebSocket(url);
    webSocket.addEventListener("open", (event) => {
        appendWebSocketResult(url, `open = ${JSON.stringify(event)}`);
    });
    webSocket.addEventListener("close", (event) => {
        appendWebSocketResult(url, `close = ${JSON.stringify(event)}`);
    });
    webSocket.addEventListener("message", (event) => {
        appendWebSocketResult(url, `message = ${JSON.stringify(event)}`);
    });
    webSocket.addEventListener("error", (event) => {
        appendWebSocketResult(url, `error = ${JSON.stringify(event)}`);
    });
};
websocketSendButton.onclick = (event) => {
    webSocket.send("Blorp");
};
websocketCloseButton.onclick = (event) => {
    webSocket.close();
};

// WebTransport

let webTransport;
let webTransportURL;

function appendWebTransportResult(result) {
    const text = `${webTransportURL}: ${result}`;
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(text));
    webTransportResultList.appendChild(item);
}
webTransportForm.addEventListener("submit", (event) => {
    event.preventDefault();
});
webTransportConnectButton.onclick = (event) => {
   if (!webTransportInputBox.validity.valid) {
        console.log("Input URL not valid");
        return;
    }
    webTransportURL = webTransportInputBox.value;
    webTransport = new WebTransport(webTransportURL);

    webTransport.ready
      .then(() => {
        appendWebTransportResult('WebTransport ready.');
      })
      .catch((error) => {
        appendWebTransportResult('WebTransport ready error = ${error}');
      });

    webTransport.closed
      .then(() => {
        appendWebTransportResult('WebTransport closed normally.');
      })
      .catch((error) => {
        appendWebTransportResult('WebTransport closed abruptly. error = ${error}');
      });
};

webTransportSendButton.onclick = async (event) => {
    let stream = await webTransport.createBidirectionalStream();
    let encoder = new TextEncoder();
    let writer = stream.writable.getWriter();
    await writer.write(encoder.encode("Hello, world!"))
    writer.close();
    appendWebTransportResult('Sent "Hello, world!", got back ' + await new Response(stream.readable).text());
};

webTransportCloseButton.onclick = (event) => {
    webTransport.close();
};

const permissionsApiForm = document.getElementById("permissions-api-form");
const permissionsApiQueryButton = document.getElementById("permissions-api-query");
const permissionsApiResultsList = document.getElementById("permissions-api-results-list");

function appendPermissionsApiResult(result) {
    const text = `${result}`;
    const item = document.createElement("li");
    item.appendChild(document.createTextNode(text));
    permissionsApiResultsList.appendChild(item);
}
permissionsApiForm.addEventListener("submit", (event) => {
    event.preventDefault();
});
permissionsApiQueryButton.onclick = (event) => {
    navigator.permissions.query({name: "local-network-access"})
        .then((result) => {
            appendPermissionsApiResult(result.state);
        })
        .catch((error) => {
            appendPermissionsApiResult(`error = ${error}`);
        });
};

// Main frame navigation

const mainframeForm = document.getElementById("mainframe-form");
const mainframeInputBox = document.getElementById("mainframe-input-box");

mainframeForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!mainframeInputBox.validity.valid) {
        console.log("Input URL not valid");
        return;
    }
    console.log("Navigating page to " + mainframeInputBox.value);
    window.location = mainframeInputBox.value;
});

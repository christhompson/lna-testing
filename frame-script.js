// Used for frame.html subframe navigation.

const subframeFormNoAllowlist = document.getElementById("subframe-form-not-allowlisted");
const subframeInputBoxNoAllowlist = document.getElementById("subframe-input-box-not-allowlisted");
const subframeIFrameNoAllowlist = document.getElementById("subframe-not-allowlisted");

subframeFormNoAllowlist.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!subframeInputBoxNoAllowlist.validity.valid) {
        console.log("Input URL not valid");
        return;
    }
    console.log("Navigating subframe to " + subframeInputBoxNoAllowlist.value);
    subframeIFrameNoAllowlist.src = subframeInputBoxNoAllowlist.value;
});

const subframeFormAllowlist = document.getElementById("subframe-form-allowlisted");
const subframeInputBoxAllowlist = document.getElementById("subframe-input-box-allowlisted");
const subframeIFrameAllowlist = document.getElementById("subframe-allowlisted");

subframeFormAllowlist.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!subframeInputBoxAllowlist.validity.valid) {
        console.log("Input URL not valid");
        return;
    }
    console.log("Navigating subframe to " + subframeInputBoxAllowlist.value);
    subframeIFrameAllowlist.src = subframeInputBoxAllowlist.value;
});

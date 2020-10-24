// Functionality copied from https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyToClipboard() {
    const el = document.createElement("textarea");

    el.style.position = 'fixed';
    el.style.top = 0;
    el.style.left = 0;
    el.style.width = '2em';
    el.style.height = '2em';
    el.style.padding = 0;
    el.style.border = 'none';
    el.style.outline = 'none';
    el.style.boxShadow = 'none';
    el.style.background = 'transparent';

    el.value = document.getElementById("iban").textContent;
    document.body.appendChild(el);
    el.focus();
    el.select();
    document.execCommand("copy");
    console.log("copied!");
    document.body.removeChild(el);
}

document.getElementById("btn-copy").addEventListener("click", copyToClipboard);
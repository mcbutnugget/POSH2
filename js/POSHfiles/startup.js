setInterval(function() {
    document.body.style.background = POSH.shellStyles.background;
},1);
(async () => {
    FolderContents = await POSH.fileSystem.readFolder("/home");
    if(FolderContents==0) await eval(await POSH.fileSystem.readFile("/bin/setupPC.js")); else await eval(await POSH.fileSystem.readFile("/bin/login.js"));
})();

window.addEventListener("beforeunload",(event)=>{
    const message = "we recommend using the shutdown command first, then leaving, are you sure?";

    event.returnValue = message; // Standard behavior
    return message; // For some older browsers
});
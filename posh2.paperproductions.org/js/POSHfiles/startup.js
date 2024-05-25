(async () => {
    FolderContents = await POSH.fileSystem.readFolder("/home");
    if(FolderContents==0) await eval(await POSH.fileSystem.readFile("/bin/setupPC.js")); else await eval(await POSH.fileSystem.readFile("/bin/login.js"));
})();


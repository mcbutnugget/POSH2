(async () => {
    await eval(await POSH.fileSystem.readFile("/etc/sn.js"));
})();
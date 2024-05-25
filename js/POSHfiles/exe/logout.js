(async () =>{
    await POSH.clear();
    await POSH.say("thank you for using POSH2!\n");

    await eval(await POSH.fileSystem.readFile(`/bin/login.js`));
})();
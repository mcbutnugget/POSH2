(async () => {
    await POSH.clear();
    await POSH.say("welcome to POSH2!\n");
    await POSH.say("input an existing username\n");
    await POSH.say("?>");
    var usrSel = await POSH.txtInput();
    if((await POSH.fileSystem.readFolder("home")).includes(usrSel)){
        await POSH.say(`alright, welcome back ${usrSel}! type your password\n`);
        await POSH.say(`?${usrSel}>`);
        var pass = await POSH.txtInput();
        if(await POSH.Staple.hash(pass, await POSH.fileSystem.readFile(`bin/pad/${usrSel}/s.txt`))==await POSH.fileSystem.readFile(`bin/pad/${usrSel}/h.txt`)){
            
        }
    }else{
        await POSH.say("that user doesn't exist! try again in 3 seconds");
        await POSH.pause(3000);
        await eval(await POSH.fileSystem.readFile("bin/login.js"));
    }
})();
(async () => {
    window.PCN = await POSH.fileSystem.readFile(`/bin/pad/PC.txt`);
    await POSH.clear();
    await POSH.say("welcome to POSH2!\n");
    await POSH.say("input an existing username\n");
    await POSH.say(`?`);
    POSH.text.forgroundColor = "rgb(0,255,0)";
    await POSH.say(`${window.PCN}`);
    POSH.text.forgroundColor = "white";
    await POSH.say(":")
    POSH.text.forgroundColor = "white";
    await POSH.say("> ")
    var usrSel = await POSH.txtInput();
    if((await POSH.fileSystem.readFolder("home")).includes(usrSel)){
        await POSH.say(`alright, welcome back ${usrSel}! type your password\n`);
        await POSH.say(`?`);
        POSH.text.forgroundColor = "rgb(0,255,0)";
        await POSH.say(`${window.PCN}`);
        POSH.text.forgroundColor = "white";
        await POSH.say(":")
        POSH.text.forgroundColor = "rgb(0,255,0)";
        await POSH.say(`${usrSel}`);
        POSH.text.forgroundColor = "white";
        await POSH.say("> ")
        POSH.text.forgroundColor = "black";
        var pass = await POSH.txtInput();
        POSH.text.forgroundColor = "white";
        if(await POSH.Staple.hash(pass, await POSH.fileSystem.readFile(`/bin/pad/${usrSel}/s.txt`))==await POSH.fileSystem.readFile(`/bin/pad/${usrSel}/h.txt`)){
            await POSH.say("\n\n");
            window.currentUser = usrSel;
            await eval(await POSH.fileSystem.readFile("/bin/boot.js"));
        }else{
            await POSH.say("nope, try again next time");
            await POSH.pause(2000);
            await eval(await POSH.fileSystem.readFile("/bin/login.js"))
        }
    }else{
        await POSH.say("that user doesn't exist! try again in 2 seconds");
        await POSH.pause(2000);
        await eval(await POSH.fileSystem.readFile("/bin/login.js"));
    }
})();
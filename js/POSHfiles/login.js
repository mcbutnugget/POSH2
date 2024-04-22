(async () => {
    await POSH.clear();
    await POSH.say("welcome to POSH2!\n");
    await POSH.say("input an existing username\n");
    await POSH.say("?>")
    var usrSel = await POSH.txtInput();
    if((await POSH.fileSystem.readFolder("home")).includes(usrSel)){

    }else{
        await POSH.say("that user doesn't exist! try again in 3 seconds");
        await POSH.pause(3000);
        eval()
    }
})();
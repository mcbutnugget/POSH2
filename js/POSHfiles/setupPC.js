(async () => {

    await POSH.say("let's start the setup process!\n\nType your PC's name (PCsN when your talking Paper Productions)\n\n");
    await POSH.say("?:> ");
    //a brand new command! the txtInput detects inputs as if you are typing in a shell
    window.PCN= await POSH.txtInput();
    if(window.PCN == ""){
        await POSH.say("you need a PCsN, please try again\n");
        await eval(await POSH.fileSystem.readFile("/bin/setupPC.js"));
        return;
    }
    await POSH.fileSystem.createFolder(`bin/pad`);
    await POSH.fileSystem.createFile(`bin/pad/PC.txt`,`${window.PCN}`);
    await eval(await POSH.fileSystem.readFile(`/bin/newUsr.js`));

})();
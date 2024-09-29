(async () => {
    //the POSH.say() cmd has been updated to be more like other shells, it no longer automatically creates a
    //new line, you have to add \n at the end of it in order to do that
    //this allows you to have more of a shell exprience inside of POSH

    //username creation
    await POSH.say("Type your new username\n\n");
    POSH.text.forgroundColor = "white";
    await POSH.say(`?`);
    POSH.text.forgroundColor = "rgb(0,255,0)";
    await POSH.say(`${window.PCN}`);
    POSH.text.forgroundColor = "white";
    await POSH.say(":> ")
    //a brand new command! the txtInput detects inputs as if you are typing in a shell
    window.currentUser = await POSH.txtInput();
    if(window.currentUser == ""){
        await POSH.say("you need a username, please try again\n");
        await eval(await POSH.fileSystem.readFile("/bin/newUsr.js"));
        return;
    }

    //password creation
    await POSH.say(`Input your new password\n\n`);
    POSH.text.forgroundColor = "white";
    await POSH.say(`?`);
    POSH.text.forgroundColor = "rgb(0,255,0)";
    await POSH.say(`${window.PCN}`);
    POSH.text.forgroundColor = "white";
    await POSH.say(":");
    POSH.text.forgroundColor = "rgb(0,255,0)";
    await POSH.say(`${window.currentUser}`);
    POSH.text.forgroundColor = "white";
    await POSH.say("> ")
    //more commands! you no longer use the setColor command for foreground and background
    //this one set's the color to black
    POSH.text.forgroundColor = "black";
    const pass = await POSH.txtInput();
    const salt = await POSH.Staple.generateSalt(1200);
    const hash = await POSH.Staple.hash(pass,salt);
    POSH.text.forgroundColor = "white";
    await POSH.say(`creating your new user...\n\n`);
    //these edit your files on the root folder you selected, you can set the root folder to an external storage device to move your copy of POSH
    await POSH.fileSystem.createFolder(`home/${window.currentUser}`);
    await POSH.fileSystem.createFolder(`bin/pad/users/${window.currentUser}`);
    await POSH.fileSystem.createFolder(`home/${window.currentUser}/main`);
    await POSH.fileSystem.createFile(`bin/pad/${window.currentUser}/s.txt`,salt);
    await POSH.fileSystem.createFile(`bin/pad/${window.currentUser}/h.txt`,hash);
    await POSH.say("your user has been created!\n\n");
    await eval(await POSH.fileSystem.readFile(`/bin/boot.js`))

})();
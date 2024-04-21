(async () => {
    //clears the console and asks for all of the stuff
    await POSH.clear();
    //the POSH.say() cmd has been updated to be more like other shells, it no longer automatically creates a
    //new line, you have to add \n at the end of it in order to do that
    //this allows you to have more of a shell exprience inside of POSH
    await POSH.say("Type your username\n");
    await POSH.say("?>");
    //a brand new command! the txtInput detects inputs as if you are typing in a shell
    const usr = await POSH.txtInput();
    await POSH.say(`Input your password\n`);
    await POSH.say(`?${usr}>`);
    //more commands! you no longer use the setColor command for foreground and background
    //this one set's the color to black
    POSH.forgroundColor = "black";
    const pass = await POSH.txtInput();
    const salt = await POSH.Staple.generateSalt(1200);
    const hash = await POSH.Staple.hash(pass,salt);
    POSH.forgroundColor = "white";
    await POSH.say(`creating your new user...`);
    //these edit your files on the root folder you selected, you can set the root folder to an external storage device to move your copy of POSH
    await POSH.fileSystem.createFolder(`home/${usr}`);
    await POSH.fileSystem.createFolder(`bin/pad/${usr}`);
    await POSH.fileSystem.createFile(`bin/pad/${usr}/s.txt`,salt);
    await POSH.fileSystem.createFile(`bin/pad/${usr}/h.txt`,hash);
    await POSH.say("your user has been created!");
    await eval(await POSH.fileSystem.readFile(`bin/boot.js`))

})();
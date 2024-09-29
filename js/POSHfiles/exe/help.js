(async() => {

    await POSH.say(`
    
    help -> shows a list of commands and how to use them
    cd path/to/folder -> use this to change your current directory
    mkdir folderName -> creates a folder or group of subfolders
    sn path/to/file -> opens a file in stickynote
    clear -> clears the shell
    rm path/to/folder/or/file -> deletes a file or folder
    cat path/to/file -> displays the data inside of said file
    ls -> displays all folders and files in the current folder
    logout -> logs out of the current user
    FiSi path/to/file -> shows the size of a file
    AFiCoM -> shows the help for AFiCoM
    
    
    
    you can also create commands by
    
    1. creating a .js file
    2. edit it with 'sn'
    3. input the path of the js file, but don't include .js, example:

    sn command.js

    (async()=>{
        POSH.say("\\nhello world!\\n");
    })();

    ctrl+e
    save
    exit
    ./command.js
    
    and you have created a command!
    
    if you want to be able to just use it, put it inside of the /bin/exe folder
    `);
    
    })();
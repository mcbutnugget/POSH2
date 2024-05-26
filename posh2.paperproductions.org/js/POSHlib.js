async function readDisk(filePath) {
    try {
        // Make an HTTP GET request to the server to fetch the file
        const response = await fetch(filePath);

        // Check if the response is successful (status code in the range 200-299)
        if (!response.ok) {
            throw new Error('Failed to fetch file: ' + response.statusText);
        }

        // Read the response body as text
        const fileContents = await response.text();

        // Log the file contents
        //console.log('File contents:', fileContents);

        return fileContents; // Return the file contents if you want to use it elsewhere
    } catch (error) {
        POSH.text.forgroundColor = "rgb(255,0,0)";
        POSH.say(`\nError reading file from server: ${error}\n`);
        console.error(`\nError reading file from server: ${error}\n`);
        POSH.text.forgroundColor = "white";
    }
}

var POSH = {
    fileSystem:{
        rootFolder: null,
    
        async chooseRootFolder() {
            try {
                this.rootFolder = await window.showDirectoryPicker();
                //console.log('Root folder set:', this.rootFolder);
            } catch (error) {
                POSH.text.forgroundColor = "rgb(255,0,0)";
                POSH.say(`\nError choosing root folder: ${error}\n`);
                console.error(`\nError choosing root folder: ${error}\n`);
                POSH.text.forgroundColor = "white";
            }
        },
    
        async createFile(path, data) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
        
                if (!path) {
                    POSH.text.forgroundColor = "rgb(255,0,0)";
                    POSH.say(`\nfile path cannot be empty\n`);
                    POSH.text.forgroundColor = "white";
                    return;
                }
        
                // Split the path into individual directory names and the file name
                if(path.includes("/")){
                const segments = path.split('/');
                const fileName = segments.pop(); // Get the file name
                const directoryPath = segments.join('/'); // Get the directory path
        
                let parentDirectoryHandle = this.rootFolder;
        
                // Loop through each directory in the path and create it if it doesn't exist
                for (const directory of directoryPath.split('/')) {
                    parentDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(directory, { create: true });
                }
                                // Create the file handle and write data to it
                                const fileHandle = await parentDirectoryHandle.getFileHandle(fileName, { create: true });
                                const writable = await fileHandle.createWritable();
                                await writable.write(data);
                                await writable.close();
                }else{
                    const fileName = path;
                                    // Create the file handle and write data to it
                const fileHandle = await this.rootFolder.getFileHandle(fileName, { create: true });
                const writable = await fileHandle.createWritable();
                await writable.write(data);
                await writable.close();
                }

        
                //console.log(`File created: ${path}`);
            } catch (error) {
                POSH.text.forgroundColor = "rgb(255,0,0)";
                //POSH.say(`\nError creating file: ${error}\n`);
                console.error(`\nError creating file: ${error}\n`);
                POSH.text.forgroundColor = "white";
            }
        },
    
        async createFolder(path) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
        
                if (!path) {
                    POSH.text.forgroundColor = "rgb(255,0,0)";
                    POSH.say(`\nfolder path cannot be empty\n`);
                    POSH.text.forgroundColor = "white";
                    return;
                }
        
                // Split the path into individual directory names
                const directories = path.split('/');
        
                let currentDirectoryHandle = this.rootFolder;
        
                // Loop through each directory in the path and create it if it doesn't exist
                for (const directory of directories) {
                    currentDirectoryHandle = await currentDirectoryHandle.getDirectoryHandle(directory, { create: true });
                }
        
               // console.log(`Folder created: ${path}`);
            } catch (error) {
                POSH.text.forgroundColor = "rgb(255,0,0)";
                //POSH.say(`\nError creating folder: ${error}\n`);
                console.error(`\nError creating folder: ${error}\n`);
                POSH.text.forgroundColor = "white";
            }
        },
    
        async delete(path) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
        
            if(path.includes("/")){
                // Split the path into individual directory names and the file name
                const segments = path.split('/');
                const fileName = segments.pop(); // Get the file name
                const directoryPath = segments.join('/'); // Get the directory path
        
                let parentDirectoryHandle = this.rootFolder;
        
                // Loop through each directory in the path and get its handle
                for (const directory of directoryPath.split('/')) {
                    parentDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(directory);
                }
        
                // Get the file handle and remove it
                await parentDirectoryHandle.removeEntry(fileName);
        
                //console.log(`Deleted: ${path}`);
            }else{
                await this.rootFolder.removeEntry(path);
            }
            } catch (error) {
                POSH.text.forgroundColor = "rgb(255,0,0)";
                //POSH.say(`\nError deleting: ${error}\n`);
                console.error(`\nError deleting: ${error}\n`);
                POSH.text.forgroundColor = "white";
            }
        },
        async readFolder(path) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
        
                // If the path is "/", return the contents of the root folder
                if (path === "/") {
                    const entries = await this.rootFolder.values();
                    const names = [];
                    for await (const entry of entries) {
                        names.push(entry.name);
                    }
                    //console.log(`Contents of folder "${path}":`, names);
                    return names;
                }
        
                // Split the path into individual directory names
                const directories = path.split('/').filter(directory => directory !== ''); // Remove empty directories
        
                let currentDirectoryHandle = this.rootFolder;
        
                // Loop through each directory in the path and get its handle
                for (const directory of directories) {
                    currentDirectoryHandle = await currentDirectoryHandle.getDirectoryHandle(directory);
                }
        
                // Read the contents of the current directory
                const entries = await currentDirectoryHandle.values();
        
                // Extract the names of files and folders
                const names = [];
                for await (const entry of entries) {
                    names.push(entry.name);
                    //console.log(entry);
                }
        
                //console.log(`Contents of folder "${path}":`, names);
                return names;
            } catch (error) {
                POSH.text.forgroundColor = "rgb(255,0,0)";
                //POSH.say(`\nError reading folder:${error}\n`);
                console.error(`\nError reading folder:${error}\n`);
                POSH.text.forgroundColor = "white";
                return null;
            }
        },
    
        async readFile(path) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
                if(path.replace(/^\//, "").match(/\/{1,}/)){
                    // Extract the file name and directory path from the provided path
                    const segments = path.replace(/^\//, "").split('/');
                    const fileName = segments.pop(); // Get the file name
                    const directoryPath = segments.join('/'); // Get the directory path


                    // Get the directory handle for the parent directory
                    let parentDirectoryHandle = this.rootFolder;

                    // Traverse through each directory in the path
                    for (const directory of directoryPath.split('/')) {
                        parentDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(directory);
                    }
                
                    // Get the file handle for the specified file
                    const fileHandle = await parentDirectoryHandle.getFileHandle(fileName);
                
                    // Get the file object
                    const file = await fileHandle.getFile();
                
                    // Read the text contents of the file
                    const fileContents = await file.text();
                
                   // console.log('File contents:', fileContents);
                    return fileContents;
                }else{
                    const fileName = path.replace(/^\//,"");

                    let parentDirectoryHandle = this.rootFolder;

                    const fileHandle = await parentDirectoryHandle.getFileHandle(fileName);

                    const file = await fileHandle.getFile();
                    const fileContents = await file.text();

                    //console.log('File contents:', fileContents);

                    return fileContents;
                }
                
            } catch (error) {
                POSH.text.forgroundColor = "rgb(255,0,0)";
                //POSH.say(`\nError reading file:${error}\n`);
                console.error(`\nError reading file:${error}\n`);
                POSH.text.forgroundColor = "white";
                return null;
            }
        },
        async readFileBin(path){
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
                if(path.replace(/^\//, "").match(/\/{1,}/)){
                    // Extract the file name and directory path from the provided path
                    const segments = path.replace(/^\//, "").split('/');
                    const fileName = segments.pop(); // Get the file name
                    const directoryPath = segments.join('/'); // Get the directory path


                    // Get the directory handle for the parent directory
                    let parentDirectoryHandle = this.rootFolder;

                    // Traverse through each directory in the path
                    for (const directory of directoryPath.split('/')) {
                        parentDirectoryHandle = await parentDirectoryHandle.getDirectoryHandle(directory);
                    }
                
                    // Get the file handle for the specified file
                    const fileHandle = await parentDirectoryHandle.getFileHandle(fileName);
                
                    // Get the file object
                    const file = await fileHandle.getFile();
                
                    // Read the text contents of the file
                    const fileContents = await file.arrayBuffer();
                
                   // console.log('File contents:', fileContents);
                    return fileContents;
                }else{
                    const fileName = path.replace(/^\//,"");

                    let parentDirectoryHandle = this.rootFolder;

                    const fileHandle = await parentDirectoryHandle.getFileHandle(fileName);

                    const file = await fileHandle.getFile();
                    const fileContents = await file.arrayBuffer();

                    //console.log('File contents:', fileContents);

                    return fileContents;
                }
                
            } catch (error) {
                POSH.text.forgroundColor = "rgb(255,0,0)";
                //POSH.say(`\nError reading file:${error}\n`);
                console.error(`\nError reading file:${error}\n`);
                POSH.text.forgroundColor = "white";
                return null;
            }
        }
    },
    Staple:{
        generateSalt(length) {
            const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let salt = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                salt += charset[randomIndex];
            }
            return salt;
        },
        async hash(string, salt) {
            const bytes = new TextEncoder().encode(string+salt);
          
            const hash = await crypto.subtle.digest('SHA-256', bytes);
            return Array.from(new Uint8Array(hash)).map(b => b.toString(36)).join('');
          },
        async binToUsableUrl(arrayBuffer) {
            const blob = new Blob([arrayBuffer], { type: "text/plain" });
            const url = URL.createObjectURL(blob);
            return url;
        },

    },
    text:{
        forgroundColor:"white",
        backgroundColor:"black",
        fontStyle:"'Press Start 2P'",
    },
    shellStyles:{
        background:"black",
    },
    
    async installPOSH(){
        await this.fileSystem.chooseRootFolder(); 
        var FolderContents = await this.fileSystem.readFile("startup.js");
        this.pause(10);
        await POSH.clear();
        if(FolderContents==null){
            await POSH.say("\n\ninstalling POSH...\n");
            POSH.text.forgroundColor = "rgb(0,255,0)";
            await POSH.say("p/startup.js\n");
            await this.fileSystem.createFile("startup.js", await readDisk("/js/POSHfiles/startup.js"))
            await POSH.say("p/main\n");
            await this.fileSystem.createFolder("main");
            await POSH.say("p/bin\n");
            await this.fileSystem.createFolder("bin");
            await POSH.say("p/home\n");
            await this.fileSystem.createFolder("home");
            await POSH.say("p/etc\n");
            await this.fileSystem.createFolder("etc");
            await POSH.say("p/tmp\n");
            await this.fileSystem.createFolder("tmp");
            await POSH.say("p/bin/newUsr.js\n");
            await this.fileSystem.createFile("bin/newUsr.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/newUsr.js"));
            await POSH.say("p/bin/boot.js\n");
            await this.fileSystem.createFile("bin/boot.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/boot.js"));
            await POSH.say("p/bin/login.js\n");
            await this.fileSystem.createFile("bin/login.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/login.js"));
            await POSH.say("p/bin/setupPC.js\n");
            await this.fileSystem.createFile("bin/setupPC.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/setupPC.js"));
            await POSH.say("p/bin/exe\n");
            await this.fileSystem.createFolder("bin/exe");
            await POSH.say("p/bin/exe/ls.js\n");
            await this.fileSystem.createFile("bin/exe/ls.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/ls.js"));
            await POSH.say("p/bin/exe/clear.js\n");
            await this.fileSystem.createFile("bin/exe/clear.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/clear.js"));
            await POSH.say("p/bin/exe/cd.js\n");
            await this.fileSystem.createFile("bin/exe/cd.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/cd.js"));
            await POSH.say("p/bin/exe/cat.js\n");
            await this.fileSystem.createFile("bin/exe/cat.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/cat.js"));
            await POSH.say("p/bin/exe/logout.js\n");
            await this.fileSystem.createFile("bin/exe/logout.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/logout.js"));
            await POSH.say("p/bin/exe/mkdir.js\n");
            await this.fileSystem.createFile("bin/exe/mkdir.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/mkdir.js"));
            await POSH.say("p/bin/exe/rm.js\n");
            await this.fileSystem.createFile("bin/exe/rm.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/rm.js"));
            await POSH.say("p/bin/exe/sn.js\n");
            await this.fileSystem.createFile("bin/exe/sn.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/sn.js"));
            await POSH.say("p/bin/exe/help.js\n");
            await this.fileSystem.createFile("bin/exe/help.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/exe/help.js"));
            await POSH.say("p/etc/sn.js\n");
            await this.fileSystem.createFile("etc/sn.js", await readDisk("https://posh2.paperproductions.org/js/POSHfiles/etc/sn.js"));

            POSH.text.forgroundColor = "white";
            await POSH.say("\nPOSH2 has been installed!\n");

        } 
        (async () => {
            await eval(await POSH.fileSystem.readFile("startup.js"));
        })();
    },
    async pause(amount) {
        return new Promise((resolve) => {
          forPause = setInterval(resolve, amount);
        });
      },
      async say(text, x, y) {
        var txt = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
        if(y!=null){
            document.querySelector("body").innerHTML += `<span style="position:absolute; top:0; left:0;">${"\n".repeat(y<0?0:y)+" ".repeat(x<0?0:x)}<span style="color:${this.text.forgroundColor}; font-family:${this.text.fontStyle}; background-color:${this.text.backgroundColor};">${txt}</span></span>`;
        }else{
            document.querySelector("body").innerHTML += `<span style="color:${this.text.forgroundColor}; font-family:${this.text.fontStyle}; background-color:${this.text.backgroundColor}">${txt}</span>`;
        }
       
      },
      txtInput: async function(startingText, preventEnter) {
        return new Promise(resolve => {
            // Create a contenteditable span
            const span = document.createElement('span');
            span.style.width = "1000vw";
            span.style.color = this.text.forgroundColor;
            span.style.backgroundColor = this.text.backgroundColor;
            span.style.fontFamily = this.text.fontStyle;
            span.contentEditable = true;
            startingText ? span.innerHTML = String(startingText)
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;') : span.innerHTML = "";
            span.style.border = '0';
    
            // Listen for Enter key press event
            span.addEventListener('keydown', function(event) {
                if (document.activeElement === span && event.key === 'Tab') {
                    event.preventDefault(); // Prevent switching focus
                    // Insert tab character instead
                    document.execCommand('insertText', false, '    ');
                }else if ((event.key === 'Enter' && event.shiftKey === false && !preventEnter) ||
                    (event.key === 'e' && event.ctrlKey === true && preventEnter)) {
                    event.preventDefault(); // Prevent newline character
                    span.contentEditable = false; // Disable contenteditable
                    resolve(span.innerText.trim()); // Resolve the promise with the innerText
                    span.innerText += "\n";
                } else if (event.key === 'c' && event.shiftKey === false && event.ctrlKey === true) {
                    return;
                }
            });
    
            // Handle paste event
            span.addEventListener('paste', function(event) {
                event.preventDefault(); // Prevent default paste behavior
    
                // Get the pasted text from the clipboard
                const pastedText = (event.clipboardData || window.clipboardData).getData('text/plain');
    
                // Manipulate the pasted text as needed (e.g., sanitize, transform)
                const sanitizedText = pastedText.trim();
    
                // Insert the sanitized text into the span
                document.execCommand('insertText', false, sanitizedText);
            });
    
            // Append the span to the document body
            document.body.appendChild(span);
    
            // Focus on the span for immediate input
            span.focus();

            document.querySelector('html').addEventListener('click', function(event) {
                // Check if the click occurred outside the span
                if (event.target !== span && !span.contains(event.target)) {
                    // Focus on the span
                    span.focus();
                }
            });
        });
    }
    ,
    async clear(){
        document.querySelector("body").innerHTML = "";
    }
}
setInterval(function() {
    document.body.style.background = POSH.shellStyles.background;
},1);

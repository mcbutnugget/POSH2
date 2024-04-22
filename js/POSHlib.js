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
        console.error('Error reading file from server:', error);
    }
}

var POSH = {
    fileSystem:{
        rootFolder: null,
    
        async chooseRootFolder() {
            try {
                this.rootFolder = await window.showDirectoryPicker();
                console.log('Root folder set:', this.rootFolder);
            } catch (error) {
                console.error('Error choosing root folder:', error);
            }
        },
    
        async createFile(path, data) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
        
                if (!path) {
                    console.error('File path cannot be empty.');
                    return;
                }
        
                // Split the path into individual directory names and the file name
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
        
                console.log(`File created: ${path}`);
            } catch (error) {
                console.error('Error creating file:', error);
            }
        },
    
        async createFolder(path) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
        
                if (!path) {
                    console.error('Folder path cannot be empty.');
                    return;
                }
        
                // Split the path into individual directory names
                const directories = path.split('/');
        
                let currentDirectoryHandle = this.rootFolder;
        
                // Loop through each directory in the path and create it if it doesn't exist
                for (const directory of directories) {
                    currentDirectoryHandle = await currentDirectoryHandle.getDirectoryHandle(directory, { create: true });
                }
        
                console.log(`Folder created: ${path}`);
            } catch (error) {
                console.error('Error creating folder:', error);
            }
        },
    
        async delete(path) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
    
                await this.rootFolder.removeEntry(path, { recursive: true });
                console.log(`Deleted: ${path}`);
            } catch (error) {
                console.error('Error deleting:', error);
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
                    console.log(`Contents of folder "${path}":`, names);
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
                }
        
                console.log(`Contents of folder "${path}":`, names);
                return names;
            } catch (error) {
                console.error('Error reading folder:', error);
                return null;
            }
        },
    
        async readFile(path) {
            try {
                if (!this.rootFolder) await this.chooseRootFolder();
    
                // Split the path into individual directory names and the file name
                const segments = path.split('/');
                const fileName = segments.pop(); // Get the file name
                const directoryPath = segments.join('/'); // Get the directory path
    
                // Get the directory handle for the parent directory
                const parentDirectoryHandle = await this.rootFolder.getDirectoryHandle(directoryPath);
    
                // Get the file handle and read its contents
                const fileHandle = await parentDirectoryHandle.getFileHandle(fileName);
                const file = await fileHandle.getFile();
                const contents = await file.text();
    
                console.log(`Contents of file "${path}":`, contents);
                return contents;
            } catch (error) {
                console.error('Error reading file:', error);
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
          }
    },
    forgroundColor:"white",
    async installPOSH(){
        await this.fileSystem.chooseRootFolder(); 
        var FolderContents = await this.fileSystem.readFolder("/");
        this.pause(10);
        await POSH.clear();
        if(FolderContents==0){
            await POSH.say("installing POSH...\n");
            POSH.forgroundColor = "rgb(0,255,0)";
            await POSH.say("p/main\n");
            await this.fileSystem.createFolder("main");
            await POSH.say("p/bin\n");
            await this.fileSystem.createFolder("bin");
            await POSH.say("p/home\n");
            await this.fileSystem.createFolder("home");
            await POSH.say("p/etc\n");
            await this.fileSystem.createFolder("etc");
            await POSH.say("p/bin/newUsr.js\n");
            await this.fileSystem.createFile("bin/newUsr.js", await readDisk("../js/POSHfiles/newUsr.js"));
            await POSH.say("p/bin/boot.js\n");
            await this.fileSystem.createFile("bin/boot.js", await readDisk("../js/POSHfiles/boot.js"));
            await POSH.say("p/bin/login.js\n");
            await this.fileSystem.createFile("bin/login.js", await readDisk("../js/POSHfiles/login.js"));
            POSH.forgroundColor = "white";
            await POSH.say("POSH2 has been installed!");

        } 
        (async () => {
            FolderContents = await POSH.fileSystem.readFolder("/home");
            if(FolderContents==0) await eval(await POSH.fileSystem.readFile("bin/newUsr.js")); else await eval(await POSH.fileSystem.readFile("bin/login.js"));
        })();
    },
    async pause(amount) {
        return new Promise((resolve) => {
          forPause = setInterval(resolve, amount);
        });
      },
      async say(text) {
        var txt = String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;');
       document.querySelector("body").innerHTML += `<span style="color:${this.forgroundColor};">${txt}</span>`;
      },
      txtInput: async function() {
        return new Promise(resolve => {
            // Create a contenteditable span
            const span = document.createElement('span');
            span.style.width = "50%";
            span.style.color = this.forgroundColor;
            span.contentEditable = true;
            //span.style.border = '1px solid black';
            //span.style.padding = '2px';

            // Listen for Enter key press event
            span.addEventListener('keydown', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault(); // Prevent newline character
                    span.contentEditable = false; // Disable contenteditable
                    resolve(span.innerHTML.trim()); // Resolve the promise with the innerHTML
                    span.innerText+="\n";
                }
            });

            // Append the span to the document body
            document.body.appendChild(span);

            // Focus on the span for immediate input
            span.focus();
        });
      },
    async clear(){
        document.querySelector("body").innerHTML = "";
    }
}


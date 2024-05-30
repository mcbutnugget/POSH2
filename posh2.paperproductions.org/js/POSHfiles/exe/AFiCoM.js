function repeatCompress(buffer) {
    const view = new Uint8Array(buffer);
    let result = [];
    let currentByte = view[0];
    let count = 1;

    for (let i = 1; i < view.length; i++) {
        if (view[i] === currentByte) {
            count++;
        } else {
            result.push(currentByte, count);
            currentByte = view[i];
            count = 1;
        }
    }

    // Push the last byte and its count
    result.push(currentByte, count);

    return Uint8Array.from(result).buffer;
}

function repeatDecompress(text) {
    let result = '';
    for (let i = 0; i < text.length; i += 2) {
        let char = text[i];  // Character part
        let count = text.charCodeAt(i + 1);  // Repetition count in ASCII code
        result += char.repeat(count);  // Repeat the character 'count' times
    }
    return result;
}

function splitAndCompress(input) {
    // Convert input to string if it's an ArrayBuffer
    if (input instanceof ArrayBuffer) {
        const decoder = new TextDecoder('utf-8');
        input = decoder.decode(input);
    }

    // Split the input by space
    const parts = input.split(' ');

    // Compress each part and convert them to ArrayBuffers
    const compressedArrayBuffers = parts.map(part => {
        return repeatCompress(part);
    });

    // Calculate the number of spaces between the parts
    const spaceCount = parts.length - 1;

    // Create the final array containing the compressed ArrayBuffers and space count
    const result = [...compressedArrayBuffers, spaceCount];

    return result;
}
function mapBuffersToNumbers(compressedParts) {
    return compressedParts.filter((element, index) => index % 2 === 0);
}


//repeat compress function
(async()=>{
    if(fixInput[1]=="--compress" || fixInput[1]=="-c"){
         //tooken fron the 'cat' command
         //const location = window.currentLocation;
         var newLocation = fixInput[2];
         //console.log(newLocation)
         newLocation = `${window.currentLocation}/${newLocation}`;
         //console.log(newLocation)
         newLocation = newLocation.replace(/^(.*)\/\//,"");
         //console.log(newLocation)
         var locations = newLocation.replace(/^\//,"").split("/");
        // console.log(locations);
         for(var i = 0; i<=locations.length; i++){
            // console.log(locations[i]);
             //console.log(i);
             if(locations[i]==".."){
                 locations.splice(i,1);
                 locations.splice(i-1,1);
                 i-=2;
             }
         }
         newLocation = locations.join("/").replace(/\/$/,"");
         console.log(newLocation);
         if(await POSH.fileSystem.readFile(newLocation)!=null){
             //step 1: get input file

             var fileData = await POSH.fileSystem.readFileBin(newLocation);    //returns a buffer to be used in the repeatCompress function
             var fileName = newLocation;                                       //set's 'fileName' to the location of the file for easy retreval

             //step 2: repeat compress the file
                                                                              //we have our compressed data, but how are we gonna store it?
                                                                              //how will it know what is a word and what's not a word?
                                                                              //it could do segments of data, so " hello" is one word, so is "   world!"
                                                                              //how do we define segments tho?
                                                                              //what we could do is we could split the data by the start of a whitespace character using regex


             var decoder = new TextDecoder();
             var encoder = new TextEncoder();
             var fileDataStr = decoder.decode(fileData);

             let splits = [];

             // Splitting at the start of each word
             const words = fileDataStr.split(/(?=(?<=\s|^)\S+)/);
             for (let word of words) {
                 // Splitting each word into chunks of 127 characters
                 for (let i = 0; i < word.length; i += 127) {
                     splits.push(word.substring(i, i + 127));
                 }
             }
         fileDataStr = splits;

             //console.log("string: ",fileDataStr);

             fileDataStr.forEach((word, index)=>{

                 newWord = encoder.encode(word).buffer;
                 //console.log("word compressed ",decoder.decode(repeatCompress(newWord)));
                 fileDataStr[index] = decoder.decode(repeatCompress(newWord)); //repeat compresses the word
             });


             //now we have an array with some strungs

             //step 3: map to a number
             if(await POSH.fileSystem.readFile("/etc/AFiCoM/AFiCoM.dict")!=null){
             var mappedWords = Array.from(new Set((await POSH.fileSystem.readFile("/etc/AFiCoM/AFiCoM.dict")).split("\0").concat(fileDataStr)));         //mapped words holds the words that are to be used in fileData
             }else{
                 var mappedWords = Array.from(new Set(fileDataStr));
             }
             //console.log("mapped words",mappedWords);

             fileDataStr = fileDataStr.join("");
             //console.log(fileDataStr);

             fileData = encoder.encode(fileDataStr).buffer;  //file data is where the final compressed data is


             await POSH.fileSystem.createFile("etc/AFiCoM/AFiCoM.dict",mappedWords.join("\0"));//creates the dictionary
             //step 4: repeat compress the output of the file.
 

             let dictionary = (await POSH.fileSystem.readFile("/etc/AFiCoM/AFiCoM.dict")).split("\0");

             let inputString = decoder.decode(fileData);

             console.log("fileData,", decoder.decode(fileData));

             let wordToIndexMap = {};
             dictionary.forEach((word, index) => {
                 if (word !== "") { // Skip empty strings
                     wordToIndexMap[word] = index + 1;
                 }
             });

             let indicesArray = [];
             let i = 0;

             while (i < inputString.length) {
                 let replaced = false;
                 for (let word in wordToIndexMap) {
                     if (inputString.startsWith(word, i)) {
                         indicesArray.push(wordToIndexMap[word]);
                         i += word.length;
                         replaced = true;
                         break;
                     }
                 }
                 if (!replaced) {
                     i++;
                 }
             }

             // Convert the indices array to an ArrayBuffer
             let arrayBuffer = new ArrayBuffer(indicesArray.length);
             let uint8Array = new Uint8Array(arrayBuffer);
             indicesArray.forEach((index, idx) => {
                 uint8Array[idx] = index;
             });

                 console.log(arrayBuffer);




             console.log("final output file", new Uint8Array(arrayBuffer));
             if(fixInput[3]=="-n" || fixInput[3]=="--name"){
                POSH.fileSystem.createFile(`${(window.currentLocation).replace(/^\//,"")}/${fixInput[4]}.afi`, new Uint8Array(arrayBuffer)); //creates the AFiCoM file
             }else{
                POSH.fileSystem.createFile(fileName + ".afi", new Uint8Array(arrayBuffer)); //creates the AFiCoM file
             }

         }else{
             POSH.text.forgroundColor = "red";
             await POSH.say("\nthat file doesn't exist!\n");
             POSH.text.forgroundColor = "white";
         }
    }else if(fixInput[1]=="--decompress" || fixInput[1]=="-d"){
        //tooken fron the 'cat' command
        //const location = window.currentLocation;
        var newLocation = fixInput[2];
        //console.log(newLocation)
        newLocation = `${window.currentLocation}/${newLocation}`;
        //console.log(newLocation)
        newLocation = newLocation.replace(/^(.*)\/\//,"");
        //console.log(newLocation)
        var locations = newLocation.replace(/^\//,"").split("/");
       // console.log(locations);
        for(var i = 0; i<=locations.length; i++){
           // console.log(locations[i]);
            //console.log(i);
            if(locations[i]==".."){
                locations.splice(i,1);
                locations.splice(i-1,1);
                i-=2;
            }
        }
        newLocation = locations.join("/").replace(/\/$/,"");
        console.log(newLocation);
        if(await POSH.fileSystem.readFile(newLocation)!=null){
            const data = (await POSH.fileSystem.readFile(newLocation));
            const dictionary = (await POSH.fileSystem.readFile("/etc/AFiCoM/AFiCoM.dict")).split("\0");
            var rawDictData = "";
            for(var i = 0; i < data.length; i++){
                rawDictData = rawDictData.concat(dictionary[data.charCodeAt(i)-1]);
            }
            const finalData = repeatDecompress(String(rawDictData));

            if(fixInput[3]=="-n" || fixInput[3]=="--name"){
                POSH.fileSystem.createFile(`${(window.currentLocation).replace(/^\//,"")}/${fixInput[4]}`,finalData);
            }else{
                POSH.fileSystem.createFile(newLocation.replace(/\.afi$/,""),finalData);
            }

        }else{
            POSH.text.forgroundColor = "red";
            await POSH.say("\nthat file doesn't exist!\n");
            POSH.text.forgroundColor = "white";
        }
   }else{
    await POSH.say(`

    welcome to AFiCoM! here is a list of commands that can be used and what they do
    AFiCoM -c path/to/file -> compresses a file into a .afi file,

    AFiCoM -d path/to/file.afi --> decompresses a .afi file back into it's base form

    you can also add -n to the end of either of these, followed by the new name of the file like so

    AfiCoM -c path/to/file -n name

    AFiCoM -d path/to/file.afi -n name

    AFiCoM compresses your files
    `)
   }
})();

(async () => {
    window.currentLocation = `/home/${window.currentUser}/main`
    await POSH.say(`welcome to POSH2 ${window.currentUser}!\n\n`)
    await POSH.say("type 'help' for a list of commands\n");
    try{
        await run();
    }catch(err){

        var aux = err.stack.split("\n");
        aux.splice(0, 2); //removing the line that we force to generate the error (var err = new Error();) from the message
        aux = aux.join('\n"');

        POSH.text.forgroundColor = "red";
        await POSH.say("\n\n"+err+"\n\n" + aux+"\n\n");
        POSH.text.forgroundColor = "white";

        await run();
    }
})();
async function run(){
    POSH.text.forgroundColor = "cyan";
    await POSH.say(`\n${POSH.fileSystem.rootFolder.name}${window.currentLocation}`);
    POSH.text.forgroundColor = "white";
    await POSH.say(`?`);
    POSH.text.forgroundColor = "rgb(0,255,0)";
    await POSH.say(`${window.PCN}`);
    POSH.text.forgroundColor = "white";
    await POSH.say(":")
    POSH.text.forgroundColor = "rgb(0,255,0)";
    await POSH.say(`${window.currentUser}`);
    POSH.text.forgroundColor = "white";
    await POSH.say("> ")
    var input = await POSH.txtInput();
    var fixInput = input.split(/\s(?=(?:[^"]*"[^"]*")*[^"]*$)/).map(item => item.replace(/"/g, ''));
    console.log(fixInput);

    //code for executing files and commands

    var location = "/bin/exe";
    var newLocation = fixInput[0];
    //console.log(newLocation);
    newLocation = `${location}/${newLocation}`;
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
        if(locations[i]=="."){
           location = window.currentLocation;
           newLocation = fixInput[0].replace(/\.\//,"");
           newLocation = `${location}/${newLocation}`;
           locations = newLocation.replace(/^\//,"").split("/");
            i=0;
        }
    }
    if(locations.join("/").replace(/\/$/,"").startsWith("bin/exe")){

        newLocation = locations.join("/").replace(/\/$/,"")+".js";

    }else{

        newLocation = locations.join("/").replace(/\/$/,"");

    }
    
    console.log(newLocation);
    //await POSH.say(newLocation);
    if(await POSH.fileSystem.readFile(newLocation)!=null){

        await eval(await POSH.fileSystem.readFile(newLocation));
    }else if(/^\s*$/.test(fixInput[0])){
        
    }else{
        POSH.text.forgroundColor = "red";
        await POSH.say("\nthat isn't a valid command or executable!\n");
        POSH.text.forgroundColor = "white";
    }
        
    

    await run();
}
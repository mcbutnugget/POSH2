(async () => {
    window.currentLocation = `home/${window.currentUser}/main`
    await POSH.clear();
    await POSH.say(`welcome to POSH2 ${window.currentUser}!\n\n`)
    await POSH.say("type 'help' for a list of commands\n");
    await run();
})();
async function run(){
    await POSH.say(`\n${POSH.fileSystem.rootFolder.name}/${window.currentLocation}?${window.currentUser}> `);
    var input = await POSH.txtInput();
    var fixInput = input.split(/\s(?=(?:[^"]*"[^"]*")*[^"]*$)/);
    await eval(await POSH.fileSystem.readFile(`bin/exe/${fixInput[0]}.js`));
    await run();
}
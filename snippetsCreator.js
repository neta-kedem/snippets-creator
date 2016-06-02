//the global variable that accumalate the list of functions read and num of occurrences
var gFuncsAndOccurrences = {};

//whether my browser can read file
if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('I can read files');
    //listener to adding more js files to read
    document.getElementById('fileinput')
        .addEventListener('change', readSingleFile, false);
} else {
    alert('The File APIs are not fully supported by your browser.');
}

//called after a new file was added
function readSingleFile(evt) {
    //f is the first (and only) file
    var f = evt.target.files[0];
    if (f) {
        var r = new FileReader();
        r.onload = function (e) {
            var contents = e.target.result;
            //alert('Got the file ' + 'name: ' + f.name + ' ' + 'type: ' + f.type + ' ' + 'size: ' + f.size + ' bytes ' + 'starts with: ' + contents.substr(0, contents.indexOf(' ')));
            printProg(contents);
        }
        r.readAsText(f);
    } else {
        alert('Failed to load file');
    }
}

//called after the file was loaded
function printProg(fileContentStr) {
    var elcommands = document.querySelector('.commands');
    //console.log('original length' + fileContentStr.length);
    var commands = fileContentStr.split(' ');
    //cleaning and removing un-necessary symbols
    commands = removeCharFromArr(commands, '/');
    commands = removeCharFromArr(commands, '(');
    commands = removeCharFromArr(commands, ')');
    commands = removeCharFromArr(commands, "'");
    commands = removeCharFromArr(commands, '[');
    commands = removeCharFromArr(commands, ']');
    //remove all the empty cells 
    commands = commands.filter(str => {
        if (str) return str;
    });

    //console.log('second length' + commands.length)
    //console.log('second edit' + verySecondStr);

    //this is the most important line of the program- this is how i recognize a function!
    commands = commands.filter(str => {
        if (str.includes('.')) return str;
    });
    //    console.log(commands);
    //add commands to the global object and convert the object into an array, it's easier to print it like that
    var occurrences = mostCommonStrInArr(commands);
    elcommands.innerHTML = '';
    //list of all commands used. updated every time we add a file
    occurrences.forEach(str => {
        elcommands.innerHTML += ('<br>' + str[0] + ' : ' + str[1])
    });
}

//clean the js file being read from un-useful chars
function removeCharFromArr(arr, charToRemove) {
    var newArr = arr.map(str =>
        str.split(charToRemove));
    newArr = [].concat.apply([], newArr);
    return newArr;
}

//accumulate the commands with the global object, and calls a function that returns a sorted array
function mostCommonStrInArr(arr) {
    for (var i = 0, j = arr.length; i < j; i++) {
        gFuncsAndOccurrences[arr[i]] = (gFuncsAndOccurrences[arr[i]] || 0) + 1;
    }
    //i wanted to put an improvmant to the algorithm- that if i have arr.length and arr2.length, that it won't be counted twice, but it didn't really worked
    /*
        var bool;
            for (var i = 0, j = arr.length; i < j; i++) {
                for (var command in gOccurrencesObj){
                    if         
                }
                var br = arr[i].split('.');
                if (command.split('.')[1] !== second[1])
                    gOccurrencesObj[arr[i]] = (gOccurrencesObj[arr[i]] || 0) + 1;
            }*/
    //    console.log('starting');
    //    console.log(gFuncsAndOccurrences);
    return occObjToArr(gFuncsAndOccurrences);
}
//returns an array sorted by the number of the occurrences of the command
function occObjToArr(occuObj) {
    var arr = [];
    for (var comand in occuObj) arr.push([comand, occuObj[comand]]);
    arr.sort((a, b) => {
        return b[1] - a[1];
    });
    return arr;
}

//creates a snippet and prints it
function makeMeASnippet(command) {
    var short = command.split('.');
    var snippet;
    snippet = '"' + command + '":{"prefix": "' +
        short[1] + '","body":["' + command + '"]}';
    console.log(snippet);
    var elSnippets = document.querySelector('.snippets');
    elSnippets.innerHTML += '<br>' + snippet + ',';
    return snippet;
}

//called when you press the button
function makeSnippets() {
    //clean the div
    document.querySelector('.snippets').innerHTML = '';
    var occurrences = mostCommonStrInArr(gFuncsAndOccurrences);
    occurrences.forEach(commandInArr => {
        makeMeASnippet(commandInArr[0]);
    });
}
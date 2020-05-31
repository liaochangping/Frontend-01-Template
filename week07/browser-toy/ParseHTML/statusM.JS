import { endianness } from "os";

match("abcabcabx")

function match(str){

    let state = start;

    for(let c of str){
       state = state(c);
    }

    return state == end;
}

function start(char){

    if(char == 'a'){

        return foundA;
    }else {

        return start(char);
    }
}

function foundA(char){

    if(char == 'b'){

        return foundB;
    }else {

        return start(char);
    }
}

function foundB(char){

    if(char == 'c'){

        return foundC;
    }else {

        return start(char);
    }
}

function foundNA(char){

    if(char == 'a'){

        return foundNB;
    }else {

        return start;
    }
}

function foundNB(char){

    if(char == 'b'){

        return foundNC;
    }else {

        return start;
    }
}

function foundNC(char){

    if(char == 'x'){

        return end;
    }else if(char == 'c') {

        return foundB(char);
    }
}

function end()

    return "";
}
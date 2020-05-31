const net = require('net');
const imges = require('images');
const parserHTML = require('./parser.js');
const render = require('./render.js');

//请求，以promise的async的方式进行
class Request {

    //Method、Path 
    constructor(options){

        this.method = options.method || "GET";
        this.host = options.host;
        this.port = options.port || 80;
        this.url = options.url;
        this.header = options.header || {};
        this.body = options.body || {};
        
        if(!this.header["Content-Type"]) {

            this.header["Content-Type"] = "application/x-www-form-urlencoded";
        }

        if(this.header["Content-Type"] === "application/json") {

            this.bodyStr = JSON.stringify(this.body);
        }else if(this.header["Content-Type"] === "application/x-www-form-urlencoded") {

            this.bodyStr = Object.keys(this.body).map((key)=>{

                return `${key}=${this.body[key]}`;
            }).join("&");
        }

        //计算contentlength
        this.header["Content-Length"] = this.bodyStr.length;

        this.connect = net.createConnection({
            port:this.port,
            host:this.host,
        },()=>{
            console.log("connected to server!");
        });

        this.responseParser = new ResponseParser();
    }

    send(){

        return new Promise((resolve,reject)=>{

            this.connect.write(this.httpToString());

            //监听数据
            this.connect.on('data', (data) => {

                this.responseParser.receive(data.toString());

                if(this.responseParser.finished){

                    resolve(JSON.stringify(this.responseParser.response));

                    this.connect.end();
                }
                
            });

            //断开连接
            this.connect.on('end', () => {

                console.log('disconnected from server');
            });

            this.connect.on("error",(error)=>{
            
                reject(error);
            });
        });
    }

    httpToString(){

        return `${this.method} ${this.url} HTTP/1.1\r\n${Object.keys(this.header).map((key)=>{return `${key}:${this.header[key]}`}).join('\r\n')}\r\n\r\n${this.bodyStr}`;
    }
}

async function request(options){

    let request = new Request(options);
    
    response = await request.send();

    let dom = parserHTML(JSON.parse(response).data);

    let viewport = images(1000,1000);

    render(viewport,dom);
}

//开始解析
class ResponseParser {

    constructor(){

        this.waiting_status_line = 0;
        this.waiting_status_line_end = 1; //\r
        this.waiting_header_line_name = 2; //\n
        this.waiting_header_line_space = 3;
        this.waiting_header_line_value = 4;
        this.waiting_header_line_end = 5;
        this.waiting_header_block_line_end = 6;
        this.waiting_body = 7;

        this.currentStatus = this.waiting_status_line;

        this.statusLine = "";
        this.headers = {};
        this.headerName = "";
        this.headerValue = "";
        this.body = "";
    }

    get finished(){

        return this.bodyParse && this.bodyParse.finished;
    }

    get response(){

        this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([a-z|A-Z]+)+/);
        console.log(RegExp.$1);
        console.log(RegExp.$2);

        return {
            code:RegExp.$1,
            status:RegExp.$2,
            data:this.bodyParse.content.join("")
        }
    }

    receive(string){

        for(let index = 0; index < string.length ; index ++){

            this.receiveChar(string.charAt(index));
        }
    }

    receiveChar(char){
        
        //状态行数据处理
        if(this.currentStatus == this.waiting_status_line) {

            if(char === "\r") {

                this.currentStatus = this.waiting_status_line_end;
            }else if(char === '\n'){

                this.currentStatus = this.waiting_header_line_name;
            }else {

                this.statusLine += char;
            }
        }else if(this.currentStatus == this.waiting_status_line_end) {

            if(char === '\n') {

                this.currentStatus = this.waiting_header_line_name;
            }
            //状态头处理
        }else if(this.currentStatus == this.waiting_header_line_name) {

            if(char === '\r'){

                this.currentStatus = this.waiting_header_block_line_end;
            }else if(char === ":") {

                this.currentStatus = this.waiting_header_line_space;
            }else {

                this.headerName += char;
            }
        }else if(this.currentStatus == this.waiting_header_line_value){

            if(char === '\r'){

                this.currentStatus = this.waiting_header_line_end;

                this.headers[this.headerName] = this.headerValue;
            }else {

                this.headerValue += char;
            }
        }else if(this.currentStatus == this.waiting_header_line_space){

            if(char === ' ') {

                this.currentStatus = this.waiting_header_line_value;
            }
        }else if(this.currentStatus == this.waiting_header_line_end){

            if(char === '\n'){

                this.currentStatus = this.waiting_header_line_name;
                this.headerName = "";
                this.headerValue = "";
            }

            //开始处理响应体
        }else if(this.currentStatus == this.waiting_header_block_line_end) {

            this.currentStatus = this.waiting_body;

            this.bodyParse = new TrunkedBodyParse();
        }else if(this.currentStatus == this.waiting_body) {

            this.bodyParse.receiveChar(char);
        }
    }
}

//body部分进行解析  
/*
    16 \r\n
    xnksjdkfjskdfj\r\n
    0 \r\n
    \r\n \r\n
*/
class TrunkedBodyParse {

    constructor(){

        this.TRUNK_LENGTH = 0;
        this.TRUNK_LENGTH_END = 1;
        this.TRUNK_LENGTH_NEW = 2;
        this.TRUNK_LENGTHH_NEW_END = 3;
        this.TRUNK_LENGTH_CONTENT = 4;
        this.TRUNK_LENGTH_CONTENT_END = 5;
        this.length = 0;
        this.finished = false;
        this.content = [];
        this.currentStatus = this.TRUNK_LENGTH;
    }

    receiveChar(char){

        //trunk中第一行是一个16进制的数字字符，表示该trunk的长度。
        if(this.currentStatus == this.TRUNK_LENGTH){

            if(char === '\r'){

                //如果最后一个trunk的length是0，则表示已经是最后一个trunk了。
                if(this.length === 0){

                    this.finished = true;

                    this.currentStatus = this.TRUNK_LENGTH_CONTENT_END;
                }else {
                    this.finished = false;
                    this.currentStatus = this.TRUNK_LENGTH_END;
                }
            }else {

                this.length *= 16;
                this.length += parseInt(char,16);
            }
        }else if(this.currentStatus == this.TRUNK_LENGTH_END) {

            if(char == '\n'){

                this.currentStatus = this.TRUNK_LENGTH_CONTENT;
            }
        }else if(this.currentStatus == this.TRUNK_LENGTH_CONTENT) {

            this.length --;
            this.content.push(char);

            if(this.length == 700){

                console.log("jsldfjlsjdf");
            }

            if(this.length === 0) {

                this.currentStatus = this.TRUNK_LENGTH_NEW;
            }
        }else if(this.currentStatus == this.TRUNK_LENGTH_NEW) {

            if(char === '\r') {

                this.currentStatus = this.TRUNK_LENGTHH_NEW_END;
            }
        }else if(this.currentStatus == this.TRUNK_LENGTHH_NEW_END) {

            if(char === '\n') {

                this.currentStatus = this.TRUNK_LENGTH;
            }
        }
    }
}
  

//使用
request({
    method:'POST',
    url:'/',
    port:8081,
    host:'127.0.0.1',
    header:{
        ["customField"]:'xxxxxx',["name"]:"test"
    }
    ,body:{name:"liaochangping",sex:"1"}
}).then((response)=>{

});
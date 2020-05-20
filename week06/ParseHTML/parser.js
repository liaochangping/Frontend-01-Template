const cssParser = require('css');

const EOF = Symbol("EOF");

let currentToken = null;
let currentAttribute = null;
let tokens = new Array();
//方便后面直接通过document获取到整棵树
let stack = [{type:"document",childrens:[]}];

let currentStyleContent = "";

let rules = [];

function compare(currentSpecificitor,specificitor){

    if((currentSpecificitor[0] -  specificitor[0]) >= 0) {

        return true;
    }else  if((currentSpecificitor[1] -  specificitor[1]) >= 0) {

        return true;
    }else  if((currentSpecificitor[2] -  specificitor[2]) >= 0) {

        return true;
    }else  if((currentSpecificitor[3] -  specificitor[3]) >= 0) {

        return true;
    }

    return false;
}

function specificity(selector){

    let specificitor = [0,0,0,0]; 

    let selectorArr = selector.split(" ");

    for(let selector of selectorArr){

        if(selector.charAt(0) === '#'){

            specificitor[1] += 1;
        }else if(selector.charAt(0) === '.') {

            specificitor[2] += 1;
        }else if(selector.charAt(0).match(/^[a-zA-Z]$/)) {

            specificitor[3] += 1;
        }

        return specificitor;
    }
}

//css中元素匹配，并将style中的css规则写入element中stylesheet中去
function match(element,selector){

    //判断当前selector是id、class、tagname选择器
    if(selector.charAt(0) === '#') {

        //如果是id选择器，则比对属性id是否对应相等
        let attribute = element.attributes.filter((attribute)=>attribute.name == "id")[0];
        if(attribute && attribute.value == selector.replace("#","")) {

            return true;
        }else {

            return false;
        }
    }else if(selector.charAt(0) === '.') {

        //如果是class选择器，则比对属性class是否对应相等
        let attribute = element.attributes.filter((attribute)=>attribute.name == "class")[0];
        if(attribute && attribute.value == selector.replace(".","")) {

            return true;
        }else {

            return false;
        }

    }else { //暂且只考虑简单选择器，不考虑复合选择器

        if(element.tagName === selector) {

            return true;
        }else {

            return false;
        }
    }
}

function computeCss(element){

    if(rules.length <= 0) return;

    if(!element.computeStyle) {

        element.computeStyle = {};
    }

    let selectors = [];
    let currentElement = null;
    let matchSelector = false;
    for(let rule of rules){

        selectors = rule.selectors[0].split(" ").reverse();

        currentElement = element;
        matchSelector = false;
        for(let selector of selectors){

            if(match(currentElement,selector)) {

                currentElement = currentElement.parent;
                matchSelector = true;
                continue;
            }

            matchSelector = false;
            break;
        }

        //给匹配的element设置计算样式
        if(matchSelector) {

            let specificitor = specificity(rule.selectors[0]);
            
            for(let declaration of rule.declarations) {
                
                //由于css中规则的优先级，也只是针对指定的某条属性对应的css优先级规则，包括优先级高的或者顺序考后的都被覆盖
                if(!element.computeStyle[declaration.property]){

                    element.computeStyle[declaration.property] = {};
                }

                //根据css的specificity来进行css属性的覆盖
                if(!element.computeStyle[declaration.property].specificitor) {

                    element.computeStyle[declaration.property].value = declaration.value;
                    element.computeStyle[declaration.property].specificitor = specificitor;
                }else if(compare(specificitor,element.computeStyle[declaration.property].specificitor)){

                    element.computeStyle[declaration.property].value = declaration.value;
                    element.computeStyle[declaration.property].specificitor = specificitor;
                }
            }
            break;
        }
    }
}

//css规则处理,使用css库对css进行解析
function addRules(rule){

    let cssObj = cssParser.parse(rule);

    //由于在cssobj中我们需要的也只是rules，所以保存所有的rules即可
    rules.push(...cssObj.stylesheet.rules);
}

//开始构建抽象语法树
function emit(token){

    let top = stack[stack.length - 1];

    let element = null;
    if(token.type === 'startTag'){

        element = {type:'element',childrens:[],attributes:[]};
        element.tagName = token.tagName;

        for(let key in token){

            if(key != 'type' && key != 'tagName' && key != 'selfClosingFlag') {

                element.attributes.push({
                    name:key,
                    value:token[key]
                })
            }
        }

        if(!token.selfClosingFlag) {
            stack.push(element);
        }

        top.childrens.push(element);
        element.parent = top;


        //开始对元素进行css匹配，css样式合并
        computeCss(element);

    }else if(token.type === 'endTag'){

        if(top.tagName != token.tagName) {

            console.log("error");
        }else {

            //开始收集style中的rules
            if(token.tagName === 'style') {
                
                addRules(currentStyleContent);
            }

            stack.pop();
        }
    }else if(token.type === 'text'){
         
        if(top.tagName === 'style') {

            currentStyleContent += token.value;
        }
    }

    // //快速获取整颗树
    // if(stack.length == 1)
    //     console.log(stack[0].childrens);
}

function data(char){

    if(char === EOF) {

        emit({type:'eof'});
        return;
    }else if(char.match(/^[\t\f\s\n]$/)){
        
        return data;
    }else if(char == '<') {

        return tagOpen;
    }else {

        return textData(char);
    }
}

function textData(char){

    if(char === '<') {

        return data(char);
    }else {

        //文本token
        emit({
            type:'text',
            value:char,
        });

        return textData;
    }
}

function tagOpen(char){

    //如果是！，说明当前是一个注解<!-- --!> 或者<!DOCTYPE html> 或者<![CDATA[]]>
    if(char === '!') {
          
    }else if(char === '/') { //结束标签

        return tagEnd;
    }else if(char === EOF) {

    }else if(char.match(/^[a-zA-Z]$/)){
        
        //如果是字符，则是tagname
        currentToken = {
            type:"startTag",
            tagName:""
        }

        return tagName(char);
    }else {


    }
}

function tagEnd(char){

    if(char === '>') {
        return data;
    }else if(char === EOF){
    }else if(char.match(/^[a-zA-Z]$/)) {

        currentToken = {
            type:'endTag',
            tagName:''
        }

        return tagName(char);
    }
}

function tagName(char){

    //如果字符是空格或者换行\n，则查看属性
    if(char.match(/^[\t\f\s\n]$/)) {

        return beforeAttributeName;
    }else if(char === '/') //自结束标签
    {
        return selfClosingStartTag;
    }else if(char === '>') {

        emit(currentToken);

        return data;
    }else if(char.match(/^[a-zA-Z]$/)) { //开始进行tagname的收集操作

        currentToken.tagName  += char;

        return tagName;
    }else if(char === EOF){

        emit({
            type:'EOF'
        })
    }
}

function beforeAttributeName(char){

    if(char.match(/^[\t\f\s\n]$/)) {

        return beforeAttributeName;
    }else if(char === '/' || char === '>' || char === EOF) {

        return afterAttributeName(char);
    }else if(char === "=") { //很少间 ="xxxx",则parse会将"=""xxxx"作为属性名，属性值为空
        
        currentAttribute = {
            attributeName:char,
            attributeValue:''
        }

        return attributeName;
    }else {

        currentAttribute = {
            attributeName:'',
            attributeValue:''
        }

        return attributeName(char);
    }
}

function attributeName(char){

    if(char.match(/^[\t\f\s\n\\>]$/) || char === EOF) {

       return afterAttributeName(char);
    }else if(char === '=') { //开始设置属性值

        return beforeAttributeValue;
    }else {

        currentAttribute.attributeName += char;

        return attributeName;
    }
}

function afterAttributeName(char){

    if(char.match(/^[\t\f\s\n]$/)) {

        return afterAttributeName;
    }else if(char === '/') {

        return selfClosingStartTag;
    }else if(char === '='){

        return beforeAttributeValue;
    }else if(char === '>') {

        emit(currentToken);

        return data;
    }
}

function beforeAttributeValue(char){
    
    if(char.match(/^[\t\f\n\s]$/)) {

        return beforeAttributeValue;
    }else if(char === "\"") {

        return doubleQuotedAttributeValue;
    }else if(char === "\'") {

        return singleQuotedAttributeValue;
    }else if(char === '>') {

        emit(currentToken);

        return data;
    }else {
        return unQuotedAttributeValue(char);
    }
}

function doubleQuotedAttributeValue(char){

    if(char === "\"") { 

        return afterDoubleQuotedAttributeValue;
    }else if(char === EOF) {

        emit({
            type:'EOF',
        });
        return;
    }else {

        currentAttribute.attributeValue += char;

        return doubleQuotedAttributeValue;
    }
}

function afterDoubleQuotedAttributeValue(char){

    if(char.match(/^[\t\f\s\n]$/)) {

        return beforeAttributeName;
    }else if(char === '/') {

        return selfClosingStartTag;
    }else if(char === '>') {

        currentToken[currentAttribute.attributeName] = currentAttribute.attributeValue;

        emit(currentToken);

        return data;
    }else if(char === EOF) {

        emit({type:'eof'});
        return;
    }
}

function singleQuotedAttributeValue(char){

    if(char === '\'') {

        return afterSingleQuotedAttributeValue;
    }else if(char === EOF) {

        emit({type:'eof'});
        return;
    }else {

        currentAttribute.attributeValue += char;

        return singleQuotedAttributeValue;
    }
}

function afterSingleQuotedAttributeValue(char){

    if(char.match(/^[\t\f\s\n]$/)) {

        return beforeAttributeName;
    }else if(char === '/') {

        return selfClosingStartTag;
    }else if(char === '>') {

        currentToken[currentAttribute.attributeName] = currentAttribute.attributeValue;

        emit(currentToken);

        return data;
    }else if(char === EOF) {

        emit({type:'eof'});
        return;
    }
}

function unQuotedAttributeValue(char){

    if(char.match(/^[\t\f\s\n]$/)) {

        return beforeAttributeName;
    }else if(char === '>') {

        currentToken[currentAttribute.attributeName] = currentAttribute.attributeValue;

        emit(currentToken);

        return data;
    }else {

        currentAttribute.attributeValue += char;

        return unQuotedAttributeValue;
    }
}

function selfClosingStartTag(char){

    if(char === '>') {

        currentToken["selfClosingFlag"] = true;
        currentToken[currentAttribute.attributeName] = currentAttribute.attributeValue;

        emit(currentToken);

        return data;
    }else if(char === EOF) {

        emit({type:"eof"});
        return;
    }
}

module.exports = function parserHTML(html){

    let state = data;

    for(char of html){

        state = state(char);
    }

    //当解析完成了html字符串后，最后将状态机入参数设置为文件结束标记，用于停止当前的状态机处理。
    state = state(EOF);
}
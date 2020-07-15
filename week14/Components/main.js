import "./fool"

function create(Cls, attributes, ...childrens){

    let object;
    
    //如果不是组件，而是以小写开头的字符串，则直接用Wrapper包裹起来，构成html中tag元素
    if(typeof Cls === 'string'){

        object = new Wrapper(Cls);
    }else { //否则直接使用组件

        object = new Cls()
    }

    for (let key in attributes) {
        // object[key] = attributes[key];
        object.setAttribute(key,attributes[key]);
    }

    //协议children的包含方式
    for(let child of childrens){

        //如果child非html标签或者组件，则需要构建字符串节点TextNode，用于显示
        if(typeof child === 'string' || typeof child === 'number' || typeof child === 'bool') {
            child = new Text(child);
        }

        object.appendChild(child);
    }

    return object;
}

//构建字符串标签
class Text {

    constructor(value){

        //直接构建字符串节点
        this.root = document.createTextNode(value);
    }
    
    //由于文本节点不存在子元素和设置属性相关操作，所以只存在挂载的操作
    componentMountTo(parent){

        //直接将node元素添加到父元素中
        parent.appendChild(this.root);
    }
}

//包装具体的html元素标签
class Wrapper {

    constructor(type){
        this.childrens = [];

        //直接构建对应字符串的类型对象
        this.root = document.createElement(type)
    }

    set class(value){

        console.log("parent:class",value);
    }

    setAttribute(key, value){

        // console.log("parent:attribute",key,value);
        this.root.setAttribute(key,value);
    }

    appendChild(child){
        this.childrens.push(child);
    }

    componentMountTo(parent){

        //直接将node元素添加到父元素中
        parent.appendChild(this.root);

        //将申明式中的子元素挂载到当前节点上
        for(let child of this.childrens){
            child.componentMountTo(this.root);
        }
    }
}

class Component {

    constructor(props){
        this.childrens = [];
        this.attributes = {};
    }

    // set class(value){

    //     console.log("parent:class",value);
    // }

    // setAttribute(key, value){

    //     // console.log("parent:attribute",key,value);
    //     this.attributes[key] = value;
    // }

    appendChild(child){
        this.childrens.push(child);
    }
    
    render(){

        return <div>
            <h1>xxxxxxxx</h1>
            {this.slot}
        </div>
    }

    componentMountTo(parent){

        this.slot = <div></div>
        for(let child of this.childrens){
            this.slot.appendChild(child)
        }
        this.render().componentMountTo(parent)
    }
}

// let component = <Component id="a" class="cls" style="display:inline-block;width:100px;height:100px;background-color:red;">
//     <Component style="display:inline-block;width:10px;height:50px;background-color:blue;"/>
//     <Component style="display:inline-block;width:30px;height:10px;background-color:green;"/>
// </Component>

let component = <span>{<Component><div><span>jsda;fj;asjdf;ajsdf</span></div></Component>}</span>

// component.class = "teste";

component.componentMountTo(document.body);

// var component = create(Parent, {
//     id: "a",
//     "class": "cls",
//     style: "width:100px"
//   }, create(Child, null), create(Child, null));

console.log(component);
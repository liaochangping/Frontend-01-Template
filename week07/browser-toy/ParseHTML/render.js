const images = require('images');

function render(viewport,element){

    //必须有style属性，否则不进行绘制
    if(element.style){

        let img = images(element.style.width,element.style.height);

        if(element.style.backgroundColor) {

            let backgroundColor = element.style.backgroundColor;
            backgroundColor.match(/rgb\((\d+),(\d+),(\d+)\)/);
            img.fill(Number(RegExp.$1),Number(RegExp.$2),Number(RegExp.$3),1);
            viewport.draw(img,element.style.left||0,element.style.top||0);
        }

        //递归调用render来渲染子元素
        if(element.childrens){

            for(let child of element.childrens){

                render(viewport,child);
            }
        }
    }
};
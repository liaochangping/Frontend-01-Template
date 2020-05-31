
function getStyle(element) {

    if(!element.style)
    {
        element.style = {};
    }

    //开始移动
    for (const prop in element.computeStyle) {
        
        //之前为什么要写成element.computeStyle[prop].value这种形式，因为为了实现css优先级处理.
        element.style[prop] = element.computeStyle[prop].value;

        //特殊处理,一般情况下，对于rem、em、vv等都是最终转化为像素
        if(element.style[prop].match(/px$/)) {

            element.style[prop] = parseInt(element.style[prop]);
        } //匹配rem，比如1.2
        if(element.style[prop].toString().match(/[0-9\.]+/)) {

            element.style[prop] = parseInt(element.style[prop]);
        }
    }

    return element.style;
}

module.exports = function layout(element){

    //1.将element的computerStyle中元素移到element的style中去。
   let elementStyle = getStyle(element);

   //此处暂时只考虑flex布局
   if(elementStyle['display'] !== 'flex') {
       return;
   }
   
   //2.初始化基于flex布局的相关参数
   //2.1 flex是基于容器的剩余空间进行排版的，所以我们需要计算好width、height
   ["width","height"].forEach((item,index)=>{
       if(elementStyle[item] === 'auto' || elementStyle[item] === '') elementStyle[item] = null;
   });

   //2.2 设置基于flex属性的初始值
   if(!elementStyle.flexDirection || elementStyle.flexDirection === 'auto') elementStyle.flexDirection = 'row';
   if(!elementStyle.justifyContent || elementStyle.justifyContent === 'auto') elementStyle.justifyContent = 'flex-start';
   if(!elementStyle.alignItems || elementStyle.alignItems === 'auto') elementStyle.alignItems = 'stretch';
   if(!elementStyle.flexWrap || elementStyle.flexWrap === 'auto') elementStyle.flexWrap = 'nowrap';

   //2.3 计算主轴和交叉轴
   let mainSize, mainStart, mainEnd, mainSign, mainBase, //主轴
   crossSize, crossStart, crossEnd, crossSign, crossBase; //交叉轴

   if(elementStyle.flexDirection === 'row') {

        mainSize = 'width';
        mainStart = 'left';
        mainEnd = 'right';
        mainSign = 1;
        mainBase = 0;

        crossSize = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
   }else if(elementStyle.flexDirection === 'row-reverse') {

        mainSize = 'width';
        mainStart = 'right';
        mainEnd = 'left';
        mainSign = -1;
        mainBase = elementStyle.width;

        crossSign = 'height';
        crossStart = 'top';
        crossEnd = 'bottom';
   }else if(elementStyle.flexDirection === 'column') {

        mainSize = 'height';
        mainStart = 'top';
        mainEnd = 'bottom';
        mainSign = 1;
        mainBase = elementStyle.width;

        crossSign = 'width';
        crossStart = 'left';
        crossEnd = 'right';
   }else if(elementStyle.flexDirection === 'column-reverse') {

        mainSize = 'height';
        mainStart = 'bottom';
        mainEnd = 'top';
        mainSign = -1;
        mainBase = elementStyle.width;

        crossSign = 'width';
        crossStart = 'left';
        crossEnd = 'right';
   }
    
   //2.4 基于flexWrap默认的nowrap，则mainSize、mainStart、mainEnd、mainSign、mainBase都不会发生变化，但是基于wrap-reverse则会发生基础变量的变化
   if(elementStyle.flexWrap === 'wrap-reverse') {

       let tmp = crossStart;
       crossStart = crossEnd;
       crossEnd = tmp;
       crossSign = -1;
       crossBase = crossSize;
   }else {

       crossSign = 1;
       crossBase = 0;
   }

   //3.计算主轴和交叉轴的剩余宽度和高度。对于交叉轴，如果是一行，则选择最高的那个元素的高作为crossSize。对于主轴，需要计算出剩余的宽度。
   //3.1 获取flex容器中非文本元素
   let items = element.childrens.filter(item=>item.style === 'element');

   //3.2 判断是否自动排版,如果是，则计算容器中element的mainSize之和。而对于那些没有mainSize的元素，则会被缩的很小，基本上看不出来了。
   let isAutoMainSize = false; //针对交叉轴计算有作用
   if(!elementStyle[mainSize]) //如果容器没有固定的宽度，则进行自auto sizing
   {
        elementStyle[mainSize] = 0;
        let itemStyle = null;
        for(let child of items){

            itemStyle = getStyle(child);
            if(itemStyle[mainSize] !== null && itemStyle[mainSize] !== (void 0)) {

                elementStyle[mainSize] += itemStyle[mainSize];
            }
        }
        isAutoMainSize = true;
   }

   //3.3 根据是否换行，计算每一行的elemment，并将element加入对应行的数组中。最后将该行主轴上的剩余空间和交叉轴上的空间保存在flexLine中。
   let flexLine = [];
   let flexLines = [flexLine];

   let itemStyle = null;
   let mainSpace = elementStyle[mainSize];
   let crossSpace = 0;
   for(let child of items){
      
       itemStyle = getStyle(child);
       //判断child是否存在mainSize属性，如果不存在，则默认看不见。即mainSize = 0，用于统一处理
       if(!itemStyle[mainSize]) {
           itemStyle[mainSize] = 0;
       }

       //如果child设置了flex属性，则是根据容器的剩余空间来计算宽度和间隔。将该元素加入数组
       if(itemStyle[flex]) { //对于设置了flex的元素，无论换行还是不换行，都是在剩余空间中进行相对应的flex对应处理，所以碰到flex元素，则不用考虑换行与否，直接加入数组

            flexLine.push(child);
            //对于非flex元素，则默认是有mainSize的，所以在flex布局中，我们需要使用mainSize减去这些元素的mainszie获取到剩余空间来给flex元素进行适应布局。对于非flex元素，则要考虑是否换行和不换行
            //对于不换行的，则直接加入一个数组即可，不需要多个数组，同时求出剩余空间，以备flex元素进行自动布局。
       }else if(elementStyle.flexWrap === 'nowrap') { //为什么一定要是autoMainSize呢？ 若剩余空间为负数，则所有flex元素为0，等比压缩剩余元素

            mainSpace -= itemStyle[mainSize];

            //根据元素的交叉轴上的大小与当前的crossspace比较获取最大值
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {

                crossSpace = Math.max(itemStyle[crossSize],crossSpace);
            }

            flexLine.push(child);
       }else {

            if(itemStyle[mainSize] > elementStyle[mainSize]) itemStyle[mainSize] = elementStyle[mainSize];

            //如果剩余空间小于某个元素的mainSize的情况下，则要考虑换行了。
            if(mainSpace < itemStyle[mainSize]) {

                flexLine.mainSpace = mainSpace;
                flexLine.crossSpace = crossSpace;

                flexLine = [];
                flexLines.push(flexLine);

                flexLine.push(child);

                mainSpace = elementStyle[mainSize];
                crossSpace = 0;
            }else {

                flexLine.push(child);
            }

            mainSpace -= itemStyle[mainSize];
            if(itemStyle[crossSize] !== null && itemStyle[crossSize] !== (void 0)) {
                crossSpace = Math.max(itemStyle[crossSize],crossSpace);
            }
       }
   }
   //对于最后一行进行设置
   flexLine.mainSpace = mainSpace;

   //4. 计算交叉轴
   //4.1 计算最后一行交叉轴的高度
   //如果不换行，或者主轴是通过子序列动态获取宽度
   if(elementStyle.flexWrap === 'nowrap' || isAutoMainSize) {

        if(elementStyle.crossSize !== null && elementStyle.crossSize !== (void 0)) {

            flexLine.crossSpace = elementStyle.crossSize;
        }else {

            flexLine.crossSpace = crossSpace;
        }
   }else {
    
       flexLine.crossSize = crossSpace;
   }

   //4.2 计算每一行中元素的排布
   if(mainSpace < 0) //如果mainSpace为负数，则表示只有一行，否则比如mainSpace=0或者mainSpace为正数，则可能为一行或者多行，我们统一在下一个逻辑块中处理。
   {
       let scale = elementStyle[mainSize] / (elementStyle[mainSize] - mainSpace); //小数
       
       let itemStyle = {};
       let currentStart = mainBase; //0或者mainSize
       for(let item of items){

            itemStyle = getStyle(item);

            //对于flex元素，在单行中，且mainSpace为负数，则flex元素mainSize为0，仅仅对非flex元素进行等比缩放
            if(itemStyle.flex) {
                
                item[mainSize] = 0;
            }
            
            //开始对元素等比缩放
            item[mainSize] = item[mainSize] * scale;
            item[mainStart] = currentStart;
            item[mainEnd] = currentStart + item[mainSize] * mainSign; //计算结束位置
            currentStart = item[mainEnd]; //重置开始位置，为下一个元素做准备.
       }
   }else {
       
       let itemStyle = {};
       let mainSpace = 0;
       let totalFlexCount = 0;
       for(let line of flexLines) {

           //计算一行中flex元素的总数
           for(let item of line){

               itemStyle = getStyle(item);

               if(itemStyle.flex) {
                   totalFlexCount += 1;
               }
           }

           //开始计算每一行中元素的位置\
           mainSpace = line.mainSpace;
           currentStart = mainBase;
           if(totalFlexCount > 0) //如果有flex元素，则计算出剩余空间后，再统一等比处理flex元素沾满剩余空间 
           {
               for(let item of line){

                    itemStyle = getStyle(item);

                    if(itemStyle.flex) {
                        item[mainSize] = (mainSpace / totalFlexCount) * itemStyle.flex; //flex值 * 均分值。
                    }

                    item[mainStart] = currentStart;
                    item[mainEnd] = item[mainSize]*elementStyle.mainSign + item[mainStart];
                    currentStart = item[mainEnd];
               }
           }else { //如果没有flex元素，则需要根据justifyContent来排布非flex元素的位置

            let step = 0;

            if(elementStyle["justify-content"] === "flex-start") {
                         
                currentStart = mainBase;
                step = 0;
            }else if(elementStyle["justify-content"] === "flex-end") {

                currentStart = mainBase + mainSpace * mainSign;
                step = 0;
            }else if(elementStyle["justify-content"] === "center") {

                currentStart = mainSpace / 2 * mainSign + mainBase;
                step = 0;
            }else if(elementStyle["justify-content"] === "space-around"){

                step = mainSpace / line.length * mainSign;
                currentStart = step / 2 + mainBase;
            }else if(elementStyle["justify-content"] === "space-between") {

                step = mainSpace / (line.length - 1) * mainSign;
                currentStart = mainBase;
            }else {
                
                step = mainSpace / (line.length+1) * mainSign;
                currentStart = mainBase + step;
            }

            for(let item of line){

                item[mainStart] = currentStart;
                item[mainEnd] = item[mainSize] * mainSize + item[mainStart];
                currentStart = item[mainEnd] + step;
            }
           }
       }
   }

   //4.3 计算交叉轴元素
   //4.3.1 计算交叉轴的剩余空间
   let corseSpace = 0;
   if(!elementStyle[crossSize]) //如果没有设置crossSize，则计算
   {
       crossSpace = 0;
       elementStyle[crossSize] = 0;
       for(let line of flexLines){
           elementStyle[crossSize] = elementStyle[crossSize] + line.crossSize;
       }
   }else {
       crossSpace = elementStyle[crossSize];
       for(let line of flexLines){
           crossSpace -= line.crossSpace;
       }
   }

   if(elementStyle.flexWrap === 'wrap-reverse'){

       crossBase = elementStyle.crossSize;
   }else {
       crossBase = 0;
   }

   let step = 0;
   //alignContent是针对整体的对其调整，比如有3行，则3行这个整体进行统一的对齐调整
   if(elementStyle.alignContent === 'flex-start') {
       crossBase = 0;
       step = 0;
   }else if(elementStyle.alignContent === 'flex-end'){
       crossBase = crossSign * crossSpace;
       step = 0;
   }else if(elementStyle.alignContent === 'center'){
       crossBase = crossSpace / 2;
       step = 0; 
   }else if(elementStyle.alignContent === 'space-between') {
       crossBase = 0;
       step = crossSpace / flexLines.length - 1;
   }else if(elementStyle.alignContent === 'space-around'){
       step = crossSpace / flexLines.length;
       crossBase = step / 2;
   }else if(elementStyle.alignContent === 'stretch'){
       crossBase = 0;
       step = 0;   
   }

   for(let line of flexLines){

        //计算出交叉轴每一行的高度
        var lineCrossSize = elementStyle.alignContent === 'stretch' ? line.crossSpace + crossSpace / flexLines.length : line.crossSpace;
        
        for(let item of line){

            let align = item.alignSelf || elementStyle.alignItems; //alignSelf是针对单个元素在某一行中的对齐方式，alignItems是针对某一行中的所有元素进行对齐处理
            if(item[crossSize] === null || item[crossSize] === (void 0)) {

                if(align === 'stretch') item[crossSize] = lineCrossSize;
                else item[crossSize] = 0;
            }

            if(align === 'flex-start') {

                item[crossStart] = crossBase;
                item[crossEnd] = item[crossStart] + item[crossSize];
            }else if(align === 'flex-end'){

                item[crossEnd] = crossBase + crossSign * lineCrossSize;
                item[crossStart] = item[crossEnd] - crossSign * item[crossSize];
            }else if(align === 'center') {

                item[crossStart] = crossBase + crossSign * (lineCrossSize - item[crossSize])/2;
                item[crossEnd] = item[crossStart] + crossSign * item[crossSize];
            }else if(align === 'stretch'){

                item[crossStart] = crossBase;
                item[crossEnd] = item[crossStart] + crossSign * ((item[crossSize] !== null && item[crossSize] !== (void 0)) ? item[crossSize] : lineCrossSize);
            }
        }
        crossBase += crossSign * (lineCrossSize + step);
   }
};

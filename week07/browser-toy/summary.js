//http是一个文本格式的协议
//1. 要保证一个http的正常发送和接收，必须在tcp层在发送的时候，封装好一个http格式的内容，然后通过tcp来进行发送。

/*
     Method Path HTTP/Version \r\n-----请求行，包括方法、路径、http版本
     
     Content-Type:type\r\n            请求头，至少包括body中的内容类型、内容的长度
     Content-Length:xxx\r\n\r\n

     body                             body中的内容

*/

//2. tcp层接收数据，接收到的也是包含了整个http格式的数据，我们要提供到应用层对应的body数据，则需要对http格式进行拆解，返回对应的body中的数据即可。

/*
    HTTP/Version code status \r\n -----响应行，包括服务器支持的方法、code码、具体的code代表的意思

    Content-Type:'' \r\n\r\n -------响应头  ，服务器中返回的body的类型


    body ---响应体
*/

//3. 在组装字符串的时候，可以使用模版 `${}xxxxxx${}`，模版里面还可以嵌套模版。注意：模版主要是固定样式输出。
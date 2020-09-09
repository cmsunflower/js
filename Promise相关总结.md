Promise出现的目的是什么？
Promise是一个对象，用来解决回调地狱的问题
Promise是什么？
Promise时一个对象，表示异步操作结果最终时成功还是失败。
特点：
1. Promise有三种状态，Pending、Fullfilled、Rejected；其中pending表示初始状态，既不成功也不失败，fullfilled表示成功，rejected表示失败
2. 状态一旦改变不可逆
写法：

```js
new Promise(function(resolve,reject){
	// 
})
```
注：

 - 其中function(resolve,reject){}是一个执行器
 - 当Promise执行的时候会执行执行其中的内容。
 - 执行器有两个参数，resovle,reject两个函数再状态发生改变的时候执行
 - 当状态由Pending变为成功（Fullfilled）,执行resolve函数，可以传递参数；当状态是Rejected的时候，执行reject函数；如果状态时rejected的时候，抛出一个错误，自执行函数的返回值会被忽略

3.Promise可以链式调用,返回一个Promise

Promise相关的方法，也就是API？
**Promise.prototype.then()：**
是什么？
返回一个新的Promise,用于链式调用；
怎么用？
1. 最多有两个参数
Promise.prototype.then(successCallback[,failCallback])
其中failCallback是可选的
Promise.prototype.then(null,failCallback)与Promise.catch()一样，都是捕获失败的Promise
2. 返回值，返回值（成功）、无返回值（成功，undefined作为参数）、成功、失败、错误（失败）、pending状态

**Promise.prototype.catch()**
是什么？
返回新的Promise,用来处理Promise状态时Rejected（处理拒绝的状态）；
特点：
1. 异步中的抛出的错误不会被catch捕获
2. resolve()后抛出的错误会被忽略（resolve之后，就说明Promise状态变为成功，状态不可逆，那么后面再抛出错误就会报错）
3. 抛出一个错误，返回一个Promise,后续再有新的操作，也是会执行的(捕获错误之后，Promise的状态时Fulfilled的)
4. 遇到异常Promise，就找reject回调函数或者Catch进行错误捕获

```js
let p1=new Promise((resolve, reject) => {
        resolve();
        console.log('初始化');
})
.then(() => {
    throw new Error('有哪里不对了');
        
    console.log('执行「这个」”');
});
// 说明此处的p2状态最终是Fulfilled,错误捕获成功，变为成功状态，可以调用后面的内容
let p2=p1.catch(() => {
    console.log('执行「那个」');
})
p2.then(() => {
    console.log('执行「这个」，无论前面发生了什么');
});
```
**Promise.all()**
是什么？

- 返回一个Promise实例，如果有一个失败，返回一个rejected状态的Promise;
- 如果全部成功(包含Promise的状态都为成功、不是Promise的状态)，才返回一个Fulfilled状态的Promise

用途：
并行执行多个异步任务
Promise.all([func1,func2,func3]).then([res1,res2,res3]=>{执行函数})

串行调用，也就是链式调用

```js
var func1 = new Promise(() => setTimeout(() => console.log(1), 400));
var func2 = new Promise(() => setTimeout(() => console.log(2), 700));
var func3=new Promise(()=>setTimeout(()=>console.log(3),100));
var funcs=[func1,func2,func3]

function composeAsync(funcs){
    return function(x){
        let res=funcs.reduce((acc,val)=>acc.then(val),Promise.resolve());
        return res;
    }
}
composeAsync(funcs)();
```

特点：
1. 如果有失败的，返回第一个Promise失败reject的结果
2. 如果成功，返回的参数是按照放进来的顺序，返回；与执行完的顺序无关
3. Promise.all()参数是一个空对象的时候，Promise.all是同步的

**Promise.allSettled()**
是什么？
所有给定的Promise都已经是fulfilled或者rejected后的promise，并带有一个对象数组，每个对像表示对应的promise结果。
特点:
1. 彼此之间不依赖
2. 参数是可迭代的对象，数组

**Promise.race()：**
是什么？
返回一个Promise对象，一旦第一个Promise是成功或失败，返回的Promise就是成功或失败的

特点：
1. 状态和第一个Promise的状态有关，

Promise.prototype.resolve()
Promise.prototype.reject()

**Promise.all怎么实现**

```js
function doPromiseAll(promises){
    if(!Array.isArray(promises)){
        throw new TypeError(`${promises} is not Array`);
    }
    let result=[];
    let count=0;
   new Promise((resolve,reject)=>{
        promises.forEach((promise,idx)=>{
            promise.then(res=>{
                result[idx]=res;
                count++;
                count==promises.length&&resolve(result);
            },err=>{
                reject(err);
            })
        })
    })
}
```

**Promise.race()与Promise.all()之间的区别**
1. Promise.race()两者都返回一个Promise实例对象，可以链式调用
2. 主要的区别在于：Promise.all()只有当所有的resolved，才能得到一个成功的Promise;其中有一个失败，立即返回rejected状态的Promise;Promise.race()看第一个执行完毕的状态
3. Promise.all()返回值按照参数的顺序排列，与执行完成的顺序无关；Promise.race()返回值和最先执行完成的有关；

**用Promise实现AJAX**
参考连接：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise
```js
function doAjax(url){
    return new Promise((resolve,reject)=>{
        let xhr=new XMLHttpRequest();
        xhr.open('GET',URL);
        xhr.onreadystatechange=function(){
            try{
                if (xhr.readyState === 4 &&(xhr.status >= 200 && xhr.status < 300 ||xhr.status == 304)){
                    resolve(xhr.responseText);
                }
            }catch{
                reject(err);
            }
        }
        xhr.onerror=()=>reject(xhr.statusText);
        xhr.send();
    })
}
```

**sleep函数实现**

```js
function sleep(t){
    return new Promise(resolve=>{
        setTimeout(()=>{
            resolve();
        },t)
    })
}
sleep(1000).then(()=>{
    console.log('333');
})
```

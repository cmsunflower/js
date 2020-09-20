function add(){
    let args=[].slice.call(arguments);
    let ans=0;
    let sum=function(){
        let doArgs=[].slice.call(arguments);
        args=args.concat(doArgs);
        ans=args.reduce((prev,cur)=>prev+cur);
        return sum;
    }
    sum.toString=function(){
        return ans;
    }
    return sum;
}
// 测试
add(1)(2)(3)(4);
function add2(){
// 最后没有参数传入的时候 打印结果
    let args=[].slice.call(arguments);
    let ans=0;
    let sum=function(){
        let doArgs=[].slice.call(arguments);
        if(doArgs.length===0){
            console.log(ans);
            return;
        }else{
            args=args.concat(doArgs);
            ans=args.reduce((prev,cur)=>prev+cur);
            return sum;
        }
    }
    return sum;
}
// 测试
add2(2)(1)(3)();

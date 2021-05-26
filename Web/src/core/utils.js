export function copyFn(obj){
    if (obj == null) { return null } 
    var result = Array.isArray(obj) ? [] : {}; 
    for (let key in obj) { 
        if (obj.hasOwnProperty(key)) { 
            if (typeof obj[key] === 'object') { 
            result[key] = copyFn(obj[key]); // 如果是对象，再次调用该方法自身 
            } else { 
            result[key] = obj[key]; 
            } 
        } 
    } 
    return result;
}  
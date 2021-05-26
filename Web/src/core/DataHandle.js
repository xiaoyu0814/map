


function DataHandle(){

}
DataHandle.prototype={
	/**
     * getData
     * <p>根据所传参数设置url地址。</p>
     * @method getData
     * @param{string} url
     * @param{function} fn
     */
    getData:function(url,fn){
    	var xhr = new XMLHttpRequest();         
	    xhr.open("GET",url, true);
	    xhr.onload = function () {
	        if (xhr.status == 200 ) {
	            var result = JSON.parse(xhr.response)
	            if (result.length === 0) {
	                console.log('数据读取失败');
	                return false;
	            }
	            fn(result);
	        
	        } else {
	            // reject(xhr.statusText);
	        }
	    };
	    xhr.onerror = function () {
	        // reject(xhr.statusText);
	    };
	    xhr.send(null);
    }
}
export {DataHandle}
// var body = document.getElementsByTagName("body")
// console.log(document.body)
$(document).ready(function () {
  $("body").append("<button class='showCode'>showCode</button>");
  $("body").append("<code><textarea name='' id='codebox' cols='30' rows='10'></textarea></code>");
  $("#codebox").css({
    "width": "50%",
    "position": "absolute",
    "right": "0",
    "z-index": "100",
    "top": "0px",
    "bottom": "0px",
    "height":"100%",
    "display": "none"
  });

  $(".showCode").css({
    "position": "fixed",
    "right": "20px",
    "bottom": "20px",
    "background": "#555",
    "padding": "8px",
    "cursor": "pointer",
    "outline": "none",
    "border": "none",
    "color": "white",
    "z-index": "9999",
    "opacity": "0.7",
    "width": "98px"
  });
  $(".showCode").hover(
    function () {
      $(this).css("opacity", "1");
    },
    function () {
      $(this).css("opacity", "0.7");
    }
  );
  $(".showCode").on("click", function () {
    
    var callback = function(data){
      data = data.replace('<script src="js/lib/gethtml.js"></script>', '');
      $("#codebox").text(data);
      $("#codebox").toggle("show");
      if($("#codebox").css("width") < "50%"){
        $(".showCode").text("hideCode");
      }else{
        $(".showCode").text("showCode");
      }
    }
    getData(callback);
  });

  function getData(callback) {
    // return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      //xhr.open("GET","http://"+url, true);
      let url = window.location.pathname;
      xhr.open("GET", url, true);
      xhr.onload = function () {
        if (xhr.status == 200) {
          var result = xhr.response;
          if (result.length === 0) {
            var temp = null;
            // resolve(temp);
            return false;
          }
          callback(result);
        } else {
          // reject(xhr.statusText);
        }
      };
      xhr.onerror = function () {
        // reject(xhr.statusText);
      };
      xhr.send(null);
    // })
  };
});


// var button = document.createElement("button")
// button.id = "showCode"
// button.style.right = "-15px";
// button.style.bottom = "10px";
// button.style.position = "absolute";
// button.style.width = "600px";
// button.style.zIndex = 99999;
// button.style.backgtound = "#888";
// button.style.padding = "12px 15px";
// button.style.cursor = "pointer";
// button.style.outline = "none";
// button.style.border = "1px solid";
// button.style.boxShadow = "3px 3px 10px #000";
// button.style.color = "white";
// button.onclick = function(){
//   getData().then((data)=>{
//     if(document.getElementById('codebox')){
//       let idObject = document.getElementById('codebox')
//       idObject.parentNode.removeChild(idObject);
//     }
//     var codebox = document.createElement("div");
//     codebox.id = "codebox";
//     codebox.style.position = "absolute";
//     codebox.style.position = "absolute";
//     codebox.style.position = "absolute";
//     codebox.style.position = "absolute";
//     codebox.style.position = "absolute";
//     codebox.style.position = "absolute";
//     codebox.style.position = "absolute";
//     codebox.style.position = "absolute";
//     codebox.style.position = "absolute";
//     codebox.innerHTML = data;
//     document.appendChild(codebox);
//   });
// }
// console.log(body)
// document.appendChild(button);
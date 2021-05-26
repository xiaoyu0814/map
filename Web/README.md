PIE.js
========

#### JavaScript  ####


### Usage ###


```html
<script src="js/PIE.js"></script>
```
需要一个div，这里命名为map。
```javascript
    var point = new PIE.Point(10,10);

	var map = new PIE.Map({
	    baseMap:""
    });
	var view = new PIE.MapView({
        map:map,
        container:"map",
        zoom:1,
        center:[110,0]
    });

	var linePath = [[[10,10],[20,20],[20,10]],[[0,2],[2,4],[4,10]]];
	var line = new PIE.Line(linePath);

    var polygonPath=[[[0,10],[10,10],[20,30],[10,20],[0,30],[0,10]],[[2,2],[5,5],[2,5],[2,2]]];
    var polygon = new PIE.Polygon(polygonPath);


    //添加矢量瓦片图层
    var test  = new PIE.VectorTileLayer({
        url:"http://service.piesat.cn:10002/styles/basic.json"
    });
    map.add(test);
    var testFill = new PIE.MetoStyle.LineLayer({data:"data/worldPolyGon.geojson",width:2})
    map.on("load",function () {


        var Grap = new PIE.Graphics({
            geometry:polygon,
            symbol:new PIE.FillSymbol({color:"#00ff00"})
        });

        var pointGrap = new PIE.Graphics({
            geometry:point,
            symbol:new PIE.MarketSymbol({color:"#00ff00",size:5})
        });
        var LineGrap = new PIE.Graphics({
            geometry:line,
            symbol:new PIE.LineSymbol({color:"#00ffff",width:2})
        });
        view.graphics.addMany([Grap]);
        var Grr = new PIE.GraphicsLayer({
           graphics:[pointGrap]
        });
        Grr.add(LineGrap);
        map.add(Grr);

        map.add(testFill);
        map.add(imageLayer);
    });
```



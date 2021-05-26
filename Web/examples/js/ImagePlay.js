var ImagePlay = function (mapset) {
    var map =mapset;
    var url = "http://127.0.0.1:8060/PIE-Web";
    var imagesDatas = [];
    var num = 0;
    this.speed =3;
    var self = this;
    var timeVal;
    var bbox = [56.02,-4.96,150.97,59.97];
    this.getImageDatas = function () {
        $.ajax({
            async : false,
            type : "POST",
            dataType : "json",
            url :url+ "/showSatellite/getSatCloudImages?dataCode=1&time=20180512",
            success : function(rs) {
                if (!rs || rs.length == 0) {
                    return;
                }
                console.log(rs);
                imagesDatas = rs;
                addImages();
            },
        })
    };
    function addImages() {
        for(var i =0;i<imagesDatas.length;i++)
        {
            var url = "data/"+imagesDatas[i].imagePath;
            var coordinates=[[bbox[0],bbox[3]],[bbox[2],bbox[3]],[bbox[2],bbox[1]],[bbox[0],bbox[1]]] ;
            addImageLayer(url,coordinates,"img"+i);
        }
       // self.showImage("img"+(imagesDatas.length-1));
        self.play();
    }
    this.play = function () {
        if(timeVal){
            clearInterval(timeVal)
        }
        num = -1;
        self.removeImages()
        self.run();
        timeVal= setInterval(self.run,self.speed*1000);
    };
    this.run =function () {
        num++;
        if(num>imagesDatas.length){
            return
        }else{
            self.showImage("img"+(num%imagesDatas.length));
            // setTimeout(function () {
            //     self.hideImage("img"+((num-2)%imagesDatas.length));
            // },1000)
            self.hideImage("img"+((num-2)%imagesDatas.length));
        }

    };

    this.removeImages =function () {
        for(var i =0 ;i<imagesDatas.length;i++){
            self.hideImage("img"+i);
        }
    };
    this.showImage = function (id) {
        console.log(id);
        var temp = map.getLayer(id)
        if(temp ){
            temp.setVisible(true);
        }

    };
    this.hideImage = function (id) {
        console.log("remove",id);
        var temp = map.getLayer(id)
        if(temp ){
            temp.setVisible(false);
        }
    };
    function addImageLayer(url,coordinates,id) {
        var img = new PIE.MetoStyle.RasterLayer({
            url:url,
            coordinates:coordinates,
            id:id,
            opacity:1,
        });
        map.add(img);

        img.setVisible(false);
    }
}
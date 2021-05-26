var plottingHelper=function  (options) {
  var _self = this;
  this._map=options.map!=null?options.map:null;
  this.drawNum=1;//针对圆与多边形，客户要做承灾体统计，需要在绘制的图形上标上名字，例：标绘区1，标绘区2
  this.myVectorSource=null;//当前标绘所用数据源
  this.myVectorLayer=null;//当前标绘所用的矢量图层
  this.draw=null;// global so we can remove it later
  this.modify=null;//修改交互事件
  this.snap=null;//
  this.isHighLightFeature=false;//是否高亮显示
  this.curSelDrawBtn=null;//当前选中的标绘按钮，绘制完清除时用
  this.menu_overlay=null;//右键删除时，对应的右键附加图层
  this.dragBoxEvent=null;//框选涉及的托拽事件
  this.selectEvent=null;//框选的涉及的选择事件
  this.selectedFeatures=[];//地图框选的元素
  this.selectedFeatures_style=[];//地图框选的元素样式，用做还原。
  this.mapInfoPopup=null;//地图弹窗,
  this.colorShowId='';//颜色选择器对应的点击按钮ID
  this.colorShowType='';//颜色选择器对应的要用于的操作类型（点、线、圆、多边形）
  this.colorShowSubType='';//颜色选择器对应的要用于的操作子类型（框线，填充色）
  this.colorWin=null;//颜色选择器
  this.drawRadioValue=null;//绘制单选按钮是否已选中
  this.menuDiv=null;//创建右键点击地图时，弹出的菜单DIV
  this.selFeatures=[];//被选中要删除的feature
  this.propertyObj={};
  this.markTextStyle={//标绘中文本的样式
      font:"normal 24px 宋体",
      color: '#000'
  };
  this.drawToolIdArray=[//存放标绘工具子菜单id
    {"点":"tool_point_id"},
    {"圆":"tool_circle_id"},
    {"椭圆":"tool_ellipse_id"},
    {"矩形":"tool_rectangle_id"},
    {"多边形":"tool_polygon_id"},
    {"线":"tool_line_id"},
    {"文本":"tool_text_id"}
  ];
  this.drawToolIdArray_ids=["tool_point_id","tool_circle_id","tool_ellipse_id","tool_rectangle_id","tool_polygon_id","tool_line_id","tool_text_id"];
  this.eventKey=null;
};

plottingHelper.prototype.toInit=function(){
  let me=this;
  this.getDrawInitValue();//获得绘制工具的初始值
  this.createMenuDiv();
  this.menu_overlay = new PIE.ol.Overlay({
    element:this.menuDiv,
    positioning: 'center-center'
  });
};

//初始化右键菜单
plottingHelper.prototype.initContextMenu=function(){
  let me=this;
  setTimeout(function () {
      me.menu_overlay.setMap(me._map);

      $(me._map.getViewport()).on("contextmenu", function(e){
        e.preventDefault();
        me.selFeatures=[];
        let coordinate=me._map.getEventCoordinate(e);
        let piexl = me._map.getEventPixel(e.originalEvent);
        if(me._map.hasFeatureAtPixel(piexl) || (me.selectedFeatures.length>0)){
          me.menu_overlay.setPosition(coordinate);
          //获得此与此象素位置相交的feature
          me._map.forEachFeatureAtPixel(piexl,function (feature,layer) {
            // var poly = turf.polygon([feature.getGeometry().getCoordinates()[0]]);
            // var options = {pivot: [0, 25]};
            // turf.transformRotate(poly, 10, options);
            let extent=feature.getGeometry().getExtent();
            let center=PIE.ol.extent.getCenter(extent);
            feature.getGeometry().rotate(1,center);
            feature.getGeometry().scale(1.1,1.1,center);
            let obj={feature:feature,layer:layer};
            me.selFeatures.push(obj);
          })
          //清除选中状态
          me.removeFeatureSelStyle();
        }

      });

      $(me._map.getViewport()).on("click", function(e){
        //debugger;
        e.preventDefault();
        me.menu_overlay.setPosition(undefined);
        //移除选中事件
        // me._map.removeInteraction(me.selectEvent);
        // me._map.removeInteraction(me.dragBoxEvent);
        // me.selectEvent=null;
        // me.dragBoxEvent=null;
      });

  },0);
};

//获得标绘工具的初始值
plottingHelper.prototype.getDrawInitValue=function(){
  let _self=this;
  this.propertyObj.curSelImg="";//当前选中的绘制图类形
  this.propertyObj.pointColor="#ff0000";//点的颜色
  this.propertyObj.lineColor="#2EC1FD";//线的颜色
  this.propertyObj.circle_fillColor="#2EC1FD";//圆的填充颜色
  this.propertyObj.ellipse_fillColor="#2EC1FD";//椭圆的填充颜色
  this.propertyObj.rectangle_fillColor="#2EC1FD";//矩形的填充颜色
  this.propertyObj.polygon_fillColor="#2EC1FD";//多边形的填充颜色
  this.propertyObj.pointWidth=10;//点的大小
  this.propertyObj.lineWidth=3;//线的粗细
  this.propertyObj.circle_borderWidth=3;//圆的边框粗细
  this.propertyObj.ellipse_borderWidth=3;//椭圆的边框粗细
  this.propertyObj.rectangle_borderWidth=3;//矩形的边框粗细
  this.propertyObj.polygon_borderWidth=3;//多边形的边框粗细

  this.propertyObj.circle_borderColor="#2EC1FD";//圆的边框颜色
  this.propertyObj.ellipse_borderColor="#2EC1FD";//椭圆的边框颜色
  this.propertyObj.rectangle_borderColor="#2EC1FD";//矩形的边框颜色
  this.propertyObj.polygon_borderColor="#2EC1FD";//多边形的边框颜色

  this.propertyObj.circle_isFill=false;//针对圆是否填充
  this.propertyObj.ellipse_isFill=false;//针对椭圆是否填充
  this.propertyObj.rectangle_isFill=false;//矩形是否填充
  this.propertyObj.polygon_isFill=false;//针对多边形是否填充

};
//创建右键点击地图时，弹出的菜单DIV
plottingHelper.prototype.createMenuDiv=function(){
  let me=this;
  this.menuDiv = document.createElement("div");
  this.menuDiv.id="contextmenu_container";
  this.menuDiv.className="contextmenu";
  let  ul=document.createElement("ul");
  this.menuDiv.appendChild(ul);
  let  li=document.createElement("li");
  ul.appendChild(li);
  let  href_a=document.createElement("a");
  href_a.textContent="删除";
  li.appendChild(href_a);
  href_a.setAttribute("href","javascript:void(0);");
  href_a.setAttribute("id","delFeature");
  href_a.onclick=function(){
    me.menu_overlay.setPosition(undefined);
    //debugger;
    if(me.selFeatures.length>0){//删除单选的要求
      for(let i=0;i<me.selFeatures.length;i++){
        if(me.selFeatures[i].layer!=null){//发现针结点，线的
          me.selFeatures[i].layer.getSource().removeFeature(me.selFeatures[i].feature);
        }

      }
      me.selFeatures=[];
    }

    if(me.selectedFeatures.length!=0)
    {
      let boxLayers=me.selectedFeatures;
      if(boxLayers!=null && boxLayers.length>0){
        for(let i=boxLayers.length-1;i>=0;i--){
          me.myVectorSource.removeFeature(boxLayers[i]);
        }
        //清空选中的样式
        me.removeFeatureSelStyle();
        //清空选中事件
        me.selectedFeatures=[];
        //
        // me._map.removeInteraction(me.selectEvent);
        // me._map.removeInteraction(me.dragBoxEvent);
         //me.selectEvent=null;
         //me.dragBoxEvent=null;
      }
    }

  }
};
plottingHelper.prototype.openContent= function (comb) {
  let src = comb.target.src,id=comb.target.id;
  if (src.indexOf('con_right_arrow') > -1) {//打开内容区
    this.lookup('drawcontainer').setVisible(true);
    src = 'resources/images/down_arrow.png';
  } else if (src.indexOf('down_arrow') > -1) {//隐藏内容区
    this.lookup('drawcontainer').setVisible(false);
    src = 'resources/images/con_right_arrow.png';
  }
  Ext.getCmp(id).setSrc(src);
};
//弹出颜色选择框
plottingHelper.prototype.showColor=function(type,subType,id) {
  //debugger;
  let me=this;
  me.colorShowType = type;
  me.colorShowSubType = subType;
  me.colorShowId = id;
  var colorText = Ext.getCmp(id);
  me.colorWin.x = colorText.getPosition()[0] + colorText.getWidth();
  me.colorWin.y = colorText.getPosition()[1];
  me.colorWin.show();
};

//RGB色转为RGBA色
plottingHelper.prototype.RGB2RGBA=function(rgb_color,isFill){
  //注：rgb_color的格式为#FFFFFFF，alp为透明度
  var r = parseInt("0x" + rgb_color.substr(1,2));
  var g = parseInt("0x" + rgb_color.substr(3,2));
  var b = parseInt("0x" + rgb_color.substr(5,2));

  if(isFill){
    return "rgba(" + r + "," + g + "," + b + "," + 0.3+ ")";
  }else {
    return "rgba(" + r + "," + g + "," + b + "," + 0+ ")";
  }
};
plottingHelper.prototype.chkTxtChange=function (component, newValue, oldValue) {
  let me = this;
  if(newValue==true){
    me.markTextStyle.font=me.markTextStyle.font.replace(me.markTextStyle.font.split(" ")[0],"bold");
  }else{
    me.markTextStyle.font=me.markTextStyle.font.replace(me.markTextStyle.font.split(" ")[0],"normal");
  }
  //重新注册地图绘制事件
  if(me.drawRadioValue!=null){
    me.removeMapDrawEvent();
    me.registerDrawEvent(me.drawRadioValue);
  }
};
plottingHelper.prototype.chkChange=function (type,component, newValue, oldValue) {
  let me = this;
  if(type=="circle"){
    me.propertyObj.circle_isFill=newValue;
  }else if(type=="ellipse"){
    me.propertyObj.ellipse_isFill=newValue;
  }else if(type=="rectangle"){
    me.propertyObj.rectangle_isFill=newValue;
  }else if(type=="polygon"){
    me.propertyObj.polygon_isFill=newValue;
  }

  //重新注册地图绘制事件
  if(me.drawRadioValue!=null){
    me.removeMapDrawEvent();
    me.registerDrawEvent(me.drawRadioValue);
  }
};
plottingHelper.prototype.getGuid=function() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  });
};

//获得新样式
plottingHelper.prototype.getNewFeatureStyle=function(feature,isHighLight){
  let me=this;
  let newFeature=null;
  if(feature.get('isFontDraw')==null){//代表不是文字标绘
    let fillColor="";//填充色
    let lineColor="";//线的颜色
    let lineWidth="";//线的宽度
    let isFill=false;//是否填充
    if(me.curSelImg=="Circle"){
      fillColor=me.propertyObj.circle_fillColor;
      lineColor=me.propertyObj.circle_borderColor;
      lineWidth=me.propertyObj.circle_borderWidth;
      isFill=me.propertyObj.circle_isFill;
    } else if(me.curSelImg=="Ellipse") {
      fillColor=me.propertyObj.ellipse_fillColor;
      lineColor=me.propertyObj.ellipse_borderColor;
      lineWidth=me.propertyObj.ellipse_borderWidth;
      isFill=me.propertyObj.ellipse_isFill;
    }
    else if(me.curSelImg=="Box") {
      fillColor=me.propertyObj.rectangle_fillColor;
      lineColor=me.propertyObj.rectangle_borderColor;
      lineWidth=me.propertyObj.rectangle_borderWidth;
      isFill=me.propertyObj.rectangle_isFill;
    }
    else if(me.curSelImg=="Polygon") {
      fillColor=me.propertyObj.polygon_fillColor;
      lineColor=me.propertyObj.polygon_borderColor;
      lineWidth=me.propertyObj.polygon_borderWidth;
      isFill=me.propertyObj.polygon_isFill;
    }
    else if(me.curSelImg=="LineString") {
      lineColor=me.propertyObj.lineColor;
      lineWidth=me.propertyObj.lineWidth;
    }

    if(isHighLight){//高亮的样式
      newFeature=new PIE.ol.style.Style({
        fill: new PIE.ol.style.Fill({
          color: 'rgba(255,255,255,0.4)'
        }),
        stroke: new PIE.ol.style.Stroke({
          color: '#0099FF',
          width:lineWidth,
        }),

        image: new PIE.ol.style.Circle({//点的半径及颜色
          radius: me.propertyObj.pointWidth,
          fill: new PIE.ol.style.Fill({
            color: '#0099FF'
          })
        }),
        text: new PIE.ol.style.Text({
          fill: new PIE.ol.style.Fill({
            color:'#000000'
          }),
          text: feature.get('name'),      //文本内容
          stroke: new PIE.ol.style.Stroke({
            color: '#000000',
            width:1
          })
        })
      });
    }else {
      newFeature= new PIE.ol.style.Style({
        fill: new PIE.ol.style.Fill({
          color: this.RGB2RGBA(fillColor,isFill)
        }),
        stroke: new PIE.ol.style.Stroke({//线的边界颜色，粗细
          color:lineColor,
          width:lineWidth,
        }),
        image: new PIE.ol.style.Circle({//点的半径及颜色
          radius: me.propertyObj.pointWidth,
          fill: new PIE.ol.style.Fill({
            color: me.propertyObj.pointColor
          })
        }),
        text: new PIE.ol.style.Text({
          fill: new PIE.ol.style.Fill({
            color:'#000000'
          }),
          backgroundFill:new PIE.ol.style.Fill({
            color:fillColor
          }),
          backgroundStroke: new PIE.ol.style.Stroke({
            color:'#fff',
            width: 1
          }),
          padding:[2,2,0,2],
          text: feature.get('name'),      //文本内容
          stroke: new PIE.ol.style.Stroke({
            color:'#000000',
            width: 1
          })
        })
      })
    }

  }else {
    if(isHighLight) {//高亮的样式
      newFeature=new PIE.ol.style.Style({
        text: new PIE.ol.style.Text({
          textAlign: 'center',            //位置
          textBaseline: 'middle',         //基准线
          font:this.markTextStyle.font,    //文字样式
          text: feature.get('name'),      //文本内容
          fill: new PIE.ol.style.Fill({       //文本填充样式（即文字颜色)
            color: '#0099FF'
          }),
          stroke: new PIE.ol.style.Stroke({
            color: '#00',
            width: 0
          })
        })
      });
    }else {
      newFeature=new PIE.ol.style.Style({
        text: new PIE.ol.style.Text({
          textAlign: 'center',            //位置
          textBaseline: 'middle',         //基准线
          font:this.markTextStyle.font,    //文字样式
          text: feature.get('name'),      //文本内容
          fill: new PIE.ol.style.Fill({       //文本填充样式（即文字颜色)
            color: this.markTextStyle.color
          }),
          stroke: new PIE.ol.style.Stroke({
            color: '#00',
            width: 0
          })
        })
      });
    }
  }

  feature.setStyle(newFeature);
};

plottingHelper.prototype.addInteraction=function(value) {
  //debugger;
  let me=this;
  me.curSelImg=value;
  let geometryFunction;
  if(this.myVectorSource==null){
    this.myVectorSource=new PIE.ol.source.Vector();
  }
  if(this.myVectorLayer==null){
    this.myVectorLayer=new PIE.ol.layer.Vector({
      id:'vectordrawn',
      source: this.myVectorSource,
      style:function(feature){
        if(feature.getGeometry().getType()=="Circle" ||feature.getGeometry().getType()=="Polygon"){
          feature.setProperties({name:"标绘区"+me.drawNum.toString()});
          me.drawNum++;
        }
        return me.getNewFeatureStyle(feature,false)
      }
    });
    this._map.addLayer(this.myVectorLayer);
  }

  if (value === 'Box') {//针对矩形框选特殊处理
    value = 'Circle';
    geometryFunction = PIE.ol.interaction.Draw.createBox();
  }
  if(value==="Ellipse") {
    value = 'Circle';
    geometryFunction = function(coordinates, geometry) {
      var center = coordinates[0];
      var last = coordinates[1];
      var dx = center[0] - last[0];
      var dy = center[1] - last[1];
      var radius = Math.sqrt(dx * dx + dy * dy);
      var circle = new PIE.ol.geom.Circle(center, radius);
      var polygon = PIE.ol.geom.Polygon.fromCircle(circle, 64);
      polygon.scale(dx/radius, dy/radius);
      if (!geometry) {
        geometry = polygon;
      } else {
        geometry.setCoordinates(polygon.getCoordinates());
      }
      return geometry;
    };
  }

  this.modify = new PIE.ol.interaction.Modify({source: this.myVectorSource});
  this._map.addInteraction(this.modify);

  this.draw = new PIE.ol.interaction.Draw({
    source: this.myVectorSource,
    type: value,
    geometryFunction: geometryFunction
  });

  this.draw.on('drawend', async (evt) => {
    let me=this;
    //清空注册事件
    //me.removeMapDrawEvent();
   });

  this._map.addInteraction(this.draw);
  this.snap = new PIE.ol.interaction.Snap({source: this.myVectorSource});
  this._map.addInteraction(this.snap);
};
//注册移动事件
plottingHelper.prototype.registerMoveEvt=function(){
  /**
   * Define a namespace for the application.
   */
  var app = {};


  /**
   * @constructor
   * @extends {ol.interaction.Pointer}
   */
  app.Drag = function() {

    PIE.ol.interaction.Pointer.call(this, {
      handleDownEvent: app.Drag.prototype.handleDownEvent,
      handleDragEvent: app.Drag.prototype.handleDragEvent,
      handleMoveEvent: app.Drag.prototype.handleMoveEvent,
      handleUpEvent: app.Drag.prototype.handleUpEvent
    });

    /**
     * @type {ol.Pixel}
     * @private
     */
    this.coordinate_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.cursor_ = 'pointer';

    /**
     * @type {ol.Feature}
     * @private
     */
    this.feature_ = null;

    /**
     * @type {string|undefined}
     * @private
     */
    this.previousCursor_ = undefined;

  };
  PIE.ol.inherits(app.Drag, PIE.ol.interaction.Pointer);


  /**
   * @param {ol.MapBrowserEvent} evt Map browser event.
   * @return {boolean} `true` to start the drag sequence.
   */
  app.Drag.prototype.handleDownEvent = function(evt) {
    var map = evt.map;

    var feature = map.forEachFeatureAtPixel(evt.pixel,
      function(feature) {
        return feature;
      });

    if (feature) {
      this.coordinate_ = evt.coordinate;
      this.feature_ = feature;
    }

    return !!feature;
  };


  /**
   * @param {ol.MapBrowserEvent} evt Map browser event.
   */
  app.Drag.prototype.handleDragEvent = function(evt) {
    var deltaX = evt.coordinate[0] - this.coordinate_[0];
    var deltaY = evt.coordinate[1] - this.coordinate_[1];

    var geometry = this.feature_.getGeometry();
    geometry.translate(deltaX, deltaY);

    this.coordinate_[0] = evt.coordinate[0];
    this.coordinate_[1] = evt.coordinate[1];
  };


  /**
   * @param {ol.MapBrowserEvent} evt Event.
   */
  app.Drag.prototype.handleMoveEvent = function(evt) {
    if (this.cursor_) {
      var map = evt.map;
      var feature = map.forEachFeatureAtPixel(evt.pixel,
        function(feature) {
          return feature;
        });
      var element = evt.map.getTargetElement();
      if (feature) {
        if (element.style.cursor != this.cursor_) {
          this.previousCursor_ = element.style.cursor;
          element.style.cursor = this.cursor_;
        }
      } else if (this.previousCursor_ !== undefined) {
        element.style.cursor = this.previousCursor_;
        this.previousCursor_ = undefined;
      }
    }
  };


  /**
   * @return {boolean} `false` to stop the drag sequence.
   */
  app.Drag.prototype.handleUpEvent = function() {
    this.coordinate_ = null;
    this.feature_ = null;
    return false;
  };
 return app;
};

//框选功能
plottingHelper.prototype.boxSelect=function(vectorSource){
  let me=this;
  //框选
  //if(this.dragBoxEvent==null){
    // a normal select interaction to handle click
    this.selectEvent= new PIE.ol.interaction.Select();
    this._map.addInteraction(this.selectEvent);
    this.selectedFeatures =this.selectEvent.getFeatures();

    // a DragBox interaction used to select features by drawing boxes
    this.dragBoxEvent= new PIE.ol.interaction.DragBox({
      //condition : ol.events.condition.always // 默认是always
    });
    this._map.addInteraction( this.dragBoxEvent);

    this.dragBoxEvent.on('boxend', function() {
      //;
      var extent =  me.dragBoxEvent.getGeometry().getExtent();
      vectorSource.forEachFeatureIntersectingExtent(extent, function(
        feature) {
        //保存选中feature的样式用于还原
        let featureId=me.getGuid();
        feature.setId(featureId);
        let obj={};
        obj[featureId]=feature.getStyle();
        me.selectedFeatures_style.push(obj);
        //
        me.selectedFeatures.push(feature);
        // 监听选中事件，然后在事件处理函数中改变被选中的`feature`的样式
        me.getNewFeatureStyle(feature,true);

      });
    });
    this.dragBoxEvent.on('boxstart', function() {
      //debugger;
        me.removeFeatureSelStyle();
        me.selectedFeatures=[];
        me.selectedFeatures_style=[];
    });
  //}
};

//停止绘制
plottingHelper.prototype.stopDraw=function(){
  //清空注册事件
  this.removeMapDrawEvent();
  //清空单选按钮
  let items = this.lookup('rd_draw').items.items;
  for (let i = 0; i < items.length; i++) {
    items[i].checked=false;
    items[i].setRawValue(false);
  }
};
plottingHelper.prototype.cycleChangeHandler=function(com,value){
   //debugger;
  let me = this;
  //清空注册事件
  me.removeMapDrawEvent();

  if(value=="请选择"){
    return;
  }
  me.drawEvent(com,value);
};

plottingHelper.prototype.drawEvent=function(com,text){
  let me = this;
   //me.createMenuDown(com, text, true);

  if(text=="点"){
    me.drawRadioValue='2';
  }
  else if(text=="圆"){
    me.drawRadioValue='0';
  }
  else if(text=="椭圆"){
    me.drawRadioValue='6';
  }
  else if(text=="矩形"){
    me.drawRadioValue='1';
  }
  else if(text=="多边形"){
    me.drawRadioValue='3';
  }
  else if(text=="线"){
    me.drawRadioValue='4';
  }
  else if(text=="文本"){
    me.drawRadioValue='5';
  } else if(text=="删除"){
    me.clearDraw();
    return;
  }
  else if(text=="框选"){
    //debugger;
    this._map.removeInteraction(this.modify);
    if (this.selectEvent !== null) {
      this._map.removeInteraction(this.selectEvent);
    }

    if(this.myVectorSource!=null){
      this.boxSelect(this.myVectorSource);
    }
    return;
  }else if(text=="保存"){
    this.saveMapImage();
    return;
  }else if(text=="打印"){
    this.pagePrint();
    return;
  }
  me.registerDrawEvent(me.drawRadioValue);
};
/**
 * 保存图片
 */
plottingHelper.prototype.saveMapImage= function () {

  let date = new Date();
  let map = this._map;
  function callback5(result5){
    // console.log(result5);
    if (Ext.getCmp('jpWindowId')) {
      Ext.getCmp('jpWindowId').destroy();
    }
    Ext.create('Ext.window.Window', {
      id: 'jpWindowId',
      //title: '是否保存？',
      closeToolText: '关闭',
      width: '80%',
      height:'82%',
      maxHeight: '83%',
      maximizable: true,
      plain: true,
      modal: true,//背景是否操作
      scrollable: true,//滚动条
      draggable: true,//窗口是否拖动
      resizable: true,//窗口是否调整大小
      y: 80,
      border: false,
      style: 'text-align: center;padding:10px;border:1px solid #111111;',
      layout:{
        type:'vbox',
        align:'center',
        pack:'stretch'
      },
      items:[
        {
          xtype: 'container',
          id:'jpWindowIdContent',
          flex:1,
          layout:{
            type:'vbox',
            align:'center',
            pack:'stretch'
          },
          width: '100%',
          margin:'10px 50px',
          style:'background:rgba(255,255,255,0.9);border:1px solid #111111;',
          padding:'10px 20px',
          items: [
            {
              xtype:'container',
              layout:{
                type:'hbox',
                align:'center',
                pack:'stretch'
              },
              defaults:{
                xtype:'container'
              },
              width:'100%',
              items:[
                {
                  flex:1.2
                },
                {
                  xtype:'textfield',
                  width:'40%',
                  id:'jpWindowId2ContentTitle',
                  value:'标绘('+date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日)',
                  listeners: {
                    render: function (field, p) {
                      field.getEl().on('mouseover', function(p1) {
                        CommonUtils.fn.updateTip(field);
                      });
                    }
                  }
                },
                {
                  flex:0.6
                }
              ]
            },
            {
              xtype: 'container',
              layout:{
                type:'hbox',
                align:'center',
                pack:'stretch'
              },
              flex:1,
              width:'100%',
              items:[
                {
                  xtype:'container',
                  flex:1,
                  height:'100%',
                  items:[
                    {
                      xtype:'image',
                      width:'100%',
                      flex:1,
                      src:result5,
                      style:'margin:10px 0px;',
                      alt:'当前截屏内容'
                    },
                    // {
                    //     xtype: 'image',
                    //     width: 32,
                    //     height: 32,
                    //     src: 'resources/images/north.png',
                    //     alt:'指北针',
                    //     style:'position:absolute;top:20px;right:10px;'
                    // }
                  ]
                }
              ]
            },
            {
              xtype:'container',
              layout:{
                type:'hbox',
                align:'center',
                pack:'stretch'
              },
              defaults:{
                xtype:'container'
              },
              width:'100%',
              padding:'0 5px',
              items:[
                {
                  flex:1
                },
                {
                  xtype:'textfield',
                  width:250,
                  value:'应急管理部风险监测和综合减灾司',
                  listeners: {
                    render: function (field, p) {
                      field.getEl().on('mouseover', function(p1) {
                        CommonUtils.fn.updateTip(field);
                      });
                    }
                  }
                },
                {
                  flex:2.4
                },
                {
                  xtype:'textfield',
                  width:250,
                  value:'制图时间：'+date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'+date.getHours()+'时',
                  listeners: {
                    render: function (field, p) {
                      field.getEl().on('mouseover', function(p1) {
                        CommonUtils.fn.updateTip(field);
                      });
                    }
                  }
                },
                {
                  flex:1
                }
              ]
            },
          ]
        }
      ]
    }).show();
    let time = date.getFullYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString()+date.getHours().toString()+date.getMinutes().toString()+date.getSeconds().toString();
    // CommonUtils.fn.downloadFile(result5,time+'台风预警承灾体信息提取');
    CommonUtils.fn.downloadFile2('jpWindowIdContent',time+'标绘',true);
    setTimeout(function () {
      if (Ext.getCmp('jpWindowId2')) {
        Ext.getCmp('jpWindowId2').destroy();
      }
    },5000);
  }
  map.once('postcompose', function(event) {
    //获取map中的canvas,并转换为图片
    let canvas = event.context.canvas;
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(canvas.msToBlob(), 'map.png');
    } else {
      canvas.toBlob(function(blob) {
        let a = new FileReader();
        a.onload = function (e) { callback5(e.target.result); };
        a.readAsDataURL(blob);
      });
    }
  });
  map.renderSync();
};

//打印操作
plottingHelper.prototype.pagePrint=function() {
  print.portrait = false;//横向打印
  // document.getElementsByTagName('body')[0].style.zoom=0.9;
  window.print();
  // document.getElementsByTagName('body')[0].style.zoom=1;
};

//注册事件
plottingHelper.prototype.registerDrawEvent=function(drawRadioValue){
  //debugger;
  let me=this;
  if (drawRadioValue === '0') {
    this.addInteraction("Circle");
  }
  else if (drawRadioValue === '1') {
    this.addInteraction("Box");
  }
  else if (drawRadioValue === '2') {
    this.addInteraction("Point");
  }else if (drawRadioValue === '3') {
    this.addInteraction("Polygon");
  }else if (drawRadioValue === '4') {
    this.addInteraction("LineString");
  }else if(drawRadioValue==='5'){
     this.eventKey =this._map.on('singleclick', function (evt) {
      //准备弹框
      me.initMapInfoPopup();
      //显示要输入字的文本区域
      let coordinate = evt.coordinate;
      me.mapInfoPopup.setPosition(coordinate);
      me.mapInfoPopup.getElement().focus();
    }.bind(this))
  }  else if(drawRadioValue==='6'){
    this.addInteraction("Ellipse");
  }
  else {
    this.addInteraction("None");
  }
  // //移除dem的点击事件
  // PIE.ol.Observable.unByKey(conf.map.demEvent);
  // conf.map.demEvent = '';
};
//清除界面上的所有标绘
plottingHelper.prototype.clearDraw=function(){
  let me=this;
  //清空注册事件
  this.removeMapDrawEvent();
  //清空地图上的标注图层
  this.removeLayers();
  //把记数器恢复到默认值
  me.drawNum=1;

  // //绘制事件结束，把下拉框恢复到默认设置
  // let none= this.lookup("draw_sel_tool").menu.items.items[0];
  // this.lookup("draw_sel_tool").setActiveItem(none);
};
//清空注册事件
plottingHelper.prototype.removeMapDrawEvent=function(){
  // if(this.draw!=null){//清空绘制事件
  this._map.removeInteraction(this.draw);
  this.draw=null;
  // }

  // if(this.snap!=null){
  this._map.removeInteraction(this.snap);
  this.snap=null;
  // }

  this._map.removeInteraction(this.modify);
  this.modify=null;

  //移除框选事件
  this._map.removeInteraction(this.selectEvent);
  this._map.removeInteraction(this.dragBoxEvent);
  this.selectEvent=null;
  this.dragBoxEvent=null;

  PIE.ol.Observable.unByKey(this.eventKey);
};
//清空标绘选中的样式
plottingHelper.prototype.removeFeatureSelStyle=function(){
  let me=this;
  //当不想选中，且没删除时，恢复原样式
  if(me.selectedFeatures.length>0)
  {
    let features=me.selectedFeatures;
    for(let j=0;j<features.length;j++)
    {
      let featureId=features[j].getId();
      for(let k=0;k<me.selectedFeatures_style.length;k++)
      {
        let obj=me.selectedFeatures_style[k];
        for(let key in obj){
          if(key==featureId){
            let style=obj[featureId];
            features[j].setStyle(style);
            break;
          }
        }
      }
    }
    //清空样式
    me.selectedFeatures_style=[];
  }
};

/**
 * 清除地图上所有图层
 */
plottingHelper.prototype.removeLayers= function () {

  let me=this;
  //删除矢量图层
  let layers = this._map.getLayers();
  let layersCol = layers.getArray();
  let arr = [];
  for (let i = 0; i < layersCol.length; i++) {
    if (layersCol[i]  && layersCol[i].get('id') && (layersCol[i].get('id') === 'vectordrawn' || layersCol[i].get('id')==="vector_markTextId")) {
      arr.push(i);
    }
  }
  for (let i = arr.length - 1; i > -1; i--) {
    layers.removeAt(arr[i]);
  }
  //删除附加图层
  let overlayers = this._map.getOverlays().getArray();
  let overlayersArr = [];
  for (let i = 0; i < overlayers.length; i++) {
    if (overlayers[i] !=undefined && overlayers[i].id==="overlay_markTextId") {
      overlayersArr.push(i);
    }
  }
  for (let i = overlayersArr.length - 1; i > -1; i--) {
    this._map.getOverlays().removeAt(overlayersArr[i]);
  }
  //重新创建图层
  me.myVectorSource=null;
  me.myVectorLayer=null;
};
//////以下为地图弹窗相关
//矢量标注样式设置函数，设置image为图标ol.style.Icon
plottingHelper.prototype.createLabelStyle=function(feature){
  console.log(feature);
  return new PIE.ol.style.Style({
    text: new PIE.ol.style.Text({
      textAlign: 'center',            //位置
      textBaseline: 'middle',         //基准线
      font:this.markTextStyle.font,    //文字样式
      text: feature.get('name'),      //文本内容
      fill: new PIE.ol.style.Fill({       //文本填充样式（即文字颜色)
        color: this.markTextStyle.color
      }),
      stroke: new PIE.ol.style.Stroke({
        color: '#00',
        width: 0
      })
    })
  });
};
plottingHelper.prototype.onfocusFun=function(obj){
  //debugger;
  window.activeobj=obj;
  obj.clock=setInterval(function(){
    console.log("1");
    activeobj.style.height=activeobj.scrollHeight+'px';
  },200);
};
plottingHelper.prototype.onblurFun=function(obj){
  let me=this;
  clearInterval(obj.clock);
  //当失去焦点时把文字标注到地图上，移除掉附加层
  let coordinate=this.mapInfoPopup.getPosition();
  let markText=obj.value;
  //新建一个要素ol.Feature
  let newFeature = new PIE.ol.Feature({
    geometry: new PIE.ol.geom.Point(coordinate),  //几何信息
    name:markText,
    isFontDraw:true
  });
  // newFeature.setStyle(this.createLabelStyle(newFeature));      //设置要素样式
  me.curSelImg="文本";
  me.getNewFeatureStyle(newFeature,false);
  me.addInteraction("文本");
  // if(me.myVectorSource==null){
  //     this.myVectorSource=new ol.source.Vector();
  //     this.modify = new ol.interaction.Modify({source: this.myVectorSource});
  //     this._map.addInteraction(this.modify);
  // }
  //  if(this.myVectorLayer==null){
  //      this.myVectorLayer=new ol.layer.Vector({
  //          id:'vectordrawn',
  //          source: this.myVectorSource,
  //          style:function(feature){
  //              me.curSelImg="文本";
  //              return me.getNewFeatureStyle(feature)
  //          }
  //      });
  //
  //      this._map.addLayer(this.myVectorLayer);
  //  }
  me.myVectorSource.addFeature(newFeature);
  //移除附加层
  this._map.removeOverlay(me.mapInfoPopup);
  //清空注册事件,重新注册，
  me.removeMapDrawEvent();
  me.registerDrawEvent(me.drawRadioValue);
};

//初始化地图弹窗对象
plottingHelper.prototype.initMapInfoPopup=function () {
  let me = this;
  // if (me.mapInfoPopup === null) {
  let earthInfoDiv = document.createElement("textarea");
  earthInfoDiv.autofocus=true;
  earthInfoDiv.style="height:34px;padding: 0px;overflow:scroll;overflow-y:hidden;overflow-x:hidden;width:200px;border-color:#ff0000;border:solid 3px red";
  //earthInfoDiv.rows=1;
  earthInfoDiv.onfocus=function(){
    me.onfocusFun(this);
  };
  earthInfoDiv.onblur=function(){
    me.onblurFun(this);
  };

  me.mapInfoPopup = new PIE.ol.Overlay({
    id:"overlay_markTextId",
    element: earthInfoDiv,
    autoPan: true,
    autoPanAnimation: {
      duration: 250
    },
    stopEvent: true,
    offset: [0, 0]//偏移量'
  });
  this._map.addOverlay(me.mapInfoPopup);
  // } else {
  //     let element = me.mapInfoPopup.getElement();
  //     $(element).popover('destroy');
  // }
};

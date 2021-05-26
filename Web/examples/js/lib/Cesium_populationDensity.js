var populationDensityTool = function (option) {
    this._option = option
    this._map=option.map
}

populationDensityTool.prototype.init=function(option) {
    let _self=this;
    var vectorSource = new PIE.ol.source.Vector({
        url: option.url,
        format: new PIE.ol.format.GeoJSON(),
        attributions: [option.copyright],
    });
    this.layer = new PIE.ol.layer.Vector({
        name: 'Departements',
        source: vectorSource,
        style: _self.getFeatureStyle
    })
    _self._map.addLayer(this.layer);

    // Display the style on select
    var popup = new PIE.ol.Overlay.Popup({ popupClass: 'tooltips', offsetBox:15 });
    _self._map.addOverlay(popup);
    var hover = new PIE.ol.interaction.Hover();
    _self._map.addInteraction(hover);
    hover.on('leave', function(e) {
        popup.hide();
    });
    hover.on('hover', function(e) {
        popup.show(e.coordinate,
            '<b>'+ e.feature.get('nom') + ' ('+e.feature.get('id')+')' +'</b>'
            +'<br/>'
            +"人口："+e.feature.get('pop').toLocaleString()+' 人')
    });
}
populationDensityTool.prototype.remove = function(){
    let _this=this;
    _this._map.removeControl(_this.legend);
    _this._map.removeLayer(_this.layer);
}
populationDensityTool.prototype.initLegend=function(option){
    let _self=this;
    // Define a new legend
    this.legend = new PIE.ol.control.Legend({
        title: 'Legend',
        style: _self.getFeatureStyle,
        collapsible: option.collapsible,
        margin: option.margin,
        size: option.size
    });
    _self._map.addControl(this.legend);

    // Add empty row to
   for(let i=0;i<option.legendList.length;i++){
        this.legend.addRow(option.legendList[i]);
   }
}

populationDensityTool.prototype.getFeatureStyle=function(feature) {
    return [
        new PIE.ol.style.Style ({
            image: new PIE.ol.style.Circle({
                radius: Math.sqrt(feature.get('pop')/Math.PI) /200,
                fill: new PIE.ol.style.Fill ({
                    color: [252,174,33,.7],
                }),
                stroke: new PIE.ol.style.Stroke ({
                    width: 1,
                    color: [252,174,33],
                })
            }),
            geometry: new PIE.ol.geom.Point( PIE.ol.extent.getCenter (feature.getGeometry().getExtent() ))
        }),
        new PIE.ol.style.Style ({
            stroke: new PIE.ol.style.Stroke ({
                width: 1,
                color: [255,128,0]
            }),
            fill: new PIE.ol.style.Fill ({
                color: [255, 128, 0, 0.2]
            })
        })
    ];
}


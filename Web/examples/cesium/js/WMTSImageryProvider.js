var WMTSImageryProvider = function WMTSImageryProvider(description) {
    var trailingSlashRegex = /\/$/;
    var defaultCredit = new Cesium.Credit('WMTS');
    description = Cesium.defaultValue(description, {});

    var url = Cesium.defaultValue(description.url, 'http://localhost:8088/wmts');

    if (!trailingSlashRegex.test(url)) {

    }

    this._url = url;
    this._fileExtension = Cesium.defaultValue(description.fileExtension, 'png');
    this._proxy = description.proxy;
    this._tileDiscardPolicy = description.tileDiscardPolicy;

    //WebMercatorTilingScheme  GeographicTilingScheme
    this._tilingScheme = new Cesium.GeographicTilingScheme({
        numberOfLevelZeroTilesX : 2,
        numberOfLevelZeroTilesY : 1
    });

    this._tileWidth = 256;
    this._tileHeight = 256;

    this._minimumLevel = Cesium.defaultValue(description.minimumLevel, 0);
    this._maximumLevel = Cesium.defaultValue(description.maximumLevel, 17);
    this._extent = Cesium.defaultValue(description.extent, this._tilingScheme.extent);
    this._rectangle = Cesium.defaultValue(description.rectangle, this._tilingScheme.rectangle);

    this._errorEvent = new Cesium.Event();

    this._ready = true;

    var credit = Cesium.defaultValue(description.credit, defaultCredit);
    if (typeof credit === 'string') {
        credit = new Cesium.Credit(credit);
    }
    this._credit = credit;
};


//这个函数需要自己实现特定地图服务的url拼接，这里使用的是WMTS1.0的传统URL风格
function buildImageUrl(imageryProvider,  x, y, level) {
    var z = level+1;
    var url = imageryProvider._url;
    url += '&X=' + x;
    url += '&Y=' + y;
    url += '&Z=' + z;
    return url;
}
Cesium.defineProperties(WMTSImageryProvider.prototype, {
    url : {
        get : function() {
            return this._url;
        }
    },

    proxy : {
        get : function() {
            return this._proxy;
        }
    },

    tileWidth : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('tileWidth must not be called before the imagery provider is ready.');
            }

            return this._tileWidth;
        }
    },

    tileHeight: {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('tileHeight must not be called before the imagery provider is ready.');
            }

            return this._tileHeight;
        }
    },
    maximumLevel : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('maximumLevel must not be called before the imagery provider is ready.');
            }
            return this._maximumLevel;
        }
    },

    minimumLevel : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('minimumLevel must not be called before the imagery provider is ready.');
            }

            return this._minimumLevel;
        }
    },

    tilingScheme : {
        get : function() {
            if (!this._ready) {
                throw new DeveloperError('tilingScheme must not be called before the imagery provider is ready.');
            }
            return this._tilingScheme;
        }
    },

    extent : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('extent must not be called before the imagery provider is ready.');
            }
            return this._extent;
        }
    },
    rectangle : {
        get : function() {
            if (!this._ready) {
                throw new DeveloperError('rectangle must not be called before the imagery provider is ready.');
            }
            return this._rectangle;
        }
    },

    tileDiscardPolicy : {
        get : function() {
            if (!this._ready) {
                throw new Cesium.DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.');
            }
            return this._tileDiscardPolicy;
        }
    },

    errorEvent : {
        get : function() {
            return this._errorEvent;
        }
    },

    ready : {
        get : function() {
            return this._ready;
        }
    },

    credit : {
        get : function() {
            return this._credit;
        }
    }
});

WMTSImageryProvider.prototype.getTileCredits = function(x, y, level) {
    return undefined;
};

WMTSImageryProvider.prototype.requestImage = function(x, y, level) {
    if (!this._ready) {
        throw new Cesium.DeveloperError('requestImage must not be called before the imagery provider is ready.');
    }

    var url = buildImageUrl(this,  x, y, level);
    return Cesium.ImageryProvider.loadImage(this, url);
};
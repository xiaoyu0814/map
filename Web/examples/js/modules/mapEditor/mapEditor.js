/*
 * @Author: hecheng
 * @Date: 2019-10-10 13:25:27
 * @Last Modified by: hecheng
 * @Last Modified time: 2019-10-18 17:46:43
 */

/**
 *
 *
 * @class mapEditor
 */
class mapEditor {
	constructor(map, dtName, layerId = 'route', uuid) {
		this.map = map
		this.drawId = ''
		this.action = ''
		this.dtName = dtName
		this.uuid = uuid
		this.layerId = layerId
		this.changId = ''
		this.addEvent = null
		this.properties = {}
		this.ajaxTime = null
		this.moreSelect = false
		this.selectArr = []
		let _this = this
		this.Draw = new MapboxDraw({
			displayControlsDefault: false
		})
		map.addControl(this.Draw)
		map.on('draw.update', function(params) {
			let documents = params.features.map((v) => {
				return {
					updateCondition: { _id: v.id },
					updateSetValue: { geometry: v.geometry }
				}
			})
			let data = {
				datasetId: _this.getDataId(),
				documents
			}
			_this.ajaxRequest('http://cloud.piesat.cn/api/v1/mongo/feature/updateList', data, 'post').then((res) => {
				_this.map.getSource(_this.layerId).refresh()
			})
		})

		document.onkeydown = function(e) {
			if (e.keyCode == 16) _this.moreSelect = true
		}
		document.onkeyup = function() {
			_this.moreSelect = false
		}

		this.map.on('click', function(e) {
			if (_this.action != 'simple_select') return
			let distinct = _this.getMapScope(e.lngLat, e.point, 10) * 111 * 1000
			let { lng, lat } = e.lngLat
			let data = {
				lon: lng,
				lat,
				distinct,
				// projectionCode: 3857,
				datasetId: _this.getDataId(),
				output: 'geojson'
			}
			_this
				.ajaxRequest('http://cloud.piesat.cn/geographic_search/v1/geocode/point/query_near', data, 'get')
				.then((res) => {
					if (res.features.filter((item) => _this.Draw.getSelectedIds().indexOf(item.id) > -1).length > 0)
						return
					_this.Draw.changeMode(_this.action)
					if (res.features.length == 0 || _this.moreSelect == false) {
						_this.deleteAll()
						_this.selectArr = []
					}
					_this.addFeature(res)
				})
		})
	}
	getDataId() {
		let name = this.dtName
		return name
	}
	drawCreateAjax(e) {
		let data = this.Draw.getAll()
		data.datasetId = this.drawId
		let _this = this
		this.ajaxRequest('http://cloud.piesat.cn/api/v1/mongo/feature/add', data, 'post').then((res) => {
			_this.Draw.changeMode(_this.action)
			_this.Draw.delete(data.features[0].id)
			_this.map.getSource(_this.layerId).refresh()
		})
	}
	setAction(drawmode) {
		if (!drawmode || drawmode == this.action) return
		this.action = drawmode
		this.Draw.deleteAll()
		this.Draw.changeMode(this.action)
		this.drawCreate()
	}
	drawCreate() {
		let _this = this
		if (this.addEvent) return
		this.map.on('draw.create', function(params) {
			_this.drawId = _this.getDataId()
			_this.drawCreateAjax()
			_this.addEvent = true
		})
	}

	addFeature(feature) {
		if (feature.features.length > 0) {
			this.Draw.add(feature)
			this.changId = feature.features[0].id
			this.properties = feature.features[0].properties
			this.selectArr = this.selectArr.concat(feature.features)
			let ids = this.selectArr.map((v) => {
				return v.id
			})
			this.Draw.setSelected(ids)
		}
	}

	getProperties() {
		//获取属性
		return this.properties
	}

	setProperties(properties) {
		//修改属性
		console.log(properties)
		let data = {
			datasetId: this.getDataId(),
			// projectCode: 3857,
			updateCondition: {
				_id: this.changId
			},
			updateSetValue: { ...properties }
		}
		this.ajaxRequest('http://cloud.piesat.cn/api/v1/mongo/feature/update', data, 'post').then((res) => {
			this.map.getSource(this.layerId).refresh()
		})
	}

	ajaxRequest(url, data = {}, action) {
		return new Promise(function(resolve) {
			let xhr = new XMLHttpRequest()
			xhr.onreadystatechange = () => {
				if (xhr.readyState == 4) {
					if (xhr.status == 200) {
						var res = xhr.response
						let data = JSON.parse(res).data
						resolve(data)
					}
				}
			}

			let parms = ''
			if (action == 'get') {
				let dataKey = Object.keys(data)
				dataKey.map((v) => {
					parms += `${v}=${data[v]}&`
				})
				url += '?' + parms.substring(0, parms.length - 1)
			}
			parms = action == 'post' ? JSON.stringify(data) : ''
			xhr.open(action, url, true)
			xhr.setRequestHeader('content-type', 'application/json')
			xhr.setRequestHeader('Authorization', localStorage.getItem('token'))
			xhr.send(parms)
		})
	}

	getSelectedIds() {
		return this.Draw.getSelectedIds()
	}

	getSelected() {
		return this.Draw.getSelected()
	}

	refresh() {
		return this.map.getSource(this.layerId).refresh()
	}

	delete(featureIds) {
		console.log(featureIds)
		return this.Draw.delete(featureIds)
	}

	getSelectedPoints() {
		return this.Draw.getSelectedPoints()
	}

	getMode() {
		return this.Draw.getMode()
	}

	trash() {
		return this.Draw.trash()
	}

	deleteAll() {
		return this.Draw.deleteAll()
	}

	changeLayer(layerId) {
		this.layerId = layerId
		this.dtName = layerId
		this.deleteAll()
	}

	getMapScope(lngLat, px, scope = 10) {
		let point = {}
		point.x = px.x + scope
		point.y = px.y
		let newLngLat = this.map.unproject(point)
		return Math.sqrt(Math.pow(newLngLat.lng - lngLat.lng, 2) + Math.pow(newLngLat.lat - lngLat.lat, 2))
	}
	breakCanvas(callback = function() {}) {
		let _this = this
		let canvas = document.createElement('canvas')
		let mapCanvas = document.querySelector('.mapboxgl-canvas')
		canvas.width = mapCanvas.width
		canvas.height = mapCanvas.height
		canvas.style.cssText = 'position:absolute;z-index:1;top:0;left:0;'
		document.body.appendChild(canvas)
		let breakcontext = canvas.getContext('2d')
		let startArr = []
		canvas.addEventListener('click', canvasClick)
		canvas.addEventListener('dblclick', canvasDbclick)
		function canvasClick(e) {
			let start = {}
			start.x = e.x
			start.y = e.y
			startArr.push(start)
			canvas.addEventListener('mousemove', canvasMove, false)
		}
		function canvasMove(e) {
			breakcontext.clearRect(0, 0, mapCanvas.width, mapCanvas.height)
			breakcontext.beginPath()
			breakcontext.moveTo(startArr[0].x, startArr[0].y)
			startArr.map((v) => {
				breakcontext.lineTo(v.x, v.y)
			})
			breakcontext.lineTo(e.x, e.y)
			// breakcontext.closePath()
			breakcontext.stroke()
		}
		function canvasDbclick(e) {
			canvas.removeEventListener('mousemove', canvasMove, false)
			let lnglatString = ''
			let lnglatArr = startArr.map((v) => {
				let lngLat = _this.map.unproject(v)
				lnglatString += lngLat.lng + ',' + lngLat.lat + ';'
				return lngLat
			})
			startArr = []
			lnglatString = lnglatString.substring(0, lnglatString.length - 1)
			callback(lnglatArr)
			canvas.remove()
			let data = {
				datasetId: _this.getDataId(),
				polygonId: _this.changId,
				line: lnglatString
			}
			console.log('TCL: canvasDbclick -> _this.layerId', _this.layerId)
			_this.ajaxRequest('http://cloud.piesat.cn/api/v1/mongo/feature/split_polygon', data, 'get').then((res) => {
				_this.map.getSource(_this.layerId).refresh()
			})
		}
	}
}

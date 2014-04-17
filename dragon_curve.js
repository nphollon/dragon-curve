var computeLeftPoint = function (startPoint, endPoint) {
	return {
		x: 0.5 * (endPoint.y - startPoint.y + endPoint.x + startPoint.x),
		y: 0.5 * (endPoint.y + startPoint.y - endPoint.x + startPoint.x)
	}
}

var computeRightPoint = function (startPoint, endPoint) {
	return {
		x: 0.5 * (-endPoint.y + startPoint.y + endPoint.x + startPoint.x),
		y: 0.5 * ( endPoint.y + startPoint.y + endPoint.x - startPoint.x)
	}
}

var lastElement = function (array) {
	return array[array.length - 1]
}

var concatNewPoints = function (accumulator, endPoint) {
	var rule = accumulator.alternator ? computeLeftPoint : computeRightPoint
	var midPoint = rule(lastElement(accumulator.points), endPoint)
	return {
		points: accumulator.points.concat(midPoint, endPoint),
		alternator: !accumulator.alternator
	}
}

var evolveCurve = function (points) {
	var firstPoint = points[0]
	var endPoints = points.slice(1)

	return endPoints.reduce(concatNewPoints,
		{ points: [firstPoint], alternator: true }
	).points
}

var generateCurve = function (n, points) {
	if (n <= 0) {
		return points
	}
	return evolveCurve(generateCurve(n-1, points))
}

var Renderer = function (canvas) {
	this.canvas = canvas
}

Renderer.prototype.drawCurve = function (points) {
	var context = canvas.getContext("2d")

	context.strokeStyle = "blue"
    context.beginPath()
    context.moveTo(points[0].x, points[0].y)

    points.forEach(function (point) {
		context.lineTo(point.x, point.y)
	})

    context.stroke()
}

;(function () {
	points = generateCurve(13, [
		{ x: 125, y: 210 },
		{ x: 425, y: 390 }
	])

	var renderer = new Renderer(document.getElementById("canvas"))
	renderer.drawCurve(points)
}())
;
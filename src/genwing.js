import * as THREE from "three"

export const createAirfoilProfile = (scene) => {
	let airfoilPlanes = []

	for (let i = -2; i < 2.5; i += 0.5) {
		let points = generateNACAProfile(i)
		airfoilPlanes.push(points)

		let geometry = new THREE.BufferGeometry().setFromPoints(points)
		let material = new THREE.LineBasicMaterial({
			color: 0x00ff00,
			linewidth: 3,
		})
		let airfoilProfile = new THREE.Line(geometry, material)
		scene.add(airfoilProfile)
	}

	return airfoilPlanes
}

export const createSurfaceMesh = (loftLinePoints, scene) => {
	let geometry = new THREE.Geometry()

	let material = new THREE.MeshPhongMaterial({
		//color: new THREE.Color("blue"),
		//emissive: new THREE.Color("blue"),
		shininess: 30,
		side: THREE.DoubleSide,
		//flatShading: true,
		//opacity: 1,
		//depthTest: true,
		//depthWrite: true,
		//specular: 0x161515,
		//fog: true,
		//reflectivity: 1,
		//refractionRatio: 0.98
	})

	for (let points of loftLinePoints) {
		geometry.vertices.push(...points)
	}

	let lineLength = loftLinePoints[0].length
	let numberOfLines = loftLinePoints.length
	for (let i = 0; i < numberOfLines - 1; i += 1) {
		for (let j = 0; j < lineLength - 1; j += 1) {
			let p1 = j + i * lineLength
			let p2 = j + 1 + i * lineLength
			let p3 = j + (i + 1) * lineLength
			let p4 = j + 1 + (i + 1) * lineLength
			// console.log(p1, p2, p3)
			let face = new THREE.Face3(p1, p2, p3)
			geometry.faces.push(face)
			// Not the order is important to get the right normal for the lighting conditions.
			face = new THREE.Face3(p3, p2, p4)
			geometry.faces.push(face)
		}
	}

	geometry.computeFaceNormals()
	geometry.computeVertexNormals()
	// geometry.computeBoundingSphere()
	let mesh = new THREE.Mesh(geometry, material)
	// console.log(mesh)

	scene.add(mesh)
}

export const createLoftLines = (airfoilPlanes, scene) => {
	const loftLinePoints = []

	for (let i = 0; i < airfoilPlanes[0].length; i += 1) {
		let splinePoints = []
		for (let plane of airfoilPlanes) {
			splinePoints.push(plane[i])
		}

		let curve = new THREE.CatmullRomCurve3(splinePoints)
		let points = curve.getPoints(60)

		loftLinePoints.push(points)

		let geometry = new THREE.BufferGeometry().setFromPoints(points)
		let material = new THREE.LineBasicMaterial({
			color: 0x00ff00,
			linewidth: 3,
		})
		let loftLine = new THREE.Line(geometry, material)

		scene.add(loftLine)
	}

	return loftLinePoints
}

// Generate a NACA Profile
const generateNACAProfile = (z) => {
	const NACA = "2412"
	const M = parseFloat(NACA[0]) / 100
	const P = parseFloat(NACA[1]) / 10
	const T = parseFloat(NACA.substring(2)) / 100

	const points = []
	const scalingFactor = 3

	let xCamber = 0
	let yThickness = 0

	const a0 = 0.2969
	const a1 = -0.126
	const a2 = -0.3516
	const a3 = 0.2843
	const a4 = -0.1036

	const xDelta = 0.5 + Math.random() / 6
	const yDelta = 0.2 + Math.random() / 8

	for (let beta = 0; beta < Math.PI; beta += 0.2) {
		xCamber = (1 - Math.cos(beta)) / 2

		yThickness =
			(T / 0.2) *
			(a0 * xCamber ** 0.5 +
				a1 * xCamber +
				a2 * xCamber ** 2 +
				a3 * xCamber ** 3 +
				a4 * xCamber ** 4)

		// Adding the minus -0.5 to centre it in the view

		if (beta == 0) {
			points.push(
				new THREE.Vector3(
					(xCamber - xDelta) * scalingFactor,
					(yThickness + yDelta) * scalingFactor,
					z
				)
			)
		} else {
			points.push(
				new THREE.Vector3(
					(xCamber - xDelta) * scalingFactor,
					(yThickness + yDelta) * scalingFactor,
					z
				)
			)
			points.unshift(
				new THREE.Vector3(
					(xCamber - xDelta) * scalingFactor,
					(-yThickness + yDelta) * scalingFactor,
					z
				)
			)
		}
	}

	return points
}

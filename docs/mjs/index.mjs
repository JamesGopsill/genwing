import * as THREE from "https://unpkg.com/three@0.119.1/build/three.module.js"

import { generateNACAProfile } from "./naca.mjs"
// import { OrbitControls } from "./orbitcontrols.mjs"


const init = () => {
	// Create the scene
	const scene = new THREE.Scene()
	scene.rotation.x += 0.6
	scene.rotation.y += 0.7
	const color = 0xFFFFFF
	const intensity = 1
	
	const topLight = new THREE.DirectionalLight(color, intensity)
	topLight.position.set(5, 5, 0)
	topLight.target.position.set(0, 0, 0)
	scene.add(topLight)
	scene.add(topLight.target)

	const bottomLight = new THREE.DirectionalLight(color, intensity)
	bottomLight.position.set(-5, -5, 0)
	bottomLight.target.position.set(0, 0, 0)
	scene.add(bottomLight)
	scene.add(bottomLight.target)

	scene.background = new THREE.Color( "gray" )

	// Create the camera
	const camera = new THREE.PerspectiveCamera(
		75, 
		window.innerWidth / window.innerHeight, 
		0.1, 
		1000
	)
	// Set the camera's position
	camera.position.z = 5

	// Create the renderer
	var renderer = new THREE.WebGLRenderer({
		antialias: true
	})
	setSize(renderer)

	// Append it to the body
	document.getElementById("viewer").appendChild(renderer.domElement)

	// Create the profiles
	const airfoilPlanes = createAirfoilProfile(scene)
	const loftLinePoints = createLoftLines(airfoilPlanes, scene)
	createSurfaceMesh(loftLinePoints, scene)

	// render the scene
	renderer.render( scene, camera )

	window.onresize = (event) => {
		setSize(renderer)
	}

	const animate = () => {
		requestAnimationFrame( animate );
		scene.rotation.x += 0.001;
		scene.rotation.y += 0.002;
		renderer.render( scene, camera );
	}

	animate()

	document.getElementById("generate").onclick = () => {
		let flag = true
		while (flag) {
			for (let child of scene.children) {
				//console.log(child)
				if (child.type != "DirectionalLight") {
					scene.remove(child)
				}
			}
			if (scene.children.length == 2) {
				flag = false
			}
		}
		// Recreate scene
		const airfoilPlanes = createAirfoilProfile(scene)
		const loftLinePoints = createLoftLines(airfoilPlanes, scene)
		createSurfaceMesh(loftLinePoints, scene)
	};

}

const setSize = (renderer) => {
	console.log(document.getElementById("viewer").offsetWidth)
	renderer.setSize(
		document.getElementById("viewer").offsetWidth-40, 
		500
	)
}


const createAirfoilProfile = (scene) => {

	let airfoilPlanes = []

	for (let i = -2; i < 2.5; i += 0.5) {
		let points = generateNACAProfile(i);
		airfoilPlanes.push(points);
	
		let geometry = new THREE.BufferGeometry().setFromPoints( points );
		let material = new THREE.LineBasicMaterial( { 
			color : 0x00ff00,
			linewidth: 3 
		} );
		let airfoilProfile = new THREE.Line( geometry, material );
		scene.add(airfoilProfile);
	}

	return airfoilPlanes
	
}

const createLoftLines = (airfoilPlanes, scene) => {
	var loftLinePoints = [];

	for (let i = 0; i < airfoilPlanes[0].length; i += 1) {
		let splinePoints = []
		for (let plane of airfoilPlanes) {
			splinePoints.push(plane[i]);
		}
		
		let curve = new THREE.CatmullRomCurve3( splinePoints );
		let points = curve.getPoints( 60 );
		
		loftLinePoints.push(points);
		
		let geometry = new THREE.BufferGeometry().setFromPoints( points )
		let material = new THREE.LineBasicMaterial( { 
			color : 0x00ff00,
			linewidth: 3 
		} );
		let loftLine = new THREE.Line( geometry, material );
		
		scene.add(loftLine);
	}

	return loftLinePoints
}

const createSurfaceMesh = (loftLinePoints, scene) => {
	let geometry = new THREE.Geometry();

	let material = new THREE.MeshPhongMaterial({ 
		//color: new THREE.Color("blue"),
		//emissive: new THREE.Color("blue"),
		shininess: 70,
		side: THREE.DoubleSide,
		//flatShading: true,
		//opacity: 1,
		//depthTest: true,
		//depthWrite: true,
		//specular: 0x161515,
		//fog: true,
		//reflectivity: 1,
		//refractionRatio: 0.98
	});

	for (let points of loftLinePoints) {
		geometry.vertices.push(...points)
	}
	
	let lineLength = loftLinePoints[0].length
	let numberOfLines = loftLinePoints.length
	for (let i = 0; i < numberOfLines - 1; i += 1) {
		for (let j = 0; j < lineLength - 1; j += 1) {
			let p1 = j+(i*lineLength);
			let p2 = j+1+(i*lineLength);
			let p3 = j+((i+1)*lineLength);
			let p4 = j+1+((i+1)*lineLength);
			// console.log(p1, p2, p3)
			let face = new THREE.Face3( p1, p2, p3 );
			geometry.faces.push( face );
			// Not the order is important to get the right normal for the lighting conditions.
			face = new THREE.Face3( p3, p2, p4 ); 
			geometry.faces.push( face );
		}
	}
	
	geometry.computeFaceNormals()
	geometry.computeVertexNormals()
	// geometry.computeBoundingSphere()
	let mesh = new THREE.Mesh( geometry, material )
	console.log(mesh)
	
	scene.add( mesh )
}

init()

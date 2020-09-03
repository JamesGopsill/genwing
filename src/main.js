import "bootstrap"
import "bootstrap/dist/css/bootstrap.css"
import "@fortawesome/fontawesome-free/css/all.css"
import * as THREE from "three"
import hljs from "highlight.js/lib/core"
//import javascript from "highlight.js/lib/languages/javascript"
//import json from "highlight.js/lib/languages/json"
import "highlight.js/styles/github.css"

import {
	createAirfoilProfile,
	createLoftLines,
	createSurfaceMesh,
} from "./genwing"

import "./style.css"

const main = () => {
	console.log("Hello from Main")

	//hljs.registerLanguage("javascript", javascript)
	//hljs.registerLanguage("json", json)
	hljs.initHighlightingOnLoad()

	// Create the scene
	const scene = new THREE.Scene()
	scene.rotation.x += 0.6
	scene.rotation.y += 0.7
	const color = 0xffffff
	const intensity = 1

	// Create a directional light above the wing
	const topLight = new THREE.DirectionalLight(color, intensity)
	topLight.position.set(5, 5, 0)
	topLight.target.position.set(0, 0, 0)
	scene.add(topLight)
	scene.add(topLight.target)

	// Create a directional light below the wing
	const bottomLight = new THREE.DirectionalLight(color, intensity)
	bottomLight.position.set(-5, -5, 0)
	bottomLight.target.position.set(0, 0, 0)
	scene.add(bottomLight)
	scene.add(bottomLight.target)

	// Set the scene background
	scene.background = new THREE.Color("white")

	// Create the camera
	const camera = new THREE.OrthographicCamera(
		6 / -2,
		6 / 2,
		6 / 2,
		6 / -2,
		1,
		1000
	)

	// Set the camera's position
	camera.position.z = 5

	// Create the renderer
	var renderer = new THREE.WebGLRenderer({ antialias: true })
	setSize(renderer)

	// Append it to the div with id viewer
	document.getElementById("viewer").appendChild(renderer.domElement)

	// Create the wing
	const airfoilPlanes = createAirfoilProfile(scene)
	const loftLinePoints = createLoftLines(airfoilPlanes, scene)
	createSurfaceMesh(loftLinePoints, scene)

	// render the scene
	renderer.render(scene, camera)
	window.onresize = (event) => {
		setSize(renderer)
	}

	// animation function
	const animate = () => {
		requestAnimationFrame(animate)
		scene.rotation.x += 0.001
		scene.rotation.y += 0.002
		renderer.render(scene, camera)
	}
	// Animate the scene
	animate()

	// Add listener to generate button
	document.getElementById("generate").onclick = () => {
		console.log("Generate New Wing")
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
	}
}

// Resize the scene based on the
const setSize = (renderer) => {
	// console.log(document.getElementById("viewer").offsetWidth)
	let width = document.getElementById("viewer").offsetWidth - 40
	if (width > 800) {
		width = 800
	}
	const height = (width / 4) * 3
	renderer.setSize(width, height)
}

main()

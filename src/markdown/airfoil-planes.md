Now we have our viewer all set-up and visualising our geometry, we can start to construct the functions that will create our airfoil. We will start by creating a number of 2D splines that will form the planes of our airfoil geometry.

In the `src` folder, create a new file and call it `airfoil.js`. In this file, add:

```
import * as THREE from "three"

// Creating a number of planes for our airfoil
export const generateAirfoilPlanes = (scene) => {

	// Create an empty array
	let airfoilPlanes = []

	// For increments along the z-axis
	for (let i = -2; i < 2.5; i += 0.5) {

		// Generate a NACA profile
		let points = generateNACAProfile(i)

		// Add these points to the array of airfoil planes
		airfoilPlanes.push(points)

		// Visualise the lines in the scene
		let geometry = new THREE.BufferGeometry().setFromPoints(points)
		let material = new THREE.LineBasicMaterial({
			color: 0x00ff00,
			linewidth: 3,
		})
		let airfoilProfile = new THREE.Line(geometry, material)
		scene.add(airfoilProfile)
	}

	// return the array of airfoil planes
	return airfoilPlanes
}
```

Again, we import three.js so we can use its functionality when building our own functions. We then create a function called `generateAirfoilPlanes` and also place `export` in front of it so we can later import it into our `main.js` file.

The function takes the scene as an input and starts by creating an empty array where we are going to be storing all the points for our airfoil planes. We then enter an for loop to increment along the z-axis. At each point along, we generate a NACA airfoil profile using `generateNACAProfile(i)` and provide it with the location along the z-axis.

We then append these points to the airfoilPlanes array and create some line geometry to visualise these points in our scene. This procedure is very much the same as one would do when creating a sketch on a plane in CAD. Here, we creating sketches on multiple planes.

The function then returns the array of planes we have created.

We mentioned that this function calls `generateNACAProfile` so where is this function? Well we need to create it so lets do this now. In the same file add:

```
// Generate a NACA Profile
const generateNACAProfile = (z) => {

	// Set a NACA profile
	const NACA = "2412"
	const M = parseFloat(NACA[0]) / 100
	const P = parseFloat(NACA[1]) / 10
	const T = parseFloat(NACA.substring(2)) / 100

	// Create an empty array of points
	const points = []

	// Apply a ScalingFactor so we can see it in our view
	const scalingFactor = 3

	// Initiate some variables for the camber and thickness
	let xCamber = 0
	let yThickness = 0

	// Set the constants for NACA profile definition
	const a0 = 0.2969
	const a1 = -0.126
	const a2 = -0.3516
	const a3 = 0.2843
	const a4 = -0.1036

	// Randomly peturb the position of the profile in relation to the x and y axes (This is where one could drive the generation process)
	const xDelta = 0.5 + Math.random() / 6
	const yDelta = 0.2 + Math.random() / 8

	// Let generate the points along the profile cycling round the profile in radians
	for (let beta = 0; beta < Math.PI; beta += 0.2) {

		xCamber = (1 - Math.cos(beta)) / 2

		yThickness =
			(T / 0.2) *
			(a0 * xCamber ** 0.5 +
				a1 * xCamber +
				a2 * xCamber ** 2 +
				a3 * xCamber ** 3 +
				a4 * xCamber ** 4)

		// Add the points to the array
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

	// Return the array of points
	return points
}
```

This function simply takes a NACA 4-digit specification and computes its geometry. The equations can be found [here](http://airfoiltools.com/airfoil/naca4digit). In this example, we randomly perturb the placement of these profiles that will result in different profiles each time we run it.

The last thing we need to do is add it into our `main.js`. At the top of the file, we add

```
import { generateAirfoilPlanes } from "./airfoil"
```

and we remove the `//Create a box` code and replace it with

```
// Create a airfoil planes
const airfoilPlanes = generateAirfoilPlanes(scene)
scene.add( airfoilPlanes );
```

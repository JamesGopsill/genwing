Now we have the planes of our wing, we need to find a way to join them up. And we will achieve this by producing splines that join the respective points of each profile up. This in commonly referred to as the generation of rails in CAD and once you have them, you can loft between the profiles. Having generated the profiles in a consistent manner with the same number of points makes it a simple case of joining the dots.

In our `airfoil.js` file, lets add the following function.

```
export const generateRails = (airfoilPlanes, scene) => {
	const loftLinePoints = []

	// for each point along the airfoil profiles
	for (let i = 0; i < airfoilPlanes[0].length; i += 1) {

		// create an array featuring the points from their respective profiles
		let splinePoints = []
		for (let plane of airfoilPlanes) {
			splinePoints.push(plane[i])
		}

		// Creating a spline through these points
		let curve = new THREE.CatmullRomCurve3(splinePoints)
		// Return points from the spline curve
		let points = curve.getPoints(60)

		// Add it to the loft line points
		loftLinePoints.push(points)

		//  Visualise the lines
		let geometry = new THREE.BufferGeometry().setFromPoints(points)
		let material = new THREE.LineBasicMaterial({
			color: 0x00ff00,
			linewidth: 3,
		})
		let loftLine = new THREE.Line(geometry, material)

		// and add to the scene
		scene.add(loftLine)
	}

	return loftLinePoints
}
```

This function uses the profiles we have previously generated and iterates through them to create a spline that joins the respective profile points together. Splines are particularly powerful tools that help us maintain and control [surface continuity](https://technologyinarchitecture.com/surface-continuity/). Something that would be worth looking into if you're creating surface geometry. These lines are then return for further processing to form the surface mesh.

To all this and visualise in our scene, we need to import and call the function into our `main.js`.

```
- import { generateAirfoilPlanes } from "./airfoil"
+ import { generateAirfoilPlanes, generateRails } from "./airfoil"
```

and add

```
// Create a airfoil planes
const airfoilPlanes = generateAirfoilPlanes(scene)
scene.add( airfoilPlanes );

// Add the rails
const rails = generateRails(airfoilPlanes, scene)
scene.add( rails );
```

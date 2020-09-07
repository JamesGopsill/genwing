The final aspect in creating the airfoil is to visualise its surface. We will achieve this by creating a mesh over the geometry we have created. In CAD, you may have seen functions such as lofts achieve this goal.

In our `airfoil.js` file add the following

```
export const createSurfaceMesh = (rails, scene) => {
	// Create some empty geometry
	let geometry = new THREE.Geometry()

	// Create a material
	let material = new THREE.MeshPhongMaterial({
		shininess: 30,
		side: THREE.DoubleSide,
	})

	// Add all the points to the geometry
	for (let points of rails) {
		geometry.vertices.push(...points)
	}

	// Iterate through our loft lines and create our triangles for the mesh
	let lineLength = rails[0].length
	let numberOfLines = rails.length
	for (let i = 0; i < numberOfLines - 1; i += 1) {
		for (let j = 0; j < lineLength - 1; j += 1) {
			let p1 = j + i * lineLength
			let p2 = j + 1 + i * lineLength
			let p3 = j + (i + 1) * lineLength
			let p4 = j + 1 + (i + 1) * lineLength
			let face = new THREE.Face3(p1, p2, p3)
			geometry.faces.push(face)
			face = new THREE.Face3(p3, p2, p4)
			geometry.faces.push(face)
		}
	}

	geometry.computeFaceNormals()
	geometry.computeVertexNormals()

	// Create the mesh
	let mesh = new THREE.Mesh(geometry, material)

	// and add it to the scene
	scene.add(mesh)
}
```

This function creates some geometry that includes all the points that feature in our rails and then creates the triangles between the points. The mesh is then generated and added to our scene.

All we need to do now is add it to our `main.js` file.

```
- import { generateAirfoilPlanes, generateRails } from "./airfoil"
+ import { generateAirfoilPlanes, generateRails, createSurfaceMesh } from "./airfoil"
```

and call it after we have created the rails.

```
// Add the rails
const rails = generateRails(airfoilPlanes, scene)
scene.add( rails );

// Add the mesh
createSurfaceMesh(rails, scene)
```

And there you have it, a randomly generate wing profile. It should generate a new profile every time you refresh the page.

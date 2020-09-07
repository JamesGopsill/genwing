Now we want to create a 3D scene that will visualise our generative wing profile. First, let's edit the `index.html` file and remove the `<h1>Hello</h1>` and add `<div id="viewer"></div>` so it should look like the snippet below.

```
<!DOCTYPE html>
<html lang="en">
	<head>
	</head>
	<body>
		<div id="viewer"></div>
		<script src="main.js"></script>
	</body>
</html>
```

The div will be used by our javascript to render our view to.

Next, we want to modify our `main.js` as shown:

```
import * as THREE from "three"

const main = () => {
	// Create the scene
	const scene = new THREE.Scene()
	scene.rotation.x += 0.6
	scene.rotation.y += 0.7
	const color = 0xffffff
	const intensity = 1

	// Set the scene background
	scene.background = new THREE.Color("cyan")

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
	const renderer = new THREE.WebGLRenderer({
		antialias: true
	})

	// Set the renderer size
	renderer.setSize(400, 300)

	// add it to the viewer div in the html
	document.getElementById("viewer").appendChild(renderer.domElement)

	// Create a box
	const geometry = new THREE.BoxGeometry(1, 1, 1);
	const material = new THREE.MeshBasicMaterial({
		color: 0x00ff00
	});
	const cube = new THREE.Mesh(geometry, material);
	scene.add( cube );

	// render the scene
	renderer.render(scene, camera)

}

main()
```

Now, there are a lot of changes, so lets go through them one by one. The line change `import * as THREE from "three"` imports Three.js into our code so we can use its tools to produce 3D visualisations.

Then in our main, we start by creating the scene:

```
// Create the scene
const scene = new THREE.Scene()
scene.rotation.x += 0.6
scene.rotation.y += 0.7
const color = 0xffffff
const intensity = 1

// Set the scene background
scene.background = new THREE.Color("cyan")
```

Followed by the camera that will view the scene:

```
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
```

We then create the renderer that will render the scene and link it to the div in the html:

```
// Create the renderer
const renderer = new THREE.WebGLRenderer({
	antialias: true
})

// Set the renderer size
renderer.setSize(400, 300)

// add it to the viewer div in the html
document.getElementById("viewer").appendChild(renderer.domElement)
```

Then add some geometry and add it to the scene:

```
// Create a box
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
	color: 0x00ff00
});
const cube = new THREE.Mesh(geometry, material);
scene.add( cube );
```

and finally call the scene to render:

```
// render the scene
renderer.render(scene, camera)
```

You should see something like this appear.

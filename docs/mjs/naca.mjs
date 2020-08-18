import * as THREE from "https://unpkg.com/three@0.119.1/build/three.module.js"

// Generate a NACA Profile
export const generateNACAProfile = (z) => {
	const NACA = "2412";
	const M = parseFloat(NACA[0]) / 100;
	const P = parseFloat(NACA[1]) / 10;
	const T = parseFloat(NACA.substring(2)) / 100;

	const points = [];
	const scalingFactor = 3.;

	let xCamber = 0.;
	let yThickness = 0.;

	const a0 = 0.2969;
	const a1 = -0.126;
	const a2 = -0.3516;
	const a3 = 0.2843;
	const a4 = -0.1036;

	const xDelta = 0.5 + Math.random() / 6;
	const yDelta = 0.2 + Math.random() / 8;

	for (let beta = 0.; beta < Math.PI; beta += 0.2) {
		xCamber = (1 - Math.cos(beta)) / 2;

		yThickness = (T / 0.2) * (a0*xCamber**0.5 + a1*xCamber + a2*xCamber**2 + a3*xCamber**3 + a4*xCamber**4);

		// Adding the minus -0.5 to centre it in the view

		if ( beta == 0 ) {
			points.push(new THREE.Vector3((xCamber-xDelta)*scalingFactor, (yThickness+yDelta)*scalingFactor, z))
		} else {
			points.push(new THREE.Vector3((xCamber-xDelta)*scalingFactor, (yThickness+yDelta)*scalingFactor, z))
			points.unshift(new THREE.Vector3((xCamber-xDelta)*scalingFactor, (-yThickness+yDelta)*scalingFactor, z))
		}
	}

	return points
	
}
A good place to start is to create some templates that we will be building from. First, let's create a new folder in our project and name it `src` and in this folder create two files `index.html` and `main.js`.

In the `index.html` file put:

```
<!DOCTYPE html>
<html lang="en">
	<head>
	</head>
	<body>
		<h1>Hello</h1>
		<script src="main.js"></script>
	</body>
</html>
```

And in the `main.js` file add.

```
const main = () => {
	console.log("World")
}

main()

```

Open a terminal at the top-level project folder, run `yarn start` and the project should build and tell you that the server is running at `http://localhost:1234`.

Open this in your browser and you should find a page saying Hello World, which has come from the `index.html` file. And if you right-click and inspect element, this will bring up the web developer view and if you click console, you should see World, which has come from the main function we have created and called from Javascript file.

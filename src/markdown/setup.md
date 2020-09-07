To build this app, you will need to have [Node.js](https://nodejs.org/en/) installed on your PC with either NPM (comes with the Node.js install) or Yarn package manager. With these installed, create a folder and open a terminal and your favourite text editor at the folder (I recommend VS Code).

Using the terminal, enter:

```
yarn init -y
```

This will create a `package.json` in the directory containing the details of our project.

No we can install our projects' dependencies and development dependencies.

```
yarn add three

yarn add -D parcel-bundler prettier
```

You will see a `node_modules` folder appear in your project folder.

Three (Three.js) is the library will be using to create and visualise our generative wing.

To develop our application, we will be using parcel to bundle all our code and its dependencies together so we can easily deploy it on the web, and prettier to clean up the formatting of our code.

In our `package.json`, add the following json to give use quick access to the tools for developing and prettifying our code.

```
"scripts": {
	"start": "parcel src/index.html",
	"prettify": "prettier --write src/**"
}
```

Now create a `.prettierrc.json` and add the styling your would like your code to conform. Here are the options we use in this tutorial.

```
{
	"semi": false,
	"useTabs": true,
	"tabWidth": 2
}
```

Now we are all set to start developing our demonstrator.

# SoudVibes

## What is it?

SoundVibes is a music streaming platform built using the MERN stack.

## Why?

This is a solo school project undertaken entirely by myself to learn React and have some fun.

## Table of Contents

- [Installation](#installation)
- [Usage (dev)](#development-usage)
- [Usage (prod)](#production-usage)
- [Project links](#links)

## Installation

### Backend

Navigate to the `backend` directory and install the necessary dependencies:

```bash
cd backend
npm install
```

Create the `.env` file following the structure of the example `.env~`.

### Frontend

Navigate to the `frontend` directory and install the necessary dependencies:

```bash
cd frontend
npm install
```

## Development Usage

### Backend

Navigate to the `backend` directory and execute `index.js`:

```bash
cd backend
npm run dev
```

### Frontend

Navigate to the `frontend` directory and launch the react app:

```bash
cd frontend
npm start
```

## Production Usage

### Build project

After following the installation steps, go back to the project root directory.

- Run the `build.sh` script:

```bash
./build.sh
```

- You can also perform the building process manually:

```bash
cd frontend
npm run build
cd ../backend
npm run build
cd ../
```

*Note that the build.sh script will check a few things to minimize errors, while doing it yourself, you are on your own!*

The build output is located in the `./build` folder:
- `./build/server.js` and `./build/songs` are used for the backend
- `./build/client` is the frontend part

### Lauch builded app

**Using Default Server Configuration**

execute the `./build/server.js` file:

```bash
cd build
node server
```

**Custom Configuration**

You can split the frontend and backend as you wish, then execute each part

separately. For example, after restructuring folders:

```bash
cd build/backend
node server
```

```bash
cd build/frontend
npm install -g serve
serve -s
```

## Links

- 📡[Github](https://github.com/maxime-mrl/soundvibes)

##

[![GitHub Stars](https://img.shields.io/github/stars/maxime-mrl/soundvibes.svg)](https://github.com/maxime-mrl/soundvibes/stargazers)
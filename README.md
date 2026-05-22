# HPCer Clusters
Document for HPC clusters of **High Performance Computing and Data Engineering Lab**.

## Installation

```bash
bun
```

## Local Development

```bash
bun start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
bun run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true bun deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> bun deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.

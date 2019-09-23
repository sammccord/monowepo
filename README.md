# monowepo
An example monorepo using lerna and yarn workspaces

#### Top Level Workspace Scripts

Run `yarn NAME` from the root of this repository

```json
"scripts": {
  "clean": "lerna run clean && lerna clean && yarn cache clean && yarn",
  "commit": "git-cz",
  "build": "lerna run build --scope @sammccord/monowepo.services.* --include-filtered-dependencies",
  "build:packages": "lerna run build --scope @sammccord/monowepo.packages.* --parallel",
  "dev": "yarn build:packages && yarn dev:services",
  "dev:services": "lerna run dev --parallel --scope @sammccord/monowepo.services.* --include-filtered-dependencies",
  "sync": "yarn && yarn build:packages",
  "semantic-release": "semantic-release"
}
```

### Javascript Monorepo with Yarn Workspaces and Lerna

- _https://lernajs.io/_
- _https://yarnpkg.com/lang/en/docs/workspaces/_

A common problem in large Javascript projects is development workflow while iterating on both modules and their consumers at the same time.

`Yarn Workspaces` hoists all `package.json` dependencies to the root of the project, flattens, and de-dupes, saving on network requests and large nested file trees.

`Lerna` is a CLI tool that orchestrates Javascript monorepos. It's configured to know that all our javascript projects with `package.json`'s reside in `packages` and `services` directories, so when we run:

```sh
lerna run dev --scope @sammccord/monowepo.services.api --parallel --include-filtered-dependencies
```

we instruct lerna to execute the `dev` npm script listed in `services/api/package.json`. In addition, `--include-filtered-dependencies` will run the `dev` npm script in any local workspace dependency listed in `services/api/package.json`. Our `api` service lists:

```json
"@sammccord/monowepo.packages.common": "^0.0.0",
```

as a dependency, so `dev` will also be run in `packages/common`.

Thanks to `Yarn workspaces`, when code in `services/api` wants to import our `api` package, node will look up `@sammccord/monowepo.packages.common` in the `node_modules` in the project root, and will find it symlinked back down to `packages/common` so our `api` code will always be referencing the latest local build of the common package.

We encourage that Javascript projects in the monorepo implement a few common npm scripts to maintain maximum interoptibility with this ecosystem.:

```json
"scripts": {
  "build": "(tsc|babel|microbundle|next build)", // Must create production builds of whatever package/service is being implemented
  "clean": "rm -rf (dist|.cache)", // Must remove build artifacts, build caches, etc.
  "dev": "(microbundle watch|reflex|nodemon|tsc -w|next)", // Must watch and rebuild code, start a dev server, whatever would be useful to be run so all services have up to date builds.
}
```

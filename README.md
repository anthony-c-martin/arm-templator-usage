# arm-templator-usage

> Usage examples for [arm-templator][main-repo].

![Build Status][status-image]

## Getting Started
1. Clone this repo
2. Run `npm install`
3. Edit the template and deployment parameters in [template.ts](./src/basic/template.ts) and [deploy.ts](./src/basic/deploy.ts)

### Viewing your template
1. Run `npm run display -- --path ./src/basic/deploy.ts`

### Deploying your template
1. Run `npm run deploy -- --path ./src/basic/deploy.ts`

### Editing
Templates are simply defined using Typescript, so you're free to use all the Typescript goodness as usual.

### Working with multiple templates or environments
* To create a new template, simply copy the [basic](./src/basic) directory, and use the `--path` parameter to reference the new deployment file.
* To work with the same template in different environments, copy the [deploy.ts](./src/basic/deploy.ts) file and define your separate parameters. For example, you could maintain `deploy-prod.ts` and `deploy-test.ts` to manage different sets of parameters for different environments.

[main-repo]: https://github.com/anthony-c-martin/arm-templator
[status-image]: https://img.shields.io/github/workflow/status/anthony-c-martin/arm-templator-usage/Node.js%20CI
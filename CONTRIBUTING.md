## Prepare your environment
We use [docusaurus](https://github.com/facebook/docusaurus/) to build our document.   
Before getting start, install docusaurus package on your system to get things to work.
see `website/README.md` file for setting up methods.

## Pull requests/ Merge Request
Feel free to create issues if you have any problems or create pull-requests/merge-request if you have found any document mistakes.

## Gitlab CI
If you have updated [docusaurus](https://docusaurus.io) version,
please also edit .gitlab-ci.yml file to update `cache key`(build.cache.key) to clear cache of node_modules.

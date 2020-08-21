# <img src="./images/logo.png" height="30" /> media-query-splitting-plugin
Webpack 4 plugin for styles splitting by media query.
[Demo](https://mediaquerysplittingdemo.firebaseapp.com/)

[![Npm Version](https://badge.fury.io/js/media-query-splitting-plugin.svg)](https://www.npmjs.com/package/media-query-splitting-plugin)
[![Month Downloads](https://img.shields.io/npm/dm/media-query-splitting-plugin.svg)](http://npm-stat.com/charts.html?package=media-query-splitting-plugin)
[![Npm Licence](https://img.shields.io/npm/l/media-query-splitting-plugin.svg)](https://www.npmjs.com/package/media-query-splitting-plugin)

This plugin is addition to [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin). It splits styles from style chunks by media query and creates separate CSS files for mobile, tablet and desktop.

#### Instalation
`npm install --save-dev media-query-splitting-plugin`

#### Chunk before applying
`0.04a9302b77ca5a27bfee.css` - chunk includes all styles and media queries

#### Chunk after applying
`0.04a9302b77ca5a27bfee.css` - common chunk includes the styles without media query conditions<br/>
`0.desktop.04a9302b77ca5a27bfee.css` - styles for desktop media query, by default it's *(min-width: 1025px)*<br/>
`0.tabletLandscape.04a9302b77ca5a27bfee.css` - *(min-width: 769px) and (max-width: 1024px)*<br/>
`0.tabletPortrait.04a9302b77ca5a27bfee.css` - *(min-width: 569px) and (max-width: 768px)*<br/>
`0.tablet.04a9302b77ca5a27bfee.css` - styles for both tabletLandscape and tabletPortrait<br/>
`0.mobile.04a9302b77ca5a27bfee.css` - *(max-width: 568px)*<br/>


Also it handles loading of this files depending of the client's screen width, it happens on loading new chunk or on window resize. 



## Options
This is default options, it can be omitted.

```js
{
  media: {
    mobileEnd: 568,
    tabletPortraitEnd: 768,
    tabletLandscapeEnd: 1024,
  },
  splitTablet: true,
  minify: true,
  units: 'px',
}
```
You can define your own media breakpoints in the media option. The plugin will create regular expression to check is media query fit input media query rule.
Also if you define `splitTablet: false` on the client side won't be used tabletPortrait or tabletLandscape styles. Instead will be used tablet style which includes both landscape and portrait.

If you want to disable css minification, set `minify: false`, this parameter by default is `true`.

If you want to use `rem` in media query - set `units: 'rem'`, which is by default `px`.

Pay attention that on server side we can't define by user-agent which tablet version the client used - landscape or portrait, that's why we send tablet version in the response. After user receives that response, the next chunk loading happens on client side (for example when user go to another page of our app), so than we can match browser media and load suitable tablet version.




## Install

```bash
npm install --save-dev media-query-splitting-plugin
```


## Usage

#### webpack.config.js
```js
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const MediaQuerySplittingPlugin = require('media-query-splitting-plugin')

module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
      chunkFilename: '[id].[contenthash].css',
    }),
    new MediaQuerySplittingPlugin({
      // This is default config (optional)
      media: {
        mobile: '(max-width: 568px)',
        tabletPortrait: {
          query: '(min-width: 569px) and (max-width: 768px)',
          prefetch: 'tabletLandscape',
        },
        tabletLandscape: {
          query: '(min-width: 769px) and (max-width: 1024px)',
          prefetch: 'tabletPortrait',
        },
        desktop: '(min-width: 1025px)',
      },
      splitTablet: true,
      minify: true,
      units: 'px',
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
        ]
      }
    ]
  }
}
```

## Server side rendering
The plugin splits each css asset to common chunk (which should be always included to the response) and media chunk (for desktop, tabletPortrait / tabletLandscape / tablet (includes portrait and landscape) or mobile, which should be included depending on client's device).

How to use it with SSR.

All you need is to define client device type (mobile, tablet or desktop) and add style chunk for this device in addition to  the common chunk. For example if you use express.js you can define device type depending on req.headers\['user-agent'\] (use [express-device](https://github.com/rguerreiro/express-device) middleware to handle it).

### Example:
```js
  const { getBundles } = require('react-loadable/webpack')
  const assets = require('assets.json') // webpack-assets-manifest

  const bundles  = getBundles(loadableAssets, loadableModules).filter(({ file }) => !/map$/.test(file))

  const styles   = (
    bundles
      .filter((bundle) => bundle.file.endsWith('.css'))
      .concat({ publicPath: assets.client.css })
      .map(({ publicPath }) => {
        const { isMobile, isTablet } = req

        let mediaType     = 'desktop'

        if (isMobile) {
          mediaType       = 'mobile'
        }
        else if (isTablet) {
          mediaType       = 'tablet'
        }

        const chunkId     = publicPath.replace(/.*\//,'').replace(/\..*/, '')
        const mediaPath   = publicPath.replace(chunkId, `${chunkId}.${mediaType}`)

        return `
          <link rel="stylesheet" href="${publicPath}" /> // Common chunk (0.04a9302b77ca5a27bfee.css)
          <link rel="stylesheet" href="${mediaPath}" />  // Media chunk  (0.${mediaType}.04a9302b77ca5a27bfee.css)
        `
      })
  )

```

"use strict";var splitByMediaQuery=require("./splitByMediaQueryNew"),handleApplyOld=function(a){var b=a.compiler,c=a.options,d=c.mediaOptions,e=c.minify,f="media-query-splitting-plugin";b.hooks.thisCompilation.tap(f,function(a){a.mainTemplate.hooks.requireEnsure.tap(f,function(a){if(a){var b="\n            // matchMedia polyfill\n            window.matchMedia||(window.matchMedia=function(){\"use strict\";var e=window.styleMedia||window.media;if(!e){var t,d=document.createElement(\"style\"),i=document.getElementsByTagName(\"script\")[0];d.type=\"text/css\",d.id=\"matchmediajs-test\",i?i.parentNode.insertBefore(d,i):document.head.appendChild(d),t=\"getComputedStyle\"in window&&window.getComputedStyle(d,null)||d.currentStyle,e={matchMedium:function(e){var i=\"@media \"+e+\"{ #matchmediajs-test { width: 1px; } }\";return d.styleSheet?d.styleSheet.cssText=i:d.textContent=i,\"1px\"===t.width}}}return function(t){return{matches:e.matchMedium(t||\"all\"),media:t||\"all\"}}}());\n            \n            // Define current mediaType\n            var getMediaType = function() {\n              return {\n                isMobile: window.matchMedia('(max-width: ".concat(d.mobileEnd,"px)').matches,\n                isTabletPortrait: window.matchMedia('(min-width: ").concat(d.tabletPortraitStart,"px) and (max-width: ").concat(d.tabletPortraitEnd,"px)').matches,\n                isTabletLandscape: window.matchMedia('(min-width: ").concat(d.tabletLandscapeStart,"px) and (max-width: ").concat(d.tabletLandscapeEnd,"px)').matches,\n                isDesktop: window.matchMedia('(min-width: ").concat(d.desktopStart,"px)').matches,\n              }\n            };\n\n            var mediaType                = getMediaType();\n            var currentMediaType         = 'desktop';\n\n            if (mediaType.isMobile) {\n              currentMediaType           = 'mobile'\n            }\n\n            var tryAppendNewMedia = function() {\n              var linkElements           = document.getElementsByTagName('link');\n              var chunkIds               = {};\n              \n              for (var i = 0; i < linkElements.length; i++) {\n                var chunkHref            = linkElements[i].href.replace(/.*\\//, '');\n                \n                if (/(mobile|tablet|desktop).*\\.css$/.test(chunkHref)) {\n                  var chunkId            = chunkHref.replace(/\\..*/, '');\n                  var chunkMediaType     = chunkHref.replace(chunkId + '.', '').replace(/\\..*/, '');\n                  var chunkHash          = chunkHref.replace(/\\.css$/, '').replace('' + chunkId + '.' + chunkMediaType + '.', '');\n                  var chunkHrefPrefix    = linkElements[i].href.replace('' + chunkId + '.' + chunkMediaType + '.' + chunkHash + '.css', '');\n  \n                  if (!chunkIds[chunkId]) {\n                    chunkIds[chunkId]    = {\n                      mediaTypes: [ chunkMediaType ],\n                      hash: chunkHash,\n                      prefix: chunkHrefPrefix,\n                    }\n                  }\n                  else {\n                    chunkIds[chunkId].mediaTypes.push(chunkMediaType);\n                  }\n                }\n              }\n\n              for (var i in chunkIds) {\n                if (chunkIds.hasOwnProperty(i)) {\n                  var isTablet           = /tablet/.test(currentMediaType);\n                  var hasTablet          = chunkIds[i].mediaTypes.indexOf('tablet') !== -1;\n                  var _hasCurrentMedia   = chunkIds[i].mediaTypes.indexOf(currentMediaType) !== -1;\n                  var hasCurrentMedia    = isTablet ? hasTablet || _hasCurrentMedia : _hasCurrentMedia;\n                  \n                  if (!hasCurrentMedia) {\n                    var fullhref         = '' + chunkIds[i].prefix + '' + i + '.' + currentMediaType + '.' + chunkIds[i].hash + '.css';\n                    var linkTag          = document.createElement('link');\n                    var header           = document.getElementsByTagName('head')[0];\n\n                    linkTag.rel          = 'stylesheet';\n                    linkTag.type         = 'text/css';\n                    linkTag.href         = fullhref;\n\n                    header.appendChild(linkTag);\n                  }\n                }\n              }\n            };\n\n            var resize = function() {\n              var newMediaType\n              var mediaType              = getMediaType();\n\n              if (mediaType.isMobile) {\n                newMediaType             = 'mobile'\n              }\n              else {\n                newMediaType             = 'desktop'\n              }\n\n              if (currentMediaType !== newMediaType) {\n                currentMediaType         = newMediaType;\n              }\n              \n              tryAppendNewMedia()\n            };\n\n            var afterDOMLoaded = function() {\n              if (!window.isListenerAdded) {\n                window.addEventListener('resize', resize);\n                window.isListenerAdded = true;\n                resize();\n              }\n            };\n\n            if (document.readyState === 'loading') {\n              document.addEventListener('DOMContentLoaded', afterDOMLoaded);\n            }\n            else {\n              afterDOMLoaded();\n            }\n          "),c=/head\.appendChild\(linkTag\);(.|\n)*}\)\.then/,e=a.replace(/(.|\n)*var href = \"/,"").replace(/\";(.|\n)*/,""),f=e.replace(/ chunkId /," chunkId + (mediaType !== \"common\" ? \".\"  + mediaType : \"\") ");return a.replace("promises.push(installedCssChunks[chunkId] = new Promise(function(resolve, reject) {","".concat(b).concat("promises.push(installedCssChunks[chunkId] = Promise.all([ 'common', currentMediaType ]\n            .map(function (mediaType) {\n              return new Promise(function(resolve, reject) {\n                // Don't load tabletPortrait or tabletLandscape if there is tablet style\n                if (/tablet/.test(mediaType)) {\n                  var linkElements         = document.getElementsByTagName('link');\n                  var hasTabletStyle       = false;\n  \n                  for (var i = 0; i < linkElements.length; i++) {\n                    var chunkHref          = linkElements[i].href.replace(/.*\\//, '');\n                    var currentChunkRegExp = new RegExp('^' + chunkId + '\\\\' + '.tablet' + '\\\\' + '.') \n                    \n                    if (currentChunkRegExp.test(chunkHref)) {\n                      mediaType            = 'tablet';\n                      break;\n                    }\n                  }\n                }\n          ")).replace(e,f).replace(c,"head.appendChild(linkTag);resize();\n})\n})).then")}})}),b.plugin("emit",function(a,b){var c=Object.keys(a.assets).filter(function(a){return /\.css$/.test(a)});c.forEach(function(b){var c=a.assets[b],f=c.children&&c.children[0],g="function"==typeof c.source?c.source():(f||c)._value,h=splitByMediaQuery({cssFile:g,mediaOptions:d,minify:e}),i=b.replace(/\.css$/,"").replace(/.*\./,""),j=b.replace(/\..*/,"");Object.keys(h).forEach(function(c){var d=h[c],e="common"===c?b:"".concat(j,".").concat(c,".").concat(i,".css");a.assets[e]={size:function(){return Buffer.byteLength(d,"utf8")},source:function(){return new Buffer(d)}}})}),b()})};module.exports=handleApplyOld;
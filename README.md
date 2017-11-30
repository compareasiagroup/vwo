# VWO Scripts for A / B Test

## HK TI
### landing_page

## PH CI
### landing_page
QUICK START
```
gulp start --src ./ph/ci/landing_page --app abTestApp
```

**DEV**
JS & CSS files are served through https://rawgit.com

Whatever pushed in master branch will be reflected soon on CGG dev site.

**PROD**
Copy the js from VWO DEV Campaign, and modify below part:

```javascript
// from VWO DEV
vwo_$('head').append('<link rel="stylesheet" class="external-css-link" type="text/css" href="https://rawgit.com/compareasiagroup/vwo/master/hk/ti/landing_page/v1.css">');
vwo_$.getScript("https://rawgit.com/compareasiagroup/vwo/master/hk/ti/landing_page/v1.js" , function ( data, textStatus, jqxhr ) ...
```
to
```javascript
vwo_$('head').append('<link rel="stylesheet" class="external-css-link" type="text/css" href="https://cdn.rawgit.com/compareasiagroup/vwo/9204df1/hk/ti/landing_page/v1.css">');
vwo_$.getScript("https://cdn.rawgit.com/compareasiagroup/vwo/9204df1/hk/ti/landing_page/v1.js" , function ( data, textStatus, jqxhr ) ...
```

Please note
1. domain for PROD will be https://cdn.rawgit.com
2. > Use a specific tag or commit hash in the URL (not a branch). Files are cached permanently based on the URL. Query strings are ignored.

URL for PROD should be either with **COMMIT_HASH** or **TAG**
- https://cdn.rawgit.com/compareasiagroup/vwo/COMMIT_HASH/hk/ti/landing_page/v1.css
- https://cdn.rawgit.com/compareasiagroup/vwo/TAG/hk/ti/landing_page/v1.css

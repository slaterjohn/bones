# Bones
Bones is a very simple starting point for all my web projects. Complete with a gulp process for processing SCSS, JS, Images and HTML.

Simply clone the repo and on you go.

_Not an original idea but i find it much easier working with code i've written myself._


## Installation
Clone this repo and from the cloned folder run the following...

	npm install


## Development
In development mode Gulp will watch for changes on SCSS, JS, Images and HTML.

	npm run build-dev


## Production
A production build will compress images, uglify CSS and minify JS.

	npm run build-prod


## To Do
A few things left on the list to sort out

- Add placeholder favicons (plus sketch template)
- Add options to config file to pre-populate meta
- Create a git clone cleanup script (to remove git folder)
- Add more mixins
- Add [BrowserSync](https://browsersync.io/docs/gulp) into gulp (behind toggle)

// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery.turbolinks
//= require jquery_ujs
//= require turbolinks

// Keep namespace first
//= require utilities/namespace.js

//= require game/resources.js
//= require game/settings.js

//= require io/canvas.js
//= require io/keyboard.js
//= require io/log.js
//= require io/screen.js

//= require units/base.js
//= require units/player.js

//= require utilities/helpers.js
//= require utilities/initializers.js

//= require main.js

//= require foundation

$(function() {
    $(document).foundation();
});
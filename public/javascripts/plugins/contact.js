;(define(['jquery'], function ( $ ) {
  // Create the defaults once
  var pluginName = "showContact",
    defaults = {
      // Selectors for elements in our module view.
      newsSelector: ".contact-row",
    };

  // The actual plugin constructor
  function Plugin( element ) {
    console.log("plugin constructor contact");
    this.el = element;
    this.$el = $(element);
    this.options = $.extend( {}, defaults) ;        
    this._defaults = defaults;
    this._name = pluginName;

    // Run INIT when constructor is called.
    this.init();
  }

  // Extend our plugin to implement the shared methods.
  $.extend(Plugin.prototype);

  // Initialize plugin
  Plugin.prototype.init = function () {
    // Render page structure template 
    console.log(this.options.newsSelector);

    // Show this page. (iplement showPage() base method)
    this.showPage();
    
    // Save different HTML objects
    this.$newslist = this.$el.find(this.options.newsSelector);

    // bind event listeners
    this.bindEvents();

  };

  /**
   * Listen for different events. Also allows third party apps to communicate
   * with our plugin.
   **/
  Plugin.prototype.bindEvents = function () {
    this.$el.on(pluginName + ".contactLoaded", $.proxy(this.render, this));
  };



  Plugin.prototype.render = function (ev, data) {
    console.log("contact render()");
  };

  Plugin.prototype.showPage = function(){
    console.log("contact showPage()");
    this.$el.show().siblings('.page-role').hide();
  }

  /*************************************************
   *  END IMPLEMENTATION
   *************************************************/

  // A really lightweight plugin wrapper around the constructor, 
  // preventing against multiple instantiations
  $.fn[pluginName] = function ( options ) {
    return this.each(function () {
      // Is already initiated?
      if ( !$.data(this, "plugin_" + pluginName )) {
        // No, create instance.
        $.data( this, "plugin_" + pluginName, 
        new Plugin( this, options ));
      } else {
        // Yes. So we just need to swap page display..
        $.data(this, "plugin_" + pluginName ).showPage();
      }
    });
  };

  // Provide default options to allow people to change them.
  $.fn[pluginName].defaults = defaults;

}));
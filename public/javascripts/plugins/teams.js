;(define(['jquery','scripts/base','ish'], function ( $,base ) {
  // Create the defaults once
  var pluginName = "showTeams",
    defaults = {
      // Selectors for elements in our module view.
      newsSelector: ".teams-row",
      formSelector: "form",
    };

  // The actual plugin constructor
  function Plugin( element ) {
    this.el = element;
    this.$el = $(element);
    this.options = $.extend( {}, defaults) ;        
    this._defaults = defaults;
    this._name = pluginName;

    // Run INIT when constructor is called.
    this.init();
  }

  // Extend our plugin to implement the shared methods.
  $.extend(Plugin.prototype,base);

  // Initialize plugin
  Plugin.prototype.init = function () {
    // Render page structure template 
    console.log(this.options.newsSelector);

    // Show this page. (iplement showPage() base method)
    this.showPage();
    
    // Save different HTML objects
    this.$newslist = this.$el.find(this.options.newsSelector);
    this.$el.on("submit", this.options.formSelector, $.proxy(this.addTeam, this));

    // bind event listeners
    this.bindEvents();
    this.renderTeams();




  };


  Plugin.prototype.addTeam = function(){
    var team_name = this.$el.find(this.options.formSelector + " input#name").val();
    var team = {'name':team_name,'games':{}};
    var params = {'team' : team};
    
    this.sendAction('addTeam',params,function(response){
      //TODO
    });
  }

  Plugin.prototype.renderTeams = function(){

      this.sendAction('getTeams',null,function(response){         
          var team_data = ich.team(response);
          $("#teams-list").append(team_data);
      });
    
  };

  /**
   * Listen for different events. Also allows third party apps to communicate
   * with our plugin.
   **/
  Plugin.prototype.bindEvents = function () {
    this.$el.on(pluginName + ".teamsLoaded", $.proxy(this.render, this));
  };



  Plugin.prototype.render = function (ev, data) {
    console.log("services render()");
  };

  Plugin.prototype.showPage = function(){
    console.log("services showPage()");
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
;(define(['jquery','scripts/base','socket','ish','handlebar'], function ( $,base ) {
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
    this.team;
    this.options = $.extend( {}, defaults) ;        
    this._defaults = defaults;
    this._name = pluginName;
    this.socket;

    // Run INIT when constructor is called.
    this.init();
  }


  // Extend our plugin to implement the shared methods.
  $.extend(Plugin.prototype,base);

  // Initialize plugin
  Plugin.prototype.init = function () {
    // Render page structure template 

    this.socket = io.connect();

    console.log(this.options.newsSelector);

    // Show this page. (iplement showPage() base method)
    this.showPage();
    
    // Save different HTML objects
    this.$newslist = this.$el.find(this.options.newsSelector);
    this.$el.on("submit", this.options.formSelector, $.proxy(this.addTeam, this));

    var self = this;
    $(document).click(function(e) {
      if(e.target.id == "remove-team"){
        self.removeTeam(e.target.value);
      }else if(e.target.id=="add-game"){
        location.window = "/games";
      }
    });


    this.renderTeams();
  };


  Plugin.prototype.sendA = function (action,params,callback) {
      this.socket.emit('sendAction',action,params,function(cb){
        callback(cb);
      });
    }

  Plugin.prototype.removeTeam = function(team_name){

    var params = {'team_name' : team_name};
    this.sendA('removeTeam',params,function(callback){
      location.reload();
    });
    
  }

  Plugin.prototype.addTeam = function(){
    var team_name = this.$el.find(this.options.formSelector + " input#name").val();
    var team = {'name': team_name,'games':{}};
    var params = {'team' : team};
    
    this.sendA('addTeam',params,function(response){
      //TODO
    });
  }

    Plugin.prototype.renderTeams = function(){
    var self = this;

    var source   = $("#team").html();
    var template = Handlebars.compile(source);
    
     var params = { 'saved': true};

      this.sendA('getTeams',params,function(response){  
        console.log("[getTeams]response: ");
        console.log("response");
          self.team = response;
          var html = template(response);
          $("#teams-list").append(html);
      });
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
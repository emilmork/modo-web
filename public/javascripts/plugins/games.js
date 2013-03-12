;(define(['jquery','scripts/base','socket'], function ($,base) {
  // Create the defaults once
  var pluginName = "showGames",
    defaults = {
      // Selectors for elements in our module view.
      newsSelector: ".games-row",
      mapWidthSelector: "#mapwith",
      mapHeightSelector: "#mapheight",
      formSelector: "form",
    };

  // The actual plugin constructor
  function Plugin( element ) {
    console.log("plugin constructor");
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
    // Show this page. (iplement showPage() base method)
    this.showPage();
    this.renderMap();
    
    // Save different HTML objects
    this.$newslist = this.$el.find(this.options.newsSelector);

    this.$mapHeight = this.$el.find(this.options.mapHeightSelector);
    this.$mapWidth = this.$el.find(this.options.mapWidthSelector);


    // bind event listeners
    this.bindEvents();


  };

  /**
   * Listen for different events. Also allows third party apps to communicate
   * with our plugin.
   **/
  Plugin.prototype.bindEvents = function () {


    this.$mapHeight.on("change", $.proxy(this.renderMap));
    this.$mapWidth.on("change", $.proxy(this.renderMap));

    this.$el.on("submit", this.options.formSelector, $.proxy(this.sendMessage, this));
  };

  Plugin.prototype.sendMessage = function(){

    var self = this
      , team_name = this.$el.find(this.options.formSelector + " select#team_name option:selected").val()
      , name = this.$el.find(this.options.formSelector + " input#name").val()
      , desc = this.$el.find(this.options.formSelector + " input#desc").val()
      , panictime = this.$el.find(this.options.formSelector + " input#panictime").val()
      , roundtime = this.$el.find(this.options.formSelector + " input#roundtime").val()
   // var io = this.connection();
      alert(team_name);

    var game = {'name' : name, 'desc' : desc};
    var params = { 'team_name': team_name, 'game' : game };

    this.sendAction('addGame',params);

    //io.emit('addGame', team_name ,game);
  }



  Plugin.prototype.render = function (ev, data) {
    console.log("news render()");
  };

  Plugin.prototype.showPage = function(){
    this.$el.show().siblings('.page-role').hide();
  }

  Plugin.prototype.renderMap = function(){

    var mapwidth = $("#mapwith").val();
    var mapheight = $("#mapheight").val();

    $("#maptable").remove();
    // create table
    var $table = $("<table id='maptable'>");
    // caption
    var ths = "";
    for(var th = 0; th < mapheight; th++){
      ths+="<th>"+(th+1)+"</th>";
    }
    $table.append('<caption></caption>')
    // thead
    .append('<thead>').children('thead')
    .append("<tr class='maprow'>"+ths+"</td>")

    //tbody
    var $tbody = $table.append('<tbody />').children('tbody');

    // add row
    for(var rows = 0; rows < mapwidth; rows++){
      $tbody.append('<tr />').children('tr:last')

      for(var col = 0; col<mapheight; col++ ){
        var textarea = "<textarea class='sectorname' rows='1' placeholder='Sector-name'></textarea>";
        $tbody.append("<td class='mapsector'>"+textarea+"</td>")
      }
    }
    // add table to dom
    $table.appendTo('#dynamicTable');

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
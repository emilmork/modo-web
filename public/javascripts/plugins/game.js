;(define(['jquery','scripts/base','socket','chart','handlebar'], function ($,base) {
  // Create the defaults once
  var pluginName = "showSelectedGame",
    defaults = {
      // Selectors for elements in our module view.
      gameInfoSelector: "#game-info",
      gameStatContainer: "#game-stat-container",

      startgameSelector: "#start-game",
      deletegameSelector: "#stop-game"
    };

  // The actual plugin constructor
  function Plugin( element,req) {
    console.log(req.params.id);
    console.log(req.params.team);
    console.log("plugin constructor");
    this.gameName = req.params.id;
    this.teamName = req.params.team;

    this.el = element;
    this.$el = $(element);
    this.options = $.extend( {}, defaults);        
    this._defaults = defaults;
    this._name = pluginName;

    // Run INIT when constructor is called.
    this.init();
  }

  // Extend our plugin to implement the shared methods.
  $.extend(Plugin.prototype,base);

  // Initialize plugin
  Plugin.prototype.init = function () {
    this.showPage();

    // Save different HTML objects
    this.$gameInfo = this.$el.find(this.options.gameInfoSelector);
    this.$gameStats = this.$el.find(this.options.gameStatSelector);

    this.$el.on("click", this.options.startgameSelector, $.proxy(this.startGame, this));
    this.$el.on("click", this.options.deletegameSelector, $.proxy(this.stopGame, this));

    var self = this;
    $(document).click(function(e) {
      if(e.target.id == "remove-game"){
        self.removeGame();
      }
    });


    // bind event listeners
    this.bindEvents();
    this.getGame();


  };

  Plugin.prototype.startGame = function(){
    var self = this;
    var params = {game_name : this.gameName};
    this.sendAction('startGame',params,function(response){
      if(response.started == 'ok'){
        self.getGame();
      }
    });
  }

  Plugin.prototype.stopGame = function(){
    var self = this;
       var params = {game_name : this.gameName, team_name: this.teamName};
      this.sendAction('stopGame',params,function(response){
        console.log("response from stopGame: " + response.stopped);
        if(response.stopped = "ok"){
          self.getGame();
        }
        
    });
  }

  Plugin.prototype.removeGame = function(){
    console.log("calling removeGame");
    var params = {'team_name': this.teamName, 'game_name' : this.gameName};
    this.sendAction('removeGame',params,function(response){
      console.log("response remove");
      if(response.removed = "ok"){
          console.log("response ok");
          window.location = "/teams";
      }
    });
  }

  Plugin.prototype.showPage = function(){
    this.$el.show().siblings('.page-role').hide();
  }

  /**
   * Listen for different events. Also allows third party apps to communicate
   * with our plugin.
   **/
  Plugin.prototype.bindEvents = function () {
    //On change methods etc
  };


Plugin.prototype.getGame = function(){

  var source   = $('#agame').html();
  var template = Handlebars.compile(source);

  var self = this;
  var params = {'saved' : true, 'team_name' : this.teamName, 'game_name' : this.gameName};
  this.sendAction('getGame',params,function(response){
    console.log("Render game:");
    console.log(response.game);

    var html = template(response.game);
    $('#game-info').empty();
    $('#game-info').append(html);

    self.renderStatistics(response.game);
  });
}

  Plugin.prototype.renderStatistics = function(game){

    var series_data = new Array();
    game.players.forEach(function(player){
      series_data.push({
        name: player.name,
        data: player.actions
      });
    });

    series_data.push({
      name : 'Total',
      data : game.actions
    });

    console.log(series_data);
    console.log(game.actions);


    $("#game-stat-container").highcharts({
        chart: {
            type: 'column',
            backgroundColor:'rgba(255, 255, 255, 0.1)'
        },
        title: {
            text: 'Game actions'
        },
        xAxis: {
            categories: ['Move people', 'New location','Calm down people', 'Used tool','People rescued']
        },
        yAxis: {
            title: {
                text: 'Actions performed'
            }
        },
        series: series_data,
    });
  }


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
        $.data(this, "plugin_" + pluginName ).gameName = options.params.id;
        $.data(this, "plugin_" + pluginName ).teamName = options.params.team;
        $.data(this, "plugin_" + pluginName ).showPage();
        $.data(this, "plugin_" + pluginName ).getGame();
      }
    });
  };

  // Provide default options to allow people to change them.
  $.fn[pluginName].defaults = defaults;

}));
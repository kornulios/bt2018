function resultsScreen() {
    var me = this;
    me.mainDiv = document.createElement('div');
}

resultsScreen.prototype.render = function() {
    this.update();
    return this.mainDiv;
}

resultsScreen.prototype.update = function() {
    var view = game.view;
    this.mainDiv.innerHTML = view.getResultsTpl();
}
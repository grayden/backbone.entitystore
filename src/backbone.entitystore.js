(function (Backbone) {
  var EntityStore = Backbone.EntityStore = function (attrs) {
    this.modelType = attrs.model;
    this.collectionType = attrs.collection;
  }; 

  _.extend(EntityStore.prototype, {
    get: function (id) {
      var newModelInstance = new this.modelType({ id: id });
      return newModelInstance.fetch();
    }

  });
})(Backbone);

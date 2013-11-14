(function (Backbone) {
  var EntityStore = Backbone.EntityStore = function (attrs) {
    this.modelType = attrs.model;
    this.collectionType = attrs.collection;
    this.collection = new this.collectionType();
  }; 

  _.extend(EntityStore.prototype, {
    get: function (model) {
      var id = model.id ? model.id : model;
      if (this.collection.get(id)) return this.collection.get(id);
      var newModelInstance = new this.modelType({ id: id });
      this.collection.add(newModelInstance);
      return newModelInstance.fetch();
    }
  });
})(Backbone);

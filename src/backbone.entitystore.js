(function (Backbone) {
  var EntityStore = Backbone.EntityStore = function (attrs) {
    this.collectionType = attrs.collection;
    this.collection = new this.collectionType();
    this.modelType = this.collection.model;
  }; 

  _.extend(EntityStore.prototype, {
    get: function (model) {
      var id = model.id ? model.id : model;
      if (this.collection.get(id))
      {
        var deferred = jQuery.Deferred(); 
        var model = this.collection.get(id);
        deferred.resolve(model);
        return deferred;
      } 
      var newModelInstance = new this.modelType({ id: id });
      this.collection.add(newModelInstance);
      return newModelInstance.fetch();
    },
    map: function(mapper) {
      var mappedModels = this.collection.map(mapper);
      return new this.collectionType(mappedModels);
    }
  });
})(Backbone);

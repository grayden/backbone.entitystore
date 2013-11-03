(function (Backbone) {
  var EntityStore = Backbone.EntityStore = function (attrs) {
    this.modelType = attrs.model;
    this.collectionType = attrs.collection;
    this.collection = new this.collectionType();
  }; 

  _.extend(EntityStore.prototype, {
    get: function (id) {
      if (this.collection.get(id)) return this.collection.get(id);
      var newModelInstance = new this.modelType({ id: id });
      this.collection.add(newModelInstance);
      return newModelInstance.fetch();
    },

    models: function () {
      return this.collection.toJSON();
    },

    howManyCached: function () {
      return this.collection.length;
    }
  });
})(Backbone);

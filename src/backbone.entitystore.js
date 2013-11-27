(function (Backbone) {
  var EntityStore = Backbone.EntityStore = Backbone.Collection.extend({

    request: function (model) {
      var id = model.id ? model.id : model;
      if (this.get(id))
      {
        var deferred = jQuery.Deferred(); 
        var model = this.get(id);
        deferred.resolve(model);
        return deferred;
      } 
      var newModelInstance = new this.model({ id: id });
      this.add(newModelInstance);
      return newModelInstance.fetch();
    },

    proxyMapped: function(mapper) {
      var mappedModels = this.map(mapper);
      var mappedCollection = new Backbone.Collection(mappedModels);

      mappedCollection.on('remove', _.bind(this.remove, this));

      return mappedCollection;
    }
  });
})(Backbone);

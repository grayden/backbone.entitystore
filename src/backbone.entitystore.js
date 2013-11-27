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
      return this.build(mappedModels);
    },


    build: function (models) {
      var proxyCollection = new Backbone.Collection(models);  

      proxyCollection.on('add', _.bind(this.add, this));
      proxyCollection.on('remove', _.bind(this.remove, this));

      return proxyCollection;
    }
  });
})(Backbone);

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

    proxyFiltered: function (filterer) {
      var filteredModels = this.filter(filterer);
      var filteredCollection = new Backbone.Collection(filteredModels);

      return filteredCollection;
    },

    proxyMapped: function(mapper) {
      var mappedModels = this.map(mapper);
      var mappedCollection = new Backbone.MappedCollection();
      mappedCollection.mapper = mapper;
      mappedCollection.parentCollection = this;
      mappedCollection.set(mappedModels);

      mappedCollection.on('remove', _.bind(this.remove, this));
      mappedCollection.on('add', _.bind(this.add, this));
      
      this.on('add', _.bind(mappedCollection.addMapped, mappedCollection));

      return mappedCollection;
    }
  });

  Backbone.MappedCollection = Backbone.Collection.extend({
    add: function (models) {
      this.parentCollection.add(models);
    },
    addMapped: function (models) {
      models = _.isArray(models) ? models : [models];
      mappedModels = _.map(models, this.mapper);
      Backbone.Collection.prototype.add.apply(this, [mappedModels, {merge: true}]);
    }
  });
})(Backbone);

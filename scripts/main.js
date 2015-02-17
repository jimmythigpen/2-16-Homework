(function() {
  // window.App = window.App || {};

  //
  // Post Model
  //
  var PostModel = Backbone.Model.extend({
    idAttribute: "_id",

    defaults: function(attributes) {
      return _.defaults(attributes, {
        title: '',
        body: '',
        timestamp: (new Date()).toString()
      });
    }
  });
  //
  // Posts Collection
  //
  var PostsCollection = Backbone.Collection.extend({
    url: 'http://tiny-pizza-server.herokuapp.com/collections/dudes',
    model: PostModel,

    // comparator: 'timestamp'
  });
  //
  // Post Item View
  //
  var PostItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'post',
    events: {
      'click': 'viewPost'
    },

    template: _.template($('#post-template').text()),


    render: function(){
     this.$el.html(this.template(this.model.toJSON()));
    },

    viewPost: function(event){
      event.preventDefault();
      console.log(this.model);
      router.navigate('post/' + this.model.id, {
        trigger: true
      });
    }

});
  //
  // Posts List View
  //
  var PostsListView = Backbone.View.extend({
    el: '.js-post-list',


    initialize: function() {
      this.listenTo(this.collection, 'sync', this.render);
    },

    render: function(){
      var self = this;

      this.$el.empty();

      this.collection.each(function(post){
        var postView = new PostItemView({model: post});
        postView.render();
        self.$el.prepend(postView.el);
      });
      return this;
    }

  });

  //
  // New Post View
  //
  var NewPostView = Backbone.View.extend({
    tagName: 'input',


  });
  //
  // Post Detail View
  //
  var PostDetailView = Backbone.View.extend({

    el: 'article',

    template: _.template($('#view-post-template').text()),

    initialize: function() {
      this.listenTo(this.model, 'sync', this.render);
    },

    render: function(){
      this.$el.html(this.template(this.model.toJSON()));
      // var self = this;
      //
      // this.$el.empty();
      //
      // this.collection.each(function(post){
      //   var postView = new PostItemView({model: post});
      //   postView.render();
      //   self.$el.prepend(postView.el);
      // });
      // return this;
    }

  });
  //
  // Router
  //
  var AppRouter = Backbone.Router.extend({
    routes: {
    "": "index",
    "post/:id": "viewPost"
  },

    initialize: function() {
      this.posts = new PostsCollection();
      this.post = new PostModel();
      this.postItemView = new PostItemView({model:this.post});
      this.postsListView = new PostsListView({collection: this.posts});
      this.postDetailView = new PostDetailView({model:this.post});
      console.log('Router initialize is running');

    },

    index: function() {
      this.posts.fetch();
      console.log('Router index function is running');

    },

    viewPost: function(){
      console.log('viewPost is running');
      this.PostDetailView.render();
    }

  });

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();

  });


})();

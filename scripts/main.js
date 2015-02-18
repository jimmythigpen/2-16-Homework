(function() {

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

    comparator: 'timestamp'
  });
  //
  // Post Item View
  //
  var PostItemView = Backbone.View.extend({
    tagName: 'li',
    className: 'post',
    template: _.template($('#post-template').text()),
    events: {
      'click': 'viewPost',
    },

    render: function(){
     this.$el.html(this.template(this.model.toJSON()));
    },

    viewPost: function(event){
      event.preventDefault();
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
      $('.js-detail-container').empty();

      this.collection.each(function(post){
        var postView = new PostItemView({model: post});
        postView.render();
        self.$el.prepend(postView.el);
      });
      return this;
    }
  });
  //
  // Post Detail View
  //
  var PostDetailView = Backbone.View.extend({
    el: '.js-detail-container',
    events: {
      'click .js-edit-post': 'editPost',
      'click .js-delete-post': 'deletePost'
    },

    template: _.template($('#view-post-template').text()),

    render: function(){
      $('.post-list').empty();
      this.$el.html(this.template(this.model.toJSON()));
    },

    editPost: function(){
      var isEditable = this.$('.js-body, .js-title').attr('contenteditable') == 'true';
      if(isEditable) {
        this.$('.js-body, .js-title').attr('contenteditable', 'false');
        this.model.set('body', this.$('.js-body').text() );
        this.model.set('title', this.$('.js-title').text() );
        this.model.save();
      } else {
        this.$('.js-body, .js-title').attr('contenteditable', 'true');
      }
    },

    deletePost: function(){
      console.log('deletePost is running');
      this.model.destroy();
      router.navigate("",{
        trigger: true
      });
    }
  });
  //
  // Create Button View
  //
  var ButtonListView = Backbone.View.extend({
    el: '.js-post-list',
    events: {
      'click .js-create-post': 'createPost'
    },

    template: _.template($('#create-button-template').text()),

    initialize: function() {
      this.listenTo(this.collection, 'sync', this.render);
    },

    render: function(){
      this.$el.append(this.template());
    },

    createPost: function(event){
      event.preventDefault();
      console.log('createPost is running');
      var createView = new CreatePostView();
      createView.render();
      this.$el.append(createView.el);
    }
  });
  //
  // Create Post View
  //
  var CreatePostView = Backbone.View.extend({
    el: '.js-create-container',
    events: {
      'click .js-save-post': 'savePost'
    },

    template: _.template($('#create-post-template').text()),

    render: function(){
     this.$el.html(this.template());
    },

    savePost: function(event){
      event.preventDefault();
      var title = $('.js-new-title').val();
      var body = $('.js-new-body').val();
      var timestamp = 'the time';
      this.collection.create({title: title, body: body, timestamp: timestamp});
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
      // console.log('Router initialize is running');
      this.post = new PostModel();
      this.posts = new PostsCollection();
      this.postItemView = new PostItemView({model:this.post});
      this.postsListView = new PostsListView({collection: this.posts});
      this.postDetailView = new PostDetailView();
      this.buttonListView = new ButtonListView({collection: this.posts});
      this.createPostView = new CreatePostView({collection: this.posts});

    },

    index: function() {
      // console.log('Router index function is running');
      this.posts.fetch();

    },

    viewPost: function(id){
      // console.log('viewPost function is running');
      var self = this;
      this.posts.fetch().done(function(){
        self.postDetailView.model = self.posts.get(id);
        self.postDetailView.render();
      });
    }
  });

  $(document).ready(function() {
    window.router = new AppRouter();
    Backbone.history.start();
  });
})();

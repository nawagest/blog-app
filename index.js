const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const slugify = require('slugify');
const { truncate } = require('lodash');
const methodOverride = require('method-override');
const marked = require('marked');
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = new createDOMPurify(new JSDOM().window);
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const port = process.env.PORT || 3001;

// add uuid to Schema and not slug cus slug has its own issues ✅
// style each individual post ✅
// learn markdown syntax
// fix footer ✅
// create a secret pass that only ik so i can create the blog posts
// push db on atlas and finally post site to heroku

mongoose.connect(`mongodb+srv://nawagest:${process.env.DB_USER_PASS}@blog-app-cluster.ahee9gh.mongodb.net/postsDB`);

const postSchema = new mongoose.Schema({
  main: {
    title: {
      type: String,
      required: true
    },
    desc: String,
    content: {
      type: String,
      required: true
    }
  },
  date: String,
  truncatedContent: String,
  slug: String,
  sanitizedHTML: String,
  uuid: String
});

const Post = mongoose.model('Post', postSchema);

const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }));

const date = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

app.get('/', (req, res) => {
  res.sendFile(`${__dirname}/index.html`);
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  const data = new Post({ 
    main: req.body, 
    date, 
    truncatedContent: truncate(req.body.content, { 
      length: 100 
    }), 
    slug: slugify(req.body.title, { 
      lower: true, 
      strict: true 
    }),
    sanitizedHTML: dompurify.sanitize(marked.parse(req.body.content)),
    uuid: uuidv4()
  });
  data.save();
  res.redirect(`/posts`);
});

app.get('/posts', (req, res) => {
  Post.find({}, function(err, posts) {
    if(posts) {
      res.render('posts', { posts });
    } else {
      // console.log(err);
    }
  })
});

app.delete('/posts', (req, res) => {
  Post.deleteOne({ uuid: req.body.uuid }, function(err, post) {
    if(err) {
      console.log(err);
    }
  });
  res.redirect('/posts');
});

app.get('/posts/:id', (req, res) => {
  const post = Post.find({}, (err, p) => {
    // const param = slugify(req.params.id, { lower: true, strict: true })
    const param = req.params.id;
    const post = p.find(post => post.id === param)
    if (post.id === param)
      res.render('post', { post });
    else
      res.render('error', { page: req.params.id });
    });
});

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
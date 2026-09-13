import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    excerpt: { type: String, required: true, maxlength: 400 },
    content: { type: String, required: true },
    featuredImage: { type: String, default: '' },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: String, default: 'General', trim: true },
    tags: [{ type: String, trim: true }],
    isPublished: { type: Boolean, default: false },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

blogPostSchema.index({ isPublished: 1, publishedAt: -1 });

const BlogPost = mongoose.model('BlogPost', blogPostSchema);
export default BlogPost;

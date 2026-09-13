import BlogPost from '../models/BlogPost.js';
import { AppError } from '../utils/ApiResponse.js';
import { slugify } from '../utils/slugify.js';

export const listPublishedPosts = async ({ page = 1, limit = 10, category, search } = {}) => {
  const filter = { isPublished: true };
  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    BlogPost.find(filter)
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    BlogPost.countDocuments(filter),
  ]);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

export const getPostBySlug = async (slug) => {
  const post = await BlogPost.findOne({ slug, isPublished: true }).populate(
    'author',
    'name'
  );
  if (!post) throw new AppError('Blog post not found', 404);
  return post;
};

export const createPost = async (payload, authorId) => {
  const slug = payload.slug || slugify(payload.title);
  const exists = await BlogPost.findOne({ slug });
  if (exists) throw new AppError('Blog slug already exists', 409);

  return BlogPost.create({
    ...payload,
    slug,
    author: authorId,
    publishedAt: payload.isPublished ? new Date() : undefined,
  });
};

export const updatePost = async (id, payload) => {
  const post = await BlogPost.findById(id);
  if (!post) throw new AppError('Blog post not found', 404);

  if (payload.title && !payload.slug) payload.slug = slugify(payload.title);
  if (payload.isPublished && !post.publishedAt) {
    payload.publishedAt = new Date();
  }

  Object.assign(post, payload);
  await post.save();
  return post;
};

export const deletePost = async (id) => {
  const post = await BlogPost.findByIdAndDelete(id);
  if (!post) throw new AppError('Blog post not found', 404);
  return post;
};

export const listAllPostsAdmin = async ({ page = 1, limit = 20 } = {}) => {
  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    BlogPost.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    BlogPost.countDocuments(),
  ]);
  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
};

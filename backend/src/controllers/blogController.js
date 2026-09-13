import { asyncHandler, sendSuccess } from '../utils/ApiResponse.js';
import * as blogService from '../services/blogService.js';

export const getPosts = asyncHandler(async (req, res) => {
  const data = await blogService.listPublishedPosts(req.query);
  sendSuccess(res, { message: 'Blog posts fetched', data });
});

export const getPost = asyncHandler(async (req, res) => {
  const post = await blogService.getPostBySlug(req.params.slug);
  sendSuccess(res, { message: 'Blog post fetched', data: { post } });
});

export const createPost = asyncHandler(async (req, res) => {
  const post = await blogService.createPost(req.body, req.user.id);
  sendSuccess(res, {
    statusCode: 201,
    message: 'Blog post created',
    data: { post },
  });
});

export const updatePost = asyncHandler(async (req, res) => {
  const post = await blogService.updatePost(req.params.id, req.body);
  sendSuccess(res, { message: 'Blog post updated', data: { post } });
});

export const deletePost = asyncHandler(async (req, res) => {
  await blogService.deletePost(req.params.id);
  sendSuccess(res, { message: 'Blog post deleted', data: null });
});

export const getAdminPosts = asyncHandler(async (req, res) => {
  const data = await blogService.listAllPostsAdmin(req.query);
  sendSuccess(res, { message: 'Blog posts fetched', data });
});

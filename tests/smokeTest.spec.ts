import { expect } from '../utils/custom-expect';
import { test } from '../utils/fixtures';
import { validateSchema } from '../utils/schemaValidator';
import articleRequestPayload from '../request-objects/POST-article.json';
import { faker } from '@faker-js/faker';
import { getNewRandomArticle } from '../utils/dataGenerator';

test('Get articles', async ({ api }) => {
  const response = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .clearAuth()
    .getRequest(200);
  await expect(response).shouldMatchSchema('articles', 'GET_articles');
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
  expect(response.articlesCount).shouldEqual(10);
});
test('Get test tags', async ({ api }) => {
  const response = await api.path('/tags').getRequest(200);
  await expect(response).shouldMatchSchema('tags', 'GET_tags');
  await validateSchema('tags', 'GET_tags', response);
  expect(response.tags[0]).shouldEqual('Test');
  expect(response.tags.length).toBeLessThanOrEqual(10);
});
test('Create and delete article', async ({ api }) => {
  const articleRequest = getNewRandomArticle();
  const createArticleResponse = await api.path('/articles').body(articleRequest).postRequest(201);
  await expect(createArticleResponse).shouldMatchSchema('articles', 'POST_articles');
  expect(createArticleResponse.article.title).shouldEqual(articleRequest.article.title);
  const slugId = createArticleResponse.article.slug;

  const articleResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articleResponse.articles[0].title).shouldEqual(articleRequest.article.title);

  await api.path(`/articles/${slugId}`).deleteRequest(204);

  const articleResponseTwo = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articleResponseTwo.articles[0].title).not.shouldEqual(articleRequest.article.title);
});

test('Create, update and delete article', async ({ api }) => {
  const articleTitle = faker.lorem.sentence(5);
  const articleRequest = JSON.parse(JSON.stringify(articleRequestPayload));
  articleRequest.article.title = articleTitle;
  const createArticleResponse = await api.path('/articles').body(articleRequest).postRequest(201);

  expect(createArticleResponse.article.title).shouldEqual(articleTitle);
  const slugId = createArticleResponse.article.slug;

  const articleTitleModified = faker.lorem.sentence(5);
  articleRequest.article.title = articleTitleModified;
  const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
    .body(articleRequest)
    .putRequest(200);

  expect(updateArticleResponse.article.title).shouldEqual(articleTitleModified);
  const newSlugId = updateArticleResponse.article.slug;

  const articleResponse = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articleResponse.articles[0].title).shouldEqual(articleTitleModified);

  await api.path(`/articles/${newSlugId}`).deleteRequest(204);

  const articleResponseTwo = await api
    .path('/articles')
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articleResponseTwo.articles[0].title).not.shouldEqual(articleTitleModified);
});

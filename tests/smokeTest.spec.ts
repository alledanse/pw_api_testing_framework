import { expect } from '../utils/custom-expect';
import { test } from '../utils/fixtures';

let authToken: string;
test.beforeAll('run before all', async ({ api }) => {
  const tokenResponse = await api
    .path('/users/login')
    .body({
      user: {
        email: 'pw123456test@test.com',
        username: 'pw123456test',
        password: 'Welcome123',
      },
    })
    .postRequest(200);

  authToken = `Token ${tokenResponse.user.token}`;
});

test('Get articles', async ({ api }) => {
  const response = await api.path('/articles').params({ limit: 10, offset: 0 }).getRequest(200);
  expect(response.articles.length).shouldBeLessThanOrEqual(10);
  expect(response.articlesCount).shouldEqual(10);
});
test('Get test tags', async ({ api }) => {
  const response = await api.path('/tags').getRequest(200);
  expect(response.tags[0]).shouldEqual('Test');
  expect(response.tags.length).toBeLessThanOrEqual(10);
});
test('Create and delete article', async ({ api }) => {
  const createArticleResponse = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: 'Test TWO TEST',
        description: 'Test description',
        body: 'Test body',
        tagList: [],
      },
    })
    .postRequest(201);

  expect(createArticleResponse.article.title).shouldEqual('Test TWO TEST');
  const slugId = createArticleResponse.article.slug;

  const articleResponse = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articleResponse.articles[0].title).shouldEqual('Test TWO TEST');

  await api.path(`/articles/${slugId}`).headers({ Authorization: authToken }).deleteRequest(204);

  const articleResponseTwo = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articleResponseTwo.articles[0].title).not.shouldEqual('Test TWO TEST');
});

test('Create, update and delete article', async ({ api }) => {
  const createArticleResponse = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: 'Test TWO TEST',
        description: 'Test description',
        body: 'Test body',
        tagList: [],
      },
    })
    .postRequest(201);

  expect(createArticleResponse.article.title).shouldEqual('Test TWO TEST');
  const slugId = createArticleResponse.article.slug;

  const updateArticleResponse = await api
    .path(`/articles/${slugId}`)
    .headers({ Authorization: authToken })
    .body({
      article: {
        title: 'Test new article modified',
        description: 'Test description',
        body: 'Test body',
        tagList: [],
      },
    })
    .putRequest(200);

  expect(updateArticleResponse.article.title).shouldEqual('Test new article modified');
  const newSlugId = updateArticleResponse.article.slug;

  const articleResponse = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articleResponse.articles[0].title).shouldEqual('Test new article modified');

  await api.path(`/articles/${newSlugId}`).headers({ Authorization: authToken }).deleteRequest(204);

  const articleResponseTwo = await api
    .path('/articles')
    .headers({ Authorization: authToken })
    .params({ limit: 10, offset: 0 })
    .getRequest(200);
  expect(articleResponseTwo.articles[0].title).not.shouldEqual('Test new article modified');
});

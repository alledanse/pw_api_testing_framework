import { test, expect } from '@playwright/test';

let authToken: string;
test.beforeAll('run before all', async ({ request }) => {
  const tokenResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/users/login',
    {
      data: {
        user: {
          email: 'pw123456test@test.com',
          username: 'pw123456test',
          password: 'Welcome123',
        },
      },
    },
  );
  const tokenResponseJson = await tokenResponse.json();

  authToken = tokenResponseJson.user.token;
});

test('Get test tags', async ({ request }) => {
  const tagsResponse = await request.get('https://conduit-api.bondaracademy.com/api/tags');
  const responseJson = await tagsResponse.json();
  expect(tagsResponse.status()).toEqual(200);
  expect(responseJson.tags[0]).toEqual('Test');
  expect(responseJson.tags.length).toBeLessThanOrEqual(10);
});

test('Get All Articles', async ({ request }) => {
  const articlesResponse = await request.get(
    'https://conduit-api.bondaracademy.com/api/articles?limit=10&offset=0',
  );
  const articlesResponseJson = await articlesResponse.json();
  expect(articlesResponse.status()).toEqual(200);
  expect(articlesResponseJson.articles.length).toBeLessThanOrEqual(10);
  expect(articlesResponseJson.articlesCount).toEqual(10);
});

test('Create, Update and Delete the article', async ({ request }) => {
  const newArticleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles',
    {
      data: {
        article: {
          title: 'Test new article',
          description: 'Test description',
          body: 'Test body',
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${authToken}`,
      },
    },
  );
  const newArticleResponseJson = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201);
  const slugId = newArticleResponseJson.article.slug;

  const updateArticleResponse = await request.put(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      data: {
        article: {
          title: 'Test new article modified',
          description: 'Test description',
          body: 'Test body',
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${authToken}`,
      },
    },
  );
  const updateArticleResponseJson = await updateArticleResponse.json();
  expect(updateArticleResponse.status()).toEqual(200);
  expect(updateArticleResponseJson.article.title).toEqual('Test new article modified');
  const newSlugId = updateArticleResponseJson.article.slug;

  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${newSlugId}`,
    {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    },
  );

  expect(deleteArticleResponse.status()).toEqual(204);
});

test('Create and Delete the article', async ({ request }) => {
  const newArticleResponse = await request.post(
    'https://conduit-api.bondaracademy.com/api/articles',
    {
      data: {
        article: {
          title: 'Test TWO TEST',
          description: 'Test description',
          body: 'Test body',
          tagList: [],
        },
      },
      headers: {
        Authorization: `Token ${authToken}`,
      },
    },
  );
  const newArticleResponseJson = await newArticleResponse.json();
  expect(newArticleResponse.status()).toEqual(201);
  const slugId = newArticleResponseJson.article.slug;

  const deleteArticleResponse = await request.delete(
    `https://conduit-api.bondaracademy.com/api/articles/${slugId}`,
    {
      headers: {
        Authorization: `Token ${authToken}`,
      },
    },
  );

  expect(deleteArticleResponse.status()).toEqual(204);
});

//https://conduit-api.bondaracademy.com/api/articles

//username: "pw123456test"
//Email pw123456test@test.com
//Password Welcome123

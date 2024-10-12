import Request from '~/custom/frontend/Request';

export default async (app) => {
  Request.axios = app.$axios;
};
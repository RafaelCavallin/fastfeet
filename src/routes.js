import { Router } from 'express';

const routes = new Router();

routes.get('/', (rew, res) => {
  return res.json({ message: 'hello World' });
});

export default routes;

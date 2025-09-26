import { Router } from 'express';
import authRoute from './app/modules/auth/auth.route';
import messageRouter from './app/modules/messages/message.route';


const appRouter = Router();

const moduleRoutes = [
    { path: '/auth', route: authRoute },
    { path: "/message", route: messageRouter }

];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;
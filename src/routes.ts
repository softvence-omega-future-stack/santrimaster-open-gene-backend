import { Router } from 'express';
import authRoute from './app/modules/auth/auth.route';
import messageRouter from './app/modules/messages/message.route';
import protocolRouter from './app/modules/protocol/protocol.route';
import sponsorRouter from './app/modules/sponsor/sponsor.route';


const appRouter = Router();

const moduleRoutes = [
    { path: '/auth', route: authRoute },
    { path: "/message", route: messageRouter },
    { path: "/protocol", route: protocolRouter },
    { path: "/sponsor", route: sponsorRouter }

];

moduleRoutes.forEach(route => appRouter.use(route.path, route.route));
export default appRouter;
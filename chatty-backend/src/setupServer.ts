import {Application, json, urlencoded, Response, Request, NextFunction} from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieSession from 'cookie-session';
import HTTP_STATUS from 'http-status-codes';
import 'express-async-errors';

const SERVER_PORT = 5000;

export class ChattyServer {
    private app: Application;

    constructor(app: Application){
        this.app = app;
    }

    public start(): void {
        this.securityMiddleware(this.app);
        this.standardMiddleware(this.app);
        this.routesMiddleware(this.app);
        this.globalErrorHandler(this.app);
        this.startServer(this.app);
    }

    private securityMiddleware(app: Application): void {
        app.use(
            cookieSession({
                name: 'session', // we need this name when we setup the AWS Load Balancer
                keys: ['test1', 'test2'],
                maxAge: 24 * 7 * 3600000, // will expire in 7 days
                secure: false
            })
        );
        app.use(hpp());
        app.use(helmet());
        app.use(
            cors({
                origin: '*',
                credentials: true, // it should be true if we want to use the cookie
                optionsSuccessStatus: 200, // for older browser like Iexplorer
                methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
            })
        );
    };
    private standardMiddleware(app: Application): void {
        app.use(compression());
        app.use(json({ limit: '50mb'})); // Max request size. if requestSize > 50mb through an error
        app.use(urlencoded({ extended: true, limit: '50mb'}));
    };
    private routesMiddleware(app: Application): void {};
    private globalErrorHandler(app: Application): void{};
    private async startServer(app: Application): Promise<void>{
        try{
            const httpServer: http.Server = new http.Server(app);
            this.startHttpServer(httpServer);
        } catch(err){
            console.error(err);
        }
    };
    private createSocketIO(httpServer: http.Server): void{};
    private startHttpServer(httpServer: http.Server): void{
        httpServer.listen(SERVER_PORT, () => {
            console.log(`[+] Server running on port ${SERVER_PORT}`); // Dont use console.log on Prod, use a lightweight lib like login
        });
    };
}
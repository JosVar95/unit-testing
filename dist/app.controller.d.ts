import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): Promise<{
        id: string;
        name: string;
        phone: string;
        email: string;
        birthdate: Date;
        gender: string;
    }[]>;
}

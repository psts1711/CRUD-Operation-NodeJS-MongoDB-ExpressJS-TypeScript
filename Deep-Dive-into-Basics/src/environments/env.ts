import { DevEnvironment } from "./dev.env";
import { ProdEnvironment } from "./pro.env";


export interface Environment{
    db_url: string;
    jwt_secret:string;
}

export function getEnvirmentVariables()
{
    if(process.env.NODE_ENV === 'production')
    {
        return ProdEnvironment
    }
    else
    {
        return DevEnvironment
    }
}
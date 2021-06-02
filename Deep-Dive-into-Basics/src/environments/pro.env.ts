import { Environment } from "./env";

export const ProdEnvironment:Environment = {
    db_url : 'mongodb+srv://adminuser:12345@cluster0.0guwh.mongodb.net/test?retryWrites=true&w=majority',
    jwt_secret: 'prodsecret'
    
}
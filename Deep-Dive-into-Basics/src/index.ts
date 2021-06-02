
import { Server } from './server';

let server = new Server().app;
let PORT = process.env.PORT || 7000;
server.listen(PORT, ()=>{
    console.log('Server is running on port number: ', PORT)
})



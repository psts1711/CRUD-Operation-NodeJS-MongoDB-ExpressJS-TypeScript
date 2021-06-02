function isBreadAvailable() {
    return false;
}

function isEggAvailable() {
    return true;
}

function bringBread(){
    return new Promise((resolve, reject) =>{

        if(isBreadAvailable() && isEggAvailable())
        {
            resolve('Eggs and Bread both are available')
        }
        else if(isBreadAvailable())
        {
            resolve('Here is your bread')
        }
        else if(isEggAvailable())
        {
            resolve('Here is your eggs')
        }
        else
        {
            reject('Eggs and Bread both are un-available')
        }
    })
}

/* 
// method 1 using then / catch method 
bringBread().then(data =>{
    console.log(data)
}).catch(err =>{
    console.log(err)
})
*/

// method 2 using async / await method 
async function final() {
    try{
            const myData = await bringBread()
            console.log('called after my data')
            return myData
    }catch(e){
        return Promise.reject(e)
    }
}

final().then(data =>{
    console.log(data)
}).catch(err =>{
    console.log(err)
})
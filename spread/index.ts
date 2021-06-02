// object

let object1 = {firstName:"Prafful", lastName:"Sinha", gender:"Male"}
let object2 = {...object1, testing:false,lastName:"Kumar"}
console.log(object2)

// array

let array1 = [1,2,3,4]
let array2 = [1,5,6,7]
let array3 = [...array1,array2,9,10] 
let array4 = [...array1,...array2,9,10] 
console.log(array3)
console.log(array4)

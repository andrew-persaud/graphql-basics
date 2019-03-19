const users = [{
    id: '12345',
    name: 'Mapleton',
    email: 'mip@meeps.com',
}, {
    id: '12346',
    name: 'Chickadee',
    email: 'chickadee@meeps.com'
}, {
    id: '12347',
    name: 'El Berto',
    email: 'elbip@meeps.com'
}]

const posts = [{
    id: "11" ,
    title: 'To be or not to be' ,
    body: 'To be',
    author: '12345'
}, {
    id: "12" ,
    title: 'Go Leafs Go' ,
    body: 'Scoreee',
    author: '12346'
}, {
    id: "13" ,
    title: 'Go do Homework' ,
    body: 'Nowwwww.',
    author: '12346'
}]

const comments = [{
    id : "100",
    text: 'GraphQL is amazing!',
    author: '12345',
    post: "12"
}, {
    id: "101",
    text: "I love NodeJS",
    author: '12346',
    post: "13"
}, {
    id: "102",
    text: "Java is boring.",
    author: '12346',
    post: "11"
}, {
    id: "103",
    text: "Mapleton rules",
    author: '12347',
    post: "11"
}]

const db = {
    users,
    posts,
    comments
}

export default db
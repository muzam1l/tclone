// // import { useAuth } from 'utils/context/auth'
// /**
//  * @return {Array} array of posts or throws Error (rejects)
//  * @param {String} url
//  */
// export async function fetchPosts(url) {
//     let res = fetch(url)
//     if (!res.ok && res.status === 401) {
//         this.context.logout()
//         throw Error('Not Authorised')
//     }
//     let data = await res.json();
//     if (data.posts && data.posts.length > 0) {
//         return data.posts;
//     }
//     throw Error('Something went wrong')
// }
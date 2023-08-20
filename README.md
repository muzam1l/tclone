[![Netlify Status](https://api.netlify.com/api/v1/badges/28362dd5-9756-4aac-b840-d99fcd6d3a5d/deploy-status)](https://app.netlify.com/sites/tclone/deploys)

## React front-end for tclone

Try it [here](https://tclone.muzam1l.com)

Back-end repo [here](https://github.com/muzam1l/tclone-api)

![Demo](./docs/tclone-demo2.gif)

This is my take on building a Twitter clone, I have tried to keep things simple and concise. With minimal modules, it is very lightweight and fast, yet very functional and feature-rich.

## Things working ⚡

- **State management** (using redux-toolkit)
Most of the state is global in the redux store. *Posts*, *Users*, etc are in normalized form (using `createAdapter`) and accessed using *selectors* by using the `CRUD` methods. Thus sticking solely to the *DUCKS* file pattern and redux-toolkit environment.

 - **Authentication** (passport)
 Authentication is done with passport `local-strategy` with sessions managed [server](https://github.com/muzam1l/tclone-api)-side via `httpOnly` cookies. The authentication state is also stored in sessionStorage for snappy reloads while also checking for session validity asynchronously.

- **Search** (mongodb native)
You can search for text in the posts or for hashtags (by prefixing search query with `#`) and for users/user mentions (by prefixing query with `@)`. Search is done using mongodb's search index queries.

- **Notifications** (native and push)
When enabled, it sends push notifications about replies, likes, follows, and things like that. Recent notifications can also be accessed from the `Notifications` page.

- **Trends and User suggestions** (_It ain't much but it's honest work_)
*Hashtags* with more frequent and recent posts are parsed and stored as trends, shown in the sidebar or on explore page. Users that you may not follow are also listed in 'Who to follow' banner on the sidebar. Trends are almost realtime, so go on and rise your hashtag to the trending section 💥.

- **Composing posts**
Though Posts are primarily text-based and concise, you can also preview the target posts when using 'Reply Posts' and 'Quote Posts'. Posts are also parsed for *#hashtags* and *@usernames* that you can click on. There is also the [emoji-mart](https://www.npmjs.com/package/emoji-mart) Emoji picker for handy emoji insertion. Link previews are also shown in posts using [react-tiny-link](https://www.npmjs.com/package/react-tiny-link).

 - **Styling** (bootstrap)
Styling is done with bootstrap. Bootstrap customization is mostly done by overriding Sass variables, extending classes, and custom classes. Responsiveness is always kept in mind, so this also looks good on mobile devices.

## TODO's

- [x] Likes, comments on the Posts, and maybe retweets.
- [x] Using Modals and popovers' for things like Post composition and hovering on User Profile for User detail.
- [x] Notifications and improved engagement.
- [ ] Toasts for some events.
- [ ] Dark mode.
- [ ] Cool new features that even Twitter would want to borrow 😎.

## Contributing

Do it 💥.

## Deploying

The current setup has a front-end deployed on Netlify connecting to the server via netlify redirects. It needs `VAPID` public keys corresponding to server keys for push notifications, and a server address to connect to. Below is what your environmental variables should be like.

```sh
REACT_APP_PUBLIC_VAPID_KEY=<corresponding public vapid key of vapid keys for push notifications>
REACT_APP_API_SERVER=<server url, like https://myserver.com for production>
```
Note: `REACT_APP_API_SERVER` key is not used in fetch calls, instead it is used in netlify redirects. On local, fetch calls are proxied via the `proxy` key in `package.json`. So if you plan to deploy it anywhere else, do the necessary changes accordingly.

Install deps: `npm install`.
Development server: `npm run start`.
Build: `npm run build` 

For info on deploying the server and generating the VAPID keys, check out the [tclone-api](https://github.com/muzam1l/tclone-api#deploying) repo.

## Footnote

If you are still reading this, get a life dude!


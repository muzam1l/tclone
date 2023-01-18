## React front-end for tclone

Try it [here](https://tclone.muzam1l.app)
back-end repo [here](https://github.com/muzam1l/tclone-api)

![Demo](./docs/tclone-demo2.gif)

It is my take on building a Twitter clone, I have tried to keep things simple and concise. With minimal modules, it is very lightweight and fast, yet very functional and feature-rich and also improving consistently.

## Things working ⚡

- **State management** (using redux-toolkit)
Most of the state is global in the redux store. Posts, Users, etc are in normalized form (by `createAdapter`) and accessed using selectors and using CRUD methods (by adapter), thus sticking solely to the DUCKS file pattern and redux-toolkit environment.

 - **Authentication** (passport)
 Authentication is done with passport `local-strategy` with sessions managed [server](https://github.com/muzam1l/tclone-api) side via cookies and cookies are `httpOnly` so not accessible in javascript. `log-in` session is detected in React, at the app start, by sending and checking a GET request to an authenticating api, and subsequent api requests also check for `403`, to destroy the session. The authentication state is stored in the redux store and also in sessionStorage for fast auth reloads.

- **Trends and User suggestions** (_It ain't much but it's honest work_)
Hashtags with more frequent and recent posts are parsed and stored as trends, shown in the sidebar or on explore page. You can click on them to search for posts that use those hashtags. Users that you may not follow are also listed on 'Who to follow' banner on the sideba. Trends are almost realtime, so go on and rise your hashtag to the trending section 💥.

- **Search** (native)
You can search for text in the posts or for hashtags (by prefixing search query with #) and for users/user mentions (by prefixing query with @) and all of this just works simply 🥳.

 - **Styling** (using bootstrap)
Styling is done with bootstrap. Bootstrap customization is mostly done by overriding Sass variables, extending classes, and custom classes. Responsiveness is always kept in mind, so this also looks good on mobile devices.

- **Notifications** (native and push)
This is something I added to improve user engagement. When enabled, it sends push notifications about replies, likes, follows, and things like that. Recent notifications can be accessed from the `Notifications` page.

- **Composing posts**
Though Posts are primarily text-based and concise, you can also preview the target posts when using 'Reply Posts' and 'Quote Posts'. Posts are also parsed for Hashtags and Usernames that you can click on. There is also the [emoji-mart](https://www.npmjs.com/package/emoji-mart) Emoji picker for handy emoji insertion. Link previews are also shown in posts using [react-tiny-link](https://www.npmjs.com/package/react-tiny-link).

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

The current setup has a front-end deployed on Netlify connecting to the server via netlify redirects. It needs VAPID public keys corresponding to server keys for push notifications, and a server address to connect to. Below is what your environmental variables should be like.

```sh
REACT_APP_PUBLIC_VAPID_KEY=<corresponding public vapid key of vapid keys for push notifications>
REACT_APP_API_SERVER=<server url, like https://myserver.com for production>
```
Note: `REACT_APP_API_SERVER` key is not used in fetch calls, instead it is used in netlify redirects. On local, fetch calls are proxied via the `proxy` key in `package.json`. So if you plan to deploy it anywhere else, do the necessary changes accordingly.

Install deps: `npm install`.
Development server: `npm run start`.
Build: `npm run build` 

For info on deploying the server and generating VAPID keys see the `Deploy` section of [tclone-api](https:github.com/muzam1l/tclone-api)

## Footnote

If you are still reading this, get a life dude!


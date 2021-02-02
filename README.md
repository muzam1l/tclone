## React front-end for tclone

Try it [here](https://tclone.netlify.app)
back-end repo [here](https://github.com/muzam1l/tclone-api)

![Demo](./docs/tclone-demo2.gif)

> _looks like twitter, but not_ 😊

It is my own take on building Twitter clone, I have tried to keep things simple and concise. With minimal modules needed, it is very lightweight and fast, yet very functional and feature-rich and improving consistently.

## Things working ⚡

- **State management** (UPDATED to use redux-toolkit)
  Although not in my first builds, where i had state mostly in components itself, now most of the state is global in redux store. Posts, Users etc are in normalised form (by `createAdapter`) and accessed using selectors and using CRUD methods (by adapter) thus sticking solely to ducks file pattern and redux-toolkit environment. This change combined with adding bootstarp has allowed me quickly add new features and made whole app very stable and functional, like spinners which used to be all around the place have been reduced heavily and app now feels more fluid. Now basic things like: likes, user_detail/timeline, post_detail/replies/reposts/quote_posts, notifications, which were missing initially are implemented, I will continue to improve it and add new features if required.

- **Styling** (UPDATED to use bootstrap)
  First step towards learning from my mistakes and improving this mess, i removed all of my custom css (courage 😎), and replaced it with bootstrap classes, now DOM and directories are both clean and more portable, accessibility should improve and extensibilty would now be easier . Bootstrap is customised to match twitter/tclone theme mostly with overriding Sass variables and also extending classes and adding my own ones too. This change lays the strong base to entend this project beyond!.

      This site also looks good and works perfectly on mobile, like good, so bootstrap got credit in that too

- **Notifications**
  This is something i added to improve user engagement. You are prompted to allow notifications once in a while if not enabled (don't call me cheesy!) and when enabled sends push notifications about replies, likes, follows and things like that. Recent ones are also stored in `/notifications` page for easy access and this page gets refreshed (in background) once in a while and displays number badge for unread notifications too. I must also mention and that these notifications (not the push ones) are not sent through sockets as it is first guessed, because Nelify (on which i host front-end right now) doesn't support socket proxying (which is must as i have cookie based auth) so as a workaroud setInterval does the trick for now!

- **Compose posts** (UPDATED to use modals)
  Though posts are primary text based(and emoji if it counts 🥴) and concise. Now i have added nice looking modals to write in, if that helps ¯\\_(ツ)_/¯. Modal based compose is also capable of previewing posts, and is used in reply_posts and quote_posts to display preview of target_posts. Posts are also parsed for hashtags and usernames, like you can click on user_mentions or hashtags in post (after posting). There is also [emoji-mart](https://www.npmjs.com/package/emoji-mart) emojie picker for handy emojie insertion and gif picker can also be expected in near future (contribute 🥺).

      Link previews are also shown in posts using [react-tiny-link](https://www.npmjs.com/package/react-tiny-link)

- **Pre populated posts** (now DISABLED in main project, can be enabled in forks though).
  ~~when you open [tclone](https://tclone.netlify.app/), you see a bunch of users and their tweets (after you follow them). These are actual recent tweets of these accounts on Twitter and fetched via twitter api and then populated in database (so no, NASA didn't log into this clone 💣). Tweet Model on this project is exactly compatible with Tweet objects returned by Twitter api so you can pre populate you own set of tweets (parsed automatically) for your own fork of this project (Go make one...---------------------------------------------------------------- please🥺).~~

- **Trends and User suggestions** (_It ain't much but it's honest work_)
  Hashtags with higher number and recent posts are parsed and stored as trends, shown in sidebar or on explore page, you can click on them to search for posts with given hashtags. Users you are not following are also listed in 'Who to follow' card on sidebar. Trends are now realtime, so go on rise your hastag to trending section 💥.

- **Search** (it is easily done through mongoDB queries but I was proud to have it 🥇)
  You can search for text that the posts contain or for hashtags (by prefixing search with #) and for users and user mentions (by prefixing query with @) and all of this just works and is enough to search through all of the database 🥳)

- **Authentication** (simple yet effective, just works)
  Authentication is done with passport local-strategy with sessions managed [server](https://github.com/muzam1l/tclone-api) side via cookies. Cookies are httpOnly so not accessible in javascript, log-in session is detected in React, at app start, by sending and checking get request to authenticating api, and subsequent api requests also check for `403`, to destroy session, as an added measure (this is not done repeatedly but in single 'fetch wrapper' function which hadles all requests `/src/api/request`). Authentication state is stored now in redux store as opposed to context api previously, and also in sessionStorage now, so reloads doesnt feel like reloads 🥳.

## TODO

All those things which I want to do and makes me learn smarting new and ........ lets see what I can do 🤷‍♂️.
Some of it would be

- [x] Adding react-bootstrap for styling
- [x] Adding Redux-toolkit for global state and utilities
- [x] Likes, commets on post and maybe include retweets now.
- [x] Using Modals and popovers' for things like compose posts and hover on user-link for user detail (like twitter😉).
- [x] Notifications and improving engagement, this include general fixed and features ~~and maybe socket-api (lying useless in dependencies for ages now😁)~~.
- [ ] Toasts for events like post posted, content updated, etc.
- [ ] Dark mode, not particularly excited about but will be fun messing with bootstraps sass variables ans mixins.
- [ ] Custom/Cool/New features that even twitter would want to borrow 😎. but for this community participation would be required.

## Contributing

This is my favorite part. Just do it...💥
There are no guidelines for code or whatsoever and I never write tests (because I can't 😁).
So just bombard me with pull requests 🥺.

## Deploying

Current setup has front-end deployed on netlify with api calls connected to heroku api server via netlify redirects. It needs VAPID public keys corresponding to server keys for push notifications, and api server address to connect to api. Below is how your enviromental variables should like (`.env` file on local and netlify variables when deployed on netlify)

```bash
REACT_APP_PUBLIC_VAPID_KEY=<corresponding public vapid key of vapid keys for push notifivations>
REACT_APP_API_SERVER=<server url, like https://myserver.herokuapp.com for production>
```

Note: `REACT_APP_API_SERVER` key is not used in fetch calls, instead used to build netlify redirects and on local, fetch calls are proxied via `proxy` key in `package.json`. So if you plan to deploy it anywhere else, make edits accordingly.

After that it is easy, just install deps, and run `npm run start` for dev server and `npm run build` to build.

For more info on deploying server and generating VAPID keys see `Deploy` sestion of [tclone-api](https:github.com/muzam1l/tclone-api)

## Footnote

If you are still reading up to this point, there is no special Treat for you, but I will say **Thank you**.

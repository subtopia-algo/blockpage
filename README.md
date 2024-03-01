# BlockPage

Demo OSS blog starter web app forked from [morethan-log](https://github.com/morethanmin/morethan-log) showcasing how it can be turned into a blog posting site with wallet based authentication and subscription based access to content using [Subtopia](https://subtopia.io).

## Prerequisites

### For Developing/Running Locally

- [node](https://nodejs.org/)
- [yarn](https://yarnpkg.com/)
- [vercel-cli](https://vercel.com/docs/cli)

### Platforms Required for Deployment

- [vercel](https://vercel.com/)
- [notion](https://www.notion.so/)
- [subtopia](https://subtopia.io)

## How to repurpose this demo for your own blog?

1. Fork the repository
2. Install dependencies

```
yarn install
```

3. Create `notion` account and duplicate the [template](https://www.notion.so/Morethan-Log-Template-64051ddca8c84c508a7e4799e4449592) to your workspace. Publish the page to web and get the page id from the URL. The app relies on [incremental static regeneration](https://nextjs.org/docs/basic-features/data-fetching#incremental-static-regeneration) to update content. The `revalidateTime` setting in `site.config.js` controls the revalidation time for [slug], index, in seconds.
4. Create `.env` file from `.env.template` and fill in the required values.
5. Run the app

```
yarn dev
```

6. Deploy the app to vercel

```
vercel init
vercel deploy
```

7. Create a product on [Subtopia TestNet](https://testnet.subtopia.io) and copy the product ID. Update the `productID:` fields in `SubtopiaClient` invocations within the project to link users to your product contract. This product contract is responsible for managing subscriptions and access to content, enabling the lookup of subscription metadata or membership status, among other features (detailed at [Subtopia Documentation](https://docs.subtopia.io)). In addition to the product contract, Subtopia will establish a [locker](https://docs.subtopia.io/how-it-works), acting as an escrow to collect of subscription payments from users (for instance, the blog readers). Should a user opt for a subscription, they have the option to deploy a `user locker`. This contrasts with the `creator locker` by serving as a state storage for swift access to manage all Subtopia-based product contracts. Refer to documentation for detailed breakdown of existing functionality and join our [discord](https://discord.com/invite/gzXtwTVj9a) community.

> Refer to [Subtopia MainNet](https://subtopia.io) for deploying on MainNet.

8. Configure environment variables in vercel

9. Done! Your blog is now live. Creating new content can be managed entirely on Notion. As long as the `NOTION_PAGE_ID` is set correctly and not exposed to the public, gated content will be unavailable for users without the subscription. To control content revalidation time refer to `revalidateTime` setting in the codebase.

## Credits

[morethanmin](https://github.com/morethanmin) - for creating a simple and easy to use OSS blog web app that served as the base for this demo.

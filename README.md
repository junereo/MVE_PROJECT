��
```
MVE_PROJECT
├─ .eslintignore
├─ .eslintrc.json
├─ .prettierignore
├─ .prettierrc
├─ README.md
├─ apps
│  ├─ tuner-admin
│  │  ├─ .eslintrc.json
│  │  ├─ .prettierrc
│  │  ├─ EC2.md
│  │  ├─ README.md
│  │  ├─ next-env.d.ts
│  │  ├─ next.config.mjs
│  │  ├─ package.json
│  │  ├─ postcss.config.mjs
│  │  ├─ src
│  │  │  ├─ app
│  │  │  │  ├─ README.md
│  │  │  │  ├─ components
│  │  │  │  │  ├─ SessionChecRer.tsx
│  │  │  │  │  ├─ layouts
│  │  │  │  │  │  ├─ header.tsx
│  │  │  │  │  │  └─ navigate.tsx
│  │  │  │  │  └─ ui
│  │  │  │  │     ├─ Button.tsx
│  │  │  │  │     ├─ DropDown.tsx
│  │  │  │  │     ├─ Input.tsx
│  │  │  │  │     ├─ Radio.tsx
│  │  │  │  │     ├─ Youtube.tsx
│  │  │  │  │     └─ modal.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ DonutChart.tsx
│  │  │  │  │  │  └─ Recjarts.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ favicon.ico
│  │  │  │  ├─ fonts
│  │  │  │  │  ├─ GeistMonoVF.woff
│  │  │  │  │  └─ GeistVF.woff
│  │  │  │  ├─ globals.css
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ login
│  │  │  │  │  ├─ components
│  │  │  │  │  │  └─ LoginFrom.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ mypage
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ provider.tsx
│  │  │  │  ├─ signup
│  │  │  │  │  ├─ components
│  │  │  │  │  │  └─ SignUpForm.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ survey
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ drop.tsx
│  │  │  │  │  │  ├─ youtubeVideo.tsx
│  │  │  │  │  │  └─ youtuveSerch.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ search
│  │  │  │  │     ├─ components
│  │  │  │  │     │  └─ youtude.tsx
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ surveyTest
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ youtubeSerch.tsx
│  │  │  │  │  │  └─ youtubeVideo.tsx
│  │  │  │  │  ├─ create
│  │  │  │  │  │  ├─ step1
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  ├─ step2
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ step3
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ search
│  │  │  │  │     └─ page.tsx
│  │  │  │  └─ template
│  │  │  │     └─ page.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useSessionCheck.tsx
│  │  │  ├─ lib
│  │  │  │  ├─ authError
│  │  │  │  │  ├─ loginHandler.ts
│  │  │  │  │  └─ singupHandler.ts
│  │  │  │  ├─ network
│  │  │  │  │  ├─ api.ts
│  │  │  │  │  ├─ axios.ts
│  │  │  │  │  ├─ errorHandler.ts
│  │  │  │  │  └─ ingerceptors.ts
│  │  │  │  └─ youtube.ts
│  │  │  ├─ store
│  │  │  │  ├─ authmeStore.ts
│  │  │  │  ├─ globalStore.ts
│  │  │  │  └─ surceyStore.ts
│  │  │  └─ types
│  │  │     └─ index.ts
│  │  ├─ tailwind.config.ts
│  │  └─ tsconfig.json
│  ├─ tuner-api
│  │  ├─ .eslintrc.json
│  │  ├─ .prettierrc
│  │  ├─ ABI
│  │  │  ├─ meta_transction_ABI.json
│  │  │  └─ survey1155_ABI.json
│  │  ├─ README.md
│  │  ├─ contract
│  │  │  ├─ BadgeERC1155.sol
│  │  │  ├─ Survey1155.sol
│  │  │  ├─ TunerERC20.sol
│  │  │  └─ metaTransacion.sol
│  │  ├─ package.json
│  │  ├─ prisma
│  │  │  ├─ migrations
│  │  │  │  ├─ 20250620091248_init
│  │  │  │  │  └─ migration.sql
│  │  │  │  └─ migration_lock.toml
│  │  │  └─ schema.prisma
│  │  ├─ src
│  │  │  ├─ app.ts
│  │  │  ├─ controllers
│  │  │  │  ├─ admin.controller.ts
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  └─ survey.controller.ts
│  │  │  ├─ middlewares
│  │  │  │  ├─ admin.middleware.ts
│  │  │  │  └─ auth.middleware.ts
│  │  │  ├─ models
│  │  │  │  ├─ admin.model.ts
│  │  │  │  ├─ auth.model.ts
│  │  │  │  └─ survey.model.ts
│  │  │  ├─ routes
│  │  │  │  ├─ admin.routes.ts
│  │  │  │  ├─ auth.routes.ts
│  │  │  │  ├─ index.ts
│  │  │  │  └─ survey.routes.ts
│  │  │  ├─ server.ts
│  │  │  ├─ services
│  │  │  │  ├─ admin.service.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  └─ survey.service.ts
│  │  │  ├─ types
│  │  │  │  ├─ admin.types.ts
│  │  │  │  ├─ auth.types.ts
│  │  │  │  └─ survey.types.ts
│  │  │  ├─ utils
│  │  │  │  ├─ auth.utils.ts
│  │  │  │  ├─ index.ts
│  │  │  │  └─ jwt.ts
│  │  │  └─ wallet
│  │  │     ├─ controllers
│  │  │     │  ├─ metaTransaction.controller.ts
│  │  │     │  ├─ survey.controller.ts
│  │  │     │  └─ txpool.controller.ts
│  │  │     ├─ middlewares
│  │  │     │  ├─ admin.middleware.ts
│  │  │     │  └─ auth.middleware.ts
│  │  │     ├─ routers
│  │  │     │  ├─ index.ts
│  │  │     │  ├─ survey.routes.ts
│  │  │     │  ├─ txpool.routes.ts
│  │  │     │  └─ wallet.routes.ts
│  │  │     ├─ services
│  │  │     │  ├─ IMetaTransctionService.ts
│  │  │     │  ├─ meta_transction.service.ts
│  │  │     │  ├─ survey.service.ts
│  │  │     │  └─ txpool.service.ts
│  │  │     ├─ utils
│  │  │     │  ├─ auth.utils.ts
│  │  │     │  ├─ index.ts
│  │  │     │  └─ jwt.ts
│  │  │     └─ workers
│  │  │        └─ txpool.worker.ts
│  │  ├─ tsconfig.json
│  │  └─ tsub.config.ts
│  └─ tuner-user
│     ├─ .eslintrc.json
│     ├─ .prettierrc
│     ├─ README.md
│     ├─ next-env.d.ts
│     ├─ next.config.mjs
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  └─ images
│     │     ├─ check.png
│     │     ├─ search.png
│     │     ├─ slide1.jpeg
│     │     ├─ slide2.jpeg
│     │     ├─ slide3.jpeg
│     │     ├─ slide4.jpeg
│     │     └─ x.png
│     ├─ src
│     │  ├─ app
│     │  │  ├─ (main)
│     │  │  │  ├─ components
│     │  │  │  │  ├─ Card.tsx
│     │  │  │  │  ├─ List.tsx
│     │  │  │  │  └─ Slider.tsx
│     │  │  │  └─ page.tsx
│     │  │  ├─ auth
│     │  │  │  ├─ components
│     │  │  │  │  ├─ GoogleLoginButton.tsx
│     │  │  │  │  ├─ KakaoLoginButton.tsx
│     │  │  │  │  ├─ LoginForm.tsx
│     │  │  │  │  └─ LogoutButton.tsx
│     │  │  │  ├─ page.tsx
│     │  │  │  └─ signup
│     │  │  │     ├─ components
│     │  │  │     │  └─ SignupForm.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ globals.css
│     │  │  ├─ google
│     │  │  │  └─ callback
│     │  │  │     ├─ components
│     │  │  │     │  └─ GoogleRedirectClient.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ layout.tsx
│     │  │  ├─ mypage
│     │  │  │  ├─ components
│     │  │  │  │  ├─ SurveyStatus.tsx
│     │  │  │  │  ├─ UserProfile.tsx
│     │  │  │  │  └─ WalletInfo.tsx
│     │  │  │  └─ page.tsx
│     │  │  ├─ oauth
│     │  │  │  └─ kakao
│     │  │  │     ├─ components
│     │  │  │     │  └─ KakaoRedirectClient.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ search
│     │  │  │  └─ page.tsx
│     │  │  └─ survey
│     │  │     ├─ components
│     │  │     │  └─ SurveyAccordion.tsx
│     │  │     └─ page.tsx
│     │  ├─ components
│     │  │  ├─ layouts
│     │  │  │  ├─ BottomNavbar.tsx
│     │  │  │  ├─ Footer.tsx
│     │  │  │  ├─ Header.tsx
│     │  │  │  ├─ Wrapper.tsx
│     │  │  │  └─ sidebar.tsx
│     │  │  └─ ui
│     │  │     ├─ Accodion.tsx
│     │  │     ├─ Accordion.tsx
│     │  │     ├─ Button.tsx
│     │  │     ├─ Disclosure.tsx
│     │  │     ├─ Input.tsx
│     │  │     ├─ ListItem.tsx
│     │  │     └─ Modal.tsx
│     │  ├─ features
│     │  │  └─ auth
│     │  │     ├─ components
│     │  │     │  └─ AuthInitializer.tsx
│     │  │     ├─ hooks
│     │  │     │  └─ useUser.ts
│     │  │     ├─ services
│     │  │     │  ├─ login.ts
│     │  │     │  └─ signup.ts
│     │  │     ├─ store
│     │  │     │  └─ authStore.ts
│     │  │     ├─ types
│     │  │     │  └─ index.ts
│     │  │     └─ utils
│     │  │        ├─ validateLogin.ts
│     │  │        └─ validateSignup.ts
│     │  └─ lib
│     │     ├─ network
│     │     │  ├─ axios.ts
│     │     │  ├─ errorHandler.ts
│     │     │  └─ setupInterceptors.ts
│     │     └─ react-query
│     │        ├─ QueryClientProvider.tsx
│     │        └─ queryClient.ts
│     ├─ tailwind.config.ts
│     └─ tsconfig.json
├─ package.json
├─ packages
│  ├─ types
│  │  └─ index.d.ts
│  └─ utils
│     ├─ db.js
│     └─ db.ts
├─ pnpm-workspace.yaml
└─ tsconfig.json

```
```
MVE_PROJECT
├─ .eslintignore
├─ .eslintrc.json
├─ .prettierignore
├─ .prettierrc
├─ README.md
├─ apps
│  ├─ tuner-admin
│  │  ├─ .eslintrc.json
│  │  ├─ .prettierrc
│  │  ├─ EC2.md
│  │  ├─ README.md
│  │  ├─ components.json
│  │  ├─ next-env.d.ts
│  │  ├─ next.config.mjs
│  │  ├─ package.json
│  │  ├─ postcss.config.mjs
│  │  ├─ src
│  │  │  ├─ app
│  │  │  │  ├─ README.md
│  │  │  │  ├─ components
│  │  │  │  │  ├─ SessionChecRer.tsx
│  │  │  │  │  ├─ layouts
│  │  │  │  │  │  ├─ header.tsx
│  │  │  │  │  │  └─ navigate.tsx
│  │  │  │  │  └─ ui
│  │  │  │  │     ├─ Button.tsx
│  │  │  │  │     ├─ DropDown.tsx
│  │  │  │  │     ├─ Input.tsx
│  │  │  │  │     ├─ Radio.tsx
│  │  │  │  │     ├─ Youtube.tsx
│  │  │  │  │     └─ modal.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ DonutChart.tsx
│  │  │  │  │  │  └─ Recjarts.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ favicon.ico
│  │  │  │  ├─ fonts
│  │  │  │  │  ├─ GeistMonoVF.woff
│  │  │  │  │  └─ GeistVF.woff
│  │  │  │  ├─ globals.css
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ login
│  │  │  │  │  ├─ components
│  │  │  │  │  │  └─ LoginFrom.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ mypage
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ provider.tsx
│  │  │  │  ├─ signup
│  │  │  │  │  ├─ components
│  │  │  │  │  │  └─ SignUpForm.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ survey
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ drop.tsx
│  │  │  │  │  │  ├─ youtubeVideo.tsx
│  │  │  │  │  │  └─ youtuveSerch.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ search
│  │  │  │  │     ├─ components
│  │  │  │  │     │  ├─ Survey.tsx
│  │  │  │  │     │  └─ youtude.tsx
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ surveyTest
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ youtubeSerch.tsx
│  │  │  │  │  │  └─ youtubeVideo.tsx
│  │  │  │  │  ├─ create
│  │  │  │  │  │  ├─ complete
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  ├─ step1
│  │  │  │  │  │  │  ├─ components
│  │  │  │  │  │  │  │  └─ hash.tsx
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ step2
│  │  │  │  │  │     ├─ components
│  │  │  │  │  │     │  ├─ SurveyActions.tsx
│  │  │  │  │  │     │  ├─ SurveyCustomForm.tsx
│  │  │  │  │  │     │  ├─ SurveyNavigation.tsx
│  │  │  │  │  │     │  ├─ SurveyQuestionBase.tsx
│  │  │  │  │  │     │  └─ SurveyTabs.tsx
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ play
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ result
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  └─ search
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ template
│  │  │  │  │  ├─ components
│  │  │  │  │  │  └─ Templates.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ wallet
│  │  │  │     └─ page.tsx
│  │  │  ├─ components
│  │  │  │  └─ ui
│  │  │  │     ├─ accordion.tsx
│  │  │  │     ├─ button.tsx
│  │  │  │     ├─ card.tsx
│  │  │  │     ├─ input.tsx
│  │  │  │     └─ tabs.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useSessionCheck.tsx
│  │  │  ├─ lib
│  │  │  │  ├─ authError
│  │  │  │  │  ├─ loginHandler.ts
│  │  │  │  │  └─ singupHandler.ts
│  │  │  │  ├─ network
│  │  │  │  │  ├─ api.ts
│  │  │  │  │  ├─ axios.ts
│  │  │  │  │  ├─ errorHandler.ts
│  │  │  │  │  └─ ingerceptors.ts
│  │  │  │  ├─ utils.ts
│  │  │  │  └─ youtube.ts
│  │  │  ├─ store
│  │  │  │  ├─ authmeStore.ts
│  │  │  │  ├─ globalStore.ts
│  │  │  │  └─ surveyStore.ts
│  │  │  └─ types
│  │  │     └─ index.ts
│  │  ├─ tailwind.config.ts
│  │  └─ tsconfig.json
│  ├─ tuner-api
│  │  ├─ .eslintrc.json
│  │  ├─ .prettierrc
│  │  ├─ ABI
│  │  │  ├─ meta_transction_ABI.json
│  │  │  └─ survey1155_ABI.json
│  │  ├─ README.md
│  │  ├─ contract
│  │  │  ├─ BadgeERC1155.sol
│  │  │  ├─ Survey1155.sol
│  │  │  ├─ TunerERC20.sol
│  │  │  └─ metaTransacion.sol
│  │  ├─ package.json
│  │  ├─ prisma
│  │  │  ├─ migrations
│  │  │  │  ├─ 20250624120337_init
│  │  │  │  │  └─ migration.sql
│  │  │  │  └─ migration_lock.toml
│  │  │  └─ schema.prisma
│  │  ├─ src
│  │  │  ├─ app.ts
│  │  │  ├─ controllers
│  │  │  │  ├─ admin.controller.ts
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ survey.controller.ts
│  │  │  │  └─ user.controller.ts
│  │  │  ├─ middlewares
│  │  │  │  ├─ admin.middleware.ts
│  │  │  │  ├─ auth.middleware.ts
│  │  │  │  └─ user.middleware.ts
│  │  │  ├─ models
│  │  │  │  ├─ admin.model.ts
│  │  │  │  ├─ auth.model.ts
│  │  │  │  └─ survey.model.ts
│  │  │  ├─ routes
│  │  │  │  ├─ admin.routes.ts
│  │  │  │  ├─ auth.routes.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ survey.routes.ts
│  │  │  │  └─ user.routes.ts
│  │  │  ├─ server.ts
│  │  │  ├─ services
│  │  │  │  ├─ admin.service.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  ├─ survey.service.ts
│  │  │  │  └─ user.service.ts
│  │  │  ├─ types
│  │  │  │  ├─ admin.types.ts
│  │  │  │  ├─ auth.types.ts
│  │  │  │  └─ survey.types.ts
│  │  │  ├─ utils
│  │  │  │  ├─ auth.utils.ts
│  │  │  │  ├─ index.ts
│  │  │  │  └─ jwt.ts
│  │  │  └─ wallet
│  │  │     ├─ controllers
│  │  │     │  ├─ metaTransaction.controller.ts
│  │  │     │  ├─ survey.controller.ts
│  │  │     │  └─ txpool.controller.ts
│  │  │     ├─ middlewares
│  │  │     │  ├─ admin.middleware.ts
│  │  │     │  └─ auth.middleware.ts
│  │  │     ├─ routers
│  │  │     │  ├─ index.ts
│  │  │     │  ├─ survey.routes.ts
│  │  │     │  ├─ txpool.routes.ts
│  │  │     │  └─ wallet.routes.ts
│  │  │     ├─ services
│  │  │     │  ├─ IMetaTransctionService.ts
│  │  │     │  ├─ meta_transction.service.ts
│  │  │     │  ├─ survey.service.ts
│  │  │     │  └─ txpool.service.ts
│  │  │     ├─ utils
│  │  │     │  ├─ auth.utils.ts
│  │  │     │  ├─ index.ts
│  │  │     │  └─ jwt.ts
│  │  │     └─ workers
│  │  │        └─ txpool.worker.ts
│  │  ├─ tsconfig.json
│  │  └─ tsub.config.ts
│  └─ tuner-user
│     ├─ .eslintrc.json
│     ├─ .prettierrc
│     ├─ README.md
│     ├─ next-env.d.ts
│     ├─ next.config.mjs
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  └─ images
│     │     ├─ check.png
│     │     ├─ search.png
│     │     ├─ slide1.jpeg
│     │     ├─ slide2.jpeg
│     │     ├─ slide3.jpeg
│     │     ├─ slide4.jpeg
│     │     └─ x.png
│     ├─ src
│     │  ├─ app
│     │  │  ├─ (main)
│     │  │  │  ├─ components
│     │  │  │  │  ├─ Card.tsx
│     │  │  │  │  ├─ List.tsx
│     │  │  │  │  └─ Slider.tsx
│     │  │  │  └─ page.tsx
│     │  │  ├─ auth
│     │  │  │  ├─ components
│     │  │  │  │  ├─ GoogleLoginButton.tsx
│     │  │  │  │  ├─ KakaoLoginButton.tsx
│     │  │  │  │  ├─ LoginForm.tsx
│     │  │  │  │  └─ LogoutButton.tsx
│     │  │  │  ├─ page.tsx
│     │  │  │  └─ signup
│     │  │  │     ├─ components
│     │  │  │     │  └─ SignupForm.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ globals.css
│     │  │  ├─ google
│     │  │  │  └─ callback
│     │  │  │     ├─ components
│     │  │  │     │  └─ GoogleRedirectClient.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ layout.tsx
│     │  │  ├─ mypage
│     │  │  │  ├─ components
│     │  │  │  │  ├─ SurveyStatus.tsx
│     │  │  │  │  ├─ UserProfile.tsx
│     │  │  │  │  └─ WalletInfo.tsx
│     │  │  │  └─ page.tsx
│     │  │  ├─ oauth
│     │  │  │  └─ kakao
│     │  │  │     ├─ components
│     │  │  │     │  └─ KakaoRedirectClient.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ search
│     │  │  │  └─ page.tsx
│     │  │  └─ survey
│     │  │     ├─ components
│     │  │     │  └─ SurveyAccordion.tsx
│     │  │     └─ page.tsx
│     │  ├─ components
│     │  │  ├─ layouts
│     │  │  │  ├─ BottomNavbar.tsx
│     │  │  │  ├─ Footer.tsx
│     │  │  │  ├─ Header.tsx
│     │  │  │  └─ Wrapper.tsx
│     │  │  └─ ui
│     │  │     ├─ Accodion.tsx
│     │  │     ├─ Accordion.tsx
│     │  │     ├─ Button.tsx
│     │  │     ├─ Disclosure.tsx
│     │  │     ├─ Input.tsx
│     │  │     ├─ ListItem.tsx
│     │  │     └─ Modal.tsx
│     │  ├─ features
│     │  │  └─ auth
│     │  │     ├─ components
│     │  │     │  └─ AuthInitializer.tsx
│     │  │     ├─ hooks
│     │  │     │  └─ useUser.ts
│     │  │     ├─ services
│     │  │     │  ├─ login.ts
│     │  │     │  └─ signup.ts
│     │  │     ├─ store
│     │  │     │  └─ authStore.ts
│     │  │     ├─ types
│     │  │     │  └─ index.ts
│     │  │     └─ utils
│     │  │        ├─ validateLogin.ts
│     │  │        └─ validateSignup.ts
│     │  └─ lib
│     │     ├─ network
│     │     │  ├─ axios.ts
│     │     │  ├─ errorHandler.ts
│     │     │  └─ setupInterceptors.ts
│     │     └─ react-query
│     │        ├─ QueryClientProvider.tsx
│     │        └─ queryClient.ts
│     ├─ tailwind.config.ts
│     └─ tsconfig.json
├─ package.json
├─ packages
│  ├─ types
│  │  └─ index.d.ts
│  └─ utils
│     ├─ db.js
│     └─ db.ts
├─ pnpm-workspace.yaml
└─ tsconfig.json

```
```
MVE_PROJECT
├─ .eslintignore
├─ .eslintrc.json
├─ .prettierignore
├─ .prettierrc
├─ README.md
├─ apps
│  ├─ tuner-admin
│  │  ├─ .eslintrc.json
│  │  ├─ .prettierrc
│  │  ├─ EC2.md
│  │  ├─ README.md
│  │  ├─ components.json
│  │  ├─ next-env.d.ts
│  │  ├─ next.config.mjs
│  │  ├─ package.json
│  │  ├─ postcss.config.mjs
│  │  ├─ src
│  │  │  ├─ app
│  │  │  │  ├─ README.md
│  │  │  │  ├─ components
│  │  │  │  │  ├─ SessionChecRer.tsx
│  │  │  │  │  ├─ layouts
│  │  │  │  │  │  ├─ header.tsx
│  │  │  │  │  │  └─ navigate.tsx
│  │  │  │  │  └─ ui
│  │  │  │  │     ├─ Button.tsx
│  │  │  │  │     ├─ DropDown.tsx
│  │  │  │  │     ├─ Input.tsx
│  │  │  │  │     ├─ Radio.tsx
│  │  │  │  │     ├─ Youtube.tsx
│  │  │  │  │     └─ modal.tsx
│  │  │  │  ├─ dashboard
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ DonutChart.tsx
│  │  │  │  │  │  └─ Recjarts.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ favicon.ico
│  │  │  │  ├─ fonts
│  │  │  │  │  ├─ GeistMonoVF.woff
│  │  │  │  │  └─ GeistVF.woff
│  │  │  │  ├─ globals.css
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ login
│  │  │  │  │  ├─ components
│  │  │  │  │  │  └─ LoginFrom.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ mypage
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ provider.tsx
│  │  │  │  ├─ signup
│  │  │  │  │  ├─ components
│  │  │  │  │  │  └─ SignUpForm.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  ├─ survey
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ drop.tsx
│  │  │  │  │  │  ├─ youtubeVideo.tsx
│  │  │  │  │  │  └─ youtuveSerch.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ search
│  │  │  │  │     ├─ components
│  │  │  │  │     │  ├─ Survey.tsx
│  │  │  │  │     │  └─ youtude.tsx
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ surveyTest
│  │  │  │  │  ├─ components
│  │  │  │  │  │  ├─ youtubeSerch.tsx
│  │  │  │  │  │  └─ youtubeVideo.tsx
│  │  │  │  │  ├─ create
│  │  │  │  │  │  ├─ complete
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  ├─ step1
│  │  │  │  │  │  │  ├─ components
│  │  │  │  │  │  │  │  └─ hash.tsx
│  │  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  │  └─ step2
│  │  │  │  │  │     ├─ components
│  │  │  │  │  │     │  ├─ SurveyActions.tsx
│  │  │  │  │  │     │  ├─ SurveyCustomForm.tsx
│  │  │  │  │  │     │  ├─ SurveyNavigation.tsx
│  │  │  │  │  │     │  ├─ SurveyQuestionBase.tsx
│  │  │  │  │  │     │  └─ SurveyTabs.tsx
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  ├─ play
│  │  │  │  │  │  └─ page.tsx
│  │  │  │  │  ├─ result
│  │  │  │  │  │  └─ [id]
│  │  │  │  │  │     └─ page.tsx
│  │  │  │  │  └─ search
│  │  │  │  │     └─ page.tsx
│  │  │  │  ├─ template
│  │  │  │  │  ├─ components
│  │  │  │  │  │  └─ Templates.tsx
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ wallet
│  │  │  │     └─ page.tsx
│  │  │  ├─ components
│  │  │  │  └─ ui
│  │  │  │     ├─ accordion.tsx
│  │  │  │     ├─ button.tsx
│  │  │  │     ├─ card.tsx
│  │  │  │     ├─ input.tsx
│  │  │  │     └─ tabs.tsx
│  │  │  ├─ hooks
│  │  │  │  └─ useSessionCheck.tsx
│  │  │  ├─ lib
│  │  │  │  ├─ authError
│  │  │  │  │  ├─ loginHandler.ts
│  │  │  │  │  └─ singupHandler.ts
│  │  │  │  ├─ network
│  │  │  │  │  ├─ api.ts
│  │  │  │  │  ├─ axios.ts
│  │  │  │  │  ├─ errorHandler.ts
│  │  │  │  │  └─ ingerceptors.ts
│  │  │  │  ├─ utils.ts
│  │  │  │  └─ youtube.ts
│  │  │  ├─ store
│  │  │  │  ├─ authmeStore.ts
│  │  │  │  ├─ globalStore.ts
│  │  │  │  └─ surveyStore.ts
│  │  │  └─ types
│  │  │     └─ index.ts
│  │  ├─ tailwind.config.ts
│  │  └─ tsconfig.json
│  ├─ tuner-api
│  │  ├─ .eslintrc.json
│  │  ├─ .prettierrc
│  │  ├─ ABI
│  │  │  ├─ meta_transction_ABI.json
│  │  │  └─ survey1155_ABI.json
│  │  ├─ README.md
│  │  ├─ contract
│  │  │  ├─ BadgeERC1155.sol
│  │  │  ├─ Survey1155.sol
│  │  │  ├─ TunerERC20.sol
│  │  │  └─ metaTransacion.sol
│  │  ├─ package.json
│  │  ├─ prisma
│  │  │  ├─ migrations
│  │  │  │  ├─ 20250624120337_init
│  │  │  │  │  └─ migration.sql
│  │  │  │  └─ migration_lock.toml
│  │  │  └─ schema.prisma
│  │  ├─ src
│  │  │  ├─ app.ts
│  │  │  ├─ controllers
│  │  │  │  ├─ admin.controller.ts
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ survey.controller.ts
│  │  │  │  └─ user.controller.ts
│  │  │  ├─ middlewares
│  │  │  │  ├─ admin.middleware.ts
│  │  │  │  ├─ auth.middleware.ts
│  │  │  │  └─ user.middleware.ts
│  │  │  ├─ models
│  │  │  │  ├─ admin.model.ts
│  │  │  │  ├─ auth.model.ts
│  │  │  │  └─ survey.model.ts
│  │  │  ├─ routes
│  │  │  │  ├─ admin.routes.ts
│  │  │  │  ├─ auth.routes.ts
│  │  │  │  ├─ index.ts
│  │  │  │  ├─ survey.routes.ts
│  │  │  │  └─ user.routes.ts
│  │  │  ├─ server.ts
│  │  │  ├─ services
│  │  │  │  ├─ admin.service.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  ├─ survey.service.ts
│  │  │  │  └─ user.service.ts
│  │  │  ├─ types
│  │  │  │  ├─ admin.types.ts
│  │  │  │  ├─ auth.types.ts
│  │  │  │  └─ survey.types.ts
│  │  │  ├─ utils
│  │  │  │  ├─ auth.utils.ts
│  │  │  │  ├─ index.ts
│  │  │  │  └─ jwt.ts
│  │  │  └─ wallet
│  │  │     ├─ controllers
│  │  │     │  ├─ metaTransaction.controller.ts
│  │  │     │  ├─ survey.controller.ts
│  │  │     │  └─ txpool.controller.ts
│  │  │     ├─ middlewares
│  │  │     │  ├─ admin.middleware.ts
│  │  │     │  └─ auth.middleware.ts
│  │  │     ├─ routers
│  │  │     │  ├─ index.ts
│  │  │     │  ├─ survey.routes.ts
│  │  │     │  ├─ txpool.routes.ts
│  │  │     │  └─ wallet.routes.ts
│  │  │     ├─ services
│  │  │     │  ├─ IMetaTransctionService.ts
│  │  │     │  ├─ meta_transction.service.ts
│  │  │     │  ├─ survey.service.ts
│  │  │     │  └─ txpool.service.ts
│  │  │     ├─ utils
│  │  │     │  ├─ auth.utils.ts
│  │  │     │  ├─ index.ts
│  │  │     │  └─ jwt.ts
│  │  │     └─ workers
│  │  │        └─ txpool.worker.ts
│  │  ├─ tsconfig.json
│  │  └─ tsub.config.ts
│  └─ tuner-user
│     ├─ .eslintrc.json
│     ├─ .prettierrc
│     ├─ README.md
│     ├─ next-env.d.ts
│     ├─ next.config.mjs
│     ├─ package.json
│     ├─ postcss.config.mjs
│     ├─ public
│     │  └─ images
│     │     ├─ check.png
│     │     ├─ search.png
│     │     ├─ slide1.jpeg
│     │     ├─ slide2.jpeg
│     │     ├─ slide3.jpeg
│     │     ├─ slide4.jpeg
│     │     └─ x.png
│     ├─ src
│     │  ├─ app
│     │  │  ├─ (main)
│     │  │  │  ├─ components
│     │  │  │  │  ├─ Card.tsx
│     │  │  │  │  ├─ List.tsx
│     │  │  │  │  └─ Slider.tsx
│     │  │  │  └─ page.tsx
│     │  │  ├─ auth
│     │  │  │  ├─ components
│     │  │  │  │  ├─ GoogleLoginButton.tsx
│     │  │  │  │  ├─ KakaoLoginButton.tsx
│     │  │  │  │  ├─ LoginForm.tsx
│     │  │  │  │  └─ LogoutButton.tsx
│     │  │  │  ├─ page.tsx
│     │  │  │  └─ signup
│     │  │  │     ├─ components
│     │  │  │     │  └─ SignupForm.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ globals.css
│     │  │  ├─ google
│     │  │  │  └─ callback
│     │  │  │     ├─ components
│     │  │  │     │  └─ GoogleRedirectClient.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ layout.tsx
│     │  │  ├─ mypage
│     │  │  │  ├─ components
│     │  │  │  │  ├─ SurveyStatus.tsx
│     │  │  │  │  ├─ UserProfile.tsx
│     │  │  │  │  └─ WalletInfo.tsx
│     │  │  │  └─ page.tsx
│     │  │  ├─ oauth
│     │  │  │  └─ kakao
│     │  │  │     ├─ components
│     │  │  │     │  └─ KakaoRedirectClient.tsx
│     │  │  │     └─ page.tsx
│     │  │  ├─ search
│     │  │  │  └─ page.tsx
│     │  │  └─ survey
│     │  │     ├─ components
│     │  │     │  └─ SurveyAccordion.tsx
│     │  │     └─ page.tsx
│     │  ├─ components
│     │  │  ├─ layouts
│     │  │  │  ├─ BottomNavbar.tsx
│     │  │  │  ├─ Footer.tsx
│     │  │  │  ├─ Header.tsx
│     │  │  │  └─ Wrapper.tsx
│     │  │  └─ ui
│     │  │     ├─ Accodion.tsx
│     │  │     ├─ Accordion.tsx
│     │  │     ├─ Button.tsx
│     │  │     ├─ Disclosure.tsx
│     │  │     ├─ Input.tsx
│     │  │     ├─ ListItem.tsx
│     │  │     └─ Modal.tsx
│     │  ├─ features
│     │  │  └─ auth
│     │  │     ├─ components
│     │  │     │  └─ AuthInitializer.tsx
│     │  │     ├─ hooks
│     │  │     │  └─ useUser.ts
│     │  │     ├─ services
│     │  │     │  ├─ login.ts
│     │  │     │  └─ signup.ts
│     │  │     ├─ store
│     │  │     │  └─ authStore.ts
│     │  │     ├─ types
│     │  │     │  └─ index.ts
│     │  │     └─ utils
│     │  │        ├─ validateLogin.ts
│     │  │        └─ validateSignup.ts
│     │  └─ lib
│     │     ├─ network
│     │     │  ├─ axios.ts
│     │     │  ├─ errorHandler.ts
│     │     │  └─ setupInterceptors.ts
│     │     └─ react-query
│     │        ├─ QueryClientProvider.tsx
│     │        └─ queryClient.ts
│     ├─ tailwind.config.ts
│     └─ tsconfig.json
├─ package.json
├─ packages
│  ├─ types
│  │  └─ index.d.ts
│  └─ utils
│     ├─ db.js
│     └─ db.ts
├─ pnpm-workspace.yaml
└─ tsconfig.json

```
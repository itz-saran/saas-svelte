# SAAS full stack application using svelte and Sveltekit

### Note
- This project is no longer under development. Originally this project is started to learn about sveltekit and it's API's. The project is from youtube channel named Josh tried coding and here is the [link](https://www.youtube.com/watch?v=ucX2zXAZ1I0) to the video, but in Sveltekit instead of NextJS.
- Since there is no free credit with chat GPT, The project can't be proceeded further and other alternative like hugging face was not giving expected result. Also as previously said this project was to just utilize the API's of sveltekit as a part of learning. So the development was stopped. 
- In the video he will be using NextJS, Kinde Auth, Pinecone and chatGPT as libraries, but this project will use different dependecies instead of the ones used in video.
- The project may not follow best practices since it's a project to learn svelte and sveltekit for the first time.

## How to start the project.
- Clone or fork the project and install dependencies using PNPM(NPM can also be used by replacing pnpm-lock.json with package-lock.json).
- Add the required env variables(Environment variables and service providers mentioned below).
- Perform migrations, schema generation, or db push using `pnpm migrate`, `pnpm generate`, `pnpm push`(refer package.json for all available scripts).
- Run `pnpm dev` to start the development server.
- If you want to open db panel like prisma studio, run `pnpm studio`.

## Environment varibles
Create account on the following platforms and get respective API keys.
- Clerk - for authentication and session management  
`PUBLIC_CLERK_PUBLISHABLE_KEY="CLERK PUBLISHABLE KEY"`  
`CLERK_SECRET_KEY="CLERK SECRET KEY"`
- Your postgres database URL  
`DB_CONNECTION_STRING="postgresql://postgres:postgres@localhost:5432/dbname"`
- Cloudinary - Cloud storage storage service  
`CLOUDINARY_CLOUD_NAME="CLOUDINARY CLOUD NAME"`  
`CLOUDINARY_API_KEY="CLOUDINARY API KEY"`  
`CLOUDINARY_API_SECRET="CLOUDINARY SECRET KEY"`
- Pinecone - Vector database
(Not used in project but if you follow along the video you may need this)  
`PINECONE_API_KEY="PINECONE API KEY"`  
`PINECONE_ENVIRONMENT="PINECONE ENVIRONMENT"`
- HuggingFace - AI modal provider  
`HUGGINGFACE_API_KEY="HUGGINGFACE API KEY"`  
`HUGGINGFACE_API_ENDPOINT="HUGGINGFACE MODEL ENDPOINT"  `
- Mongo Atlas - To store extracted pdf data  
`MONGODB_ATLAS_ENDPOINT="MONGO DB ATLAS ENDPOINT"`
- Other clerk related keys(Change this according to requirements)  
`PUBLIC_SIGN_IN_URL="/sign-in"`  
`PUBLIC_SIGN_UP_URL="/sign-up"`  
`PUBLIC_AFTER_SIGN_IN_URL="/dashboard"`  
`PUBLIC_AFTER_SIGN_UP_URL="/sign-in"`  

# B3 Production

As the server is running on the cloud the only necessary thing to use the product is to have a gitlab account.

Thereafter just navigate to [the issue list](https://cscloud8-79.lnu.se)

## Passing grade
  1. - [X] The Node.js application should have a reversed proxy (Nginx) in front.
  2. - [X] The application shall be running through HTTPS.
  3. - [X] The server should only listen to port 80, 443 and 22(ssh). That means you should not be able to make requests directly to your node application and that all requests go through the reversed proxy.
  4. - [X] The Node.js application should be running through PM2 and be in production mode.
    If you use some kind of installation script on your production server, this should be added to your repository.

### Notes
All the passing grade requirements was done using the guided videos - there after the express server and websocket was implemented by me.
The program uses two routes, one for repo's and one for the the display of index and the webhook/login interactions.

## Higher grades

  1. - [X] First of all - You probably have other ideas, feel free to try them.
  2. - [X] Make a good looking and user friendly user interface.
  3. - [X] Implement a richer web client that can control the issues through the application (closing issues, adding comments, etc.). Think about security!
  4. - [ ] Add more integrations than issues, for example commits, tags and releases.
  5. - [X] Add some kind of custom authentication before the user can enter the application.
  6. - [X] Do an authentication through GitLab OAuth provider instead of the Basic Authentication. This way a user could log into your applications through their OAuth credentials and will see all of their resources. The user could then choose what repository to watch and the server application creates the webhook through the web API.

### Notes
1. I felt like having a popup showing what type of changes had been made was an interesting take. So I tried to implement that and make it look seemless in the application which I feel like I managed well. This was done by attaching to the webhook and depending on what type of event happens it creates a pop up.
2. While quite straight forward I feel like it is very user friendly and straight forward.
3. I added the possibility of closing issues and creating issues, however did not have the time to implement inside issue control like adding comments yet. This is all done through the access code acquired by the OAuth authentication therefore there can be no security breaches. The updates recieved through the webhook is also checked to come from gitlab and using my secret token that I have defined in my .env.
4. I added integrations in the terms of the webhook popup, however not the possibility to add so here it is down to what this implies.
5. Added through OAuth on point 6.
6. I implemented OAuth by using the authorization code flow, using this i implemented the access code to get the repos and issues related to each users rights and not only to my own repo. So the program works for whoever is authorized with the gitlab. It dynamically opens and closes webhooks based on teh repo it is currently looking at, so that you only get notices about the repository you are currently inspecting.

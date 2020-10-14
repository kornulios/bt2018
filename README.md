# BiaTech 2018/20
Newest and coolest bia manager in the world.

##Installation
    &> npm install
    &> npm start

## Game goals
Through careful team management player should try to achieve victory in Biathlon World Cup event. Team management will include mid-stages biathlonist's trainings and preparations, managing race performance by giving direct orders, trying to keep sportsman's optimal form to win race, balancing between speed and shooting accuracy.


## Views description:
**Start** screen - user selects Start, Load game options, additional app configuration present. Logo and large biathlon themed picture is displayed on background. Starting game leads to Select Team screen.

**Select team** - Teams list with flags displayed, selecting a team shows current biathlonists for M and F squads with stats. After selection option 'NEXT' is available (-> Championship view)

**Championship view** - tables with: 
- current championship scores (M/F/Teams)
- race schedule
- previous race results
Controls - switch to Team mgmt view

**Team Management view** - Screen shows list of player team's biathlonsts, photo, stats (center). Team flag on top. Next race controls on right.
Controls:
- assign workout for biathlonist between championship stages;
- assign orders and ski/weapon setup for next race;
- setup up team roster for next race;
Routes:
- switch to Championship view
- go to Next race
- Save game
- switch to Configuration view

**Race view** - main game screen shows track, player's team, controls, intermediate results (option to switch between checkpoints). After race finish Race results screen is shown

**Race result** - shows on top of Race view, shows resutls and next button that leads to Championship screen


## Biatech roadmap:

**RC 1**
- implement resutls pagination (2)
- create my team in-race panels (5)
- implement start roster scheduling (5)
- implement map creator (8)

- switch to playes ID in results (5)
- start-line players route (3)
- stage switch (5)

- enable player team interaction (8)
  - display a list of players for a team(3)

- add more teams with colors (3)
- enlarge map view (2)
- pause on browser tab switch (3)

- biathletes traits! (8)

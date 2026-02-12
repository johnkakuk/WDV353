Oh, I need a ReadMe? Okay, uhhh...

This is my Node assignment. There are many like it, but this one is mine.

My Node assignment is my best friend. It is my life. I must master it as I must master my life. 

Without me, my Node assignment is useless. Without my Node assignment, I am useless. I must test my Node assignment true. I must test more robustly than my enemy who is trying to get my course director's award. I must get a better grade than him before he gets a better grade than me. I will...

Anyway, this is a Node assignment. It POST, it GET, it GET/PATCH/DELETE by ID. Please direct any questions to my public relations manager.

See the demo here:
https://www.loom.com/share/49cb1230c5284730882b9e18431d97b6

Week 1: CRUD stuff & Jest tests
Week 2: Mongo stuff. Demo video: https://www.loom.com/share/dade674ccb914d5a904bff07e6712fc9

Week 2 additions:
- Created the beginnings of a music management database. Artists, albums and songs are present. Albums are related to artists, and songs are related to albums AND artists. Basic validation and error handling are present.
- ISSUE: Needs to throw an error and reject request if an object ID is used that doesn't already exist in the database. Pertains to adding albums and songs that relate to artists. UPDATE: Actually probably doesn't need this. Only reason the error happened is because I was manually writing requests. A well-behaved UI will probably get rid of this.
- Split project into client and server side directories. Installed blank Vite/React instance in client.
- Refactored controllers to be cleaner. Added .select() and .populate() functionality.

Week 3 additions:
- Implemented URL parameters that support filter, sort, and pagination
- Developed then splintered off geodata API app
- Wrote new tests to support URL parameters

Week 4 additions:
- Created basic React front end to provide interface for API